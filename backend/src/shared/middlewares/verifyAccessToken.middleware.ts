import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
// import { User } from '../../modules/user/models/user.model';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const user = req['user'] as User;
    //   if (!user || user.role !== 2003) {
    //     return res.status(401).json({
    //       success: false,
    //       message: 'No admin ..',
    //     });
    //   }
    //   next();
    // } catch (error) {
    //   console.log(error);
    //   return res.status(401).json({
    //     success: false,
    //     message: 'No admin ..',
    //   });
    // }
  }
}

@Injectable()
export class VerifyAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // if (req?.headers?.authorization?.startsWith('Bearer')) {
    //   try {
    //     const token = req.headers.authorization.split(' ')[1];
    //     const decoded = await this.jwtService.verifyAsync(token);
    //     req['user'] = decoded;
    //     next();
    //   } catch (err) {
    //     if (err.name === 'TokenExpiredError') {
    //       return res.status(401).json({ err: 1, msg: 'Token đã hết hạn' });
    //     }
    //     return res.status(401).json({ err: 1, msg: 'Yêu cầu xác thực!' });
    //   }
    // } else {
    //   return res.status(404).json({ err: 1, msg: 'Missing token !' });
    // }
  }
}
