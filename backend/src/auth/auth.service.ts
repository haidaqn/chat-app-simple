import { Injectable } from '@nestjs/common';
import { DbService } from 'src/base';

@Injectable()
export class AuthService {
  constructor(private readonly db: DbService) {}

  async login() {}

  async register() {}
}
