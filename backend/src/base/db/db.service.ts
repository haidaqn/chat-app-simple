import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from './repositories';

@Injectable()
export class DbService implements OnApplicationBootstrap {
  constructor() {}

  onApplicationBootstrap() {}
}
