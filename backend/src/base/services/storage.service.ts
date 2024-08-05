import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { DbService } from '../db';
import { v4 } from 'uuid';

@Injectable()
export class StorageService {
  s3: AWS.S3;
  s3Bucket: string;

  constructor(
    private config: ConfigService,
    private db: DbService,
  ) {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: this.config.get('storage.s3.accessKeyId'),
        secretAccessKey: this.config.get('storage.s3.secretAccessKey'),
      },
    });
    this.s3Bucket = this.config.get('storage.s3.bucketName');
  }

  async uploadAvatarFile(file: Express.Multer.File, fileName: string) {
    const processedImage = await sharp(file.buffer)
      .resize(256, 256, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .jpeg({
        quality: 80,
      })
      .toBuffer();
    return await this.s3
      .upload({
        Bucket: this.s3Bucket,
        Key: `avatars/${fileName}`,
        Body: processedImage,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }
  async getSignedUrl(key: string, expiration = 3600) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.s3Bucket,
      Key: key,
      Expires: expiration,
    });
  }
  async uploadProjectCoverFile(file: Express.Multer.File, fileName: string) {
    const processedImage = await sharp(file.buffer)
      .resize(1640, 856, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .jpeg({
        quality: 80,
      })
      .toBuffer();
    return await this.s3
      .upload({
        Bucket: this.s3Bucket,
        Key: `project-covers/${fileName}`,
        Body: processedImage,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }

  async uploadEmojiFile(
    file: Express.Multer.File,
    spaceId: string,
    shortCode: string,
  ) {
    const isGif = file.mimetype === 'image/gif';
    let processing = sharp(file.buffer, {
      animated: isGif,
    });
    if (isGif) processing = processing.gif();
    processing = processing.resize(64, 64, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    });

    const processedImage = await processing.toBuffer();

    return await this.s3
      .upload({
        Bucket: this.s3Bucket,
        Key: `emoji/${spaceId}/${shortCode}`,
        Body: processedImage,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }

  async uploadStickerFile(
    file: Express.Multer.File,
    spaceId: string,
    label: string,
  ) {
    const isGif = file.mimetype === 'image/gif';
    const isWebP = file.mimetype === 'image/webp';
    let processing = sharp(file.buffer, {
      animated: isGif || isWebP,
    });

    if (isGif || isWebP) {
      processing = processing.resize(64, 64, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      });
    }

    const processedImage = await processing.toBuffer();
    const key = label.replace(/ /g, '').replace(/[^\w\s]/gi, '') + v4();
    return await this.s3
      .upload({
        Bucket: this.s3Bucket,
        Key: `sticker/${spaceId}/${key}`,
        Body: processedImage,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }
}
