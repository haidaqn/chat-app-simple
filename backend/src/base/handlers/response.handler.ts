import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  graphQlResponseHandler(res: any, context: ExecutionContext) {
    console.log('res', res.data);
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    if (context.getType<GqlContextType>() === 'graphql') {
      return exception;
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json({
        success: false,
        status: status,
        path: request.url,
        message: exception.message,
        type: exception.name,
      });
    }
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (context.getType<GqlContextType>() === 'graphql') return res;

    const statusCode = res?.status || HttpStatus.OK;

    if (response.status) response.status(statusCode);

    const paginationResult = (res?._pagination || {}) as PaginateResult<any>;
    let pagination = {};
    if (res?._pagination) {
      res._pagination = undefined;
      pagination = {
        page: paginationResult.page,
        totalPages: paginationResult.totalPages,
        hasNext: paginationResult.hasNextPage,
        totalItems: paginationResult.totalDocs,
      };
    }

    return {
      path: request?.url,
      message: res?.message || '',
      status: statusCode,
      data: res?.data || res,
      pagination: pagination,
    };
  }
}
