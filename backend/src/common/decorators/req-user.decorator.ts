import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ReqUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();

  return request.user;
});

export const GraphqlUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  return ctx.getContext().req.user;
});
