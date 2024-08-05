import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '../repositories';
import { User } from '../models';

@Injectable()
export class DbService implements OnApplicationBootstrap {
  user: BaseRepository<User>;

  constructor(
    @InjectModel(User.name) private readonly userModel: PaginateModel<User>,
  ) {}

  onApplicationBootstrap() {
    this.user = new BaseRepository<User>(this.userModel);
  }
}
