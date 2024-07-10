import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import mongoose from 'mongoose';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { Messages } from '../../base';

export function MongoId(param: string, message: string = Messages.common.invalidId) {
  const customDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const query = request.params;
      const value = query[param];
      if (!mongoose.Types.ObjectId.isValid(value)) throw new BadRequestException(message);
      return value;
    },
    [
      (target, key, index) => {
        const explicit = Reflect.getMetadata(DECORATORS.API_PARAMETERS, target[key]) ?? [];
        Reflect.defineMetadata(
          DECORATORS.API_PARAMETERS,
          [
            ...explicit,
            {
              in: 'path',
              name: param,
              required: true,
              type: 'string',
            },
          ],
          target[key]
        );
      },
    ]
  )();

  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    customDecorator(target, propertyKey, parameterIndex);
  };
}
