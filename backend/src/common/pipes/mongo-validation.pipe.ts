import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any) {
    const { value: id, message } = value;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(message || `Invalid ObjectId: ${id}`);
    }
    return id;
  }
}
