import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export function OptionalProperty(options?: ApiPropertyOptions): PropertyDecorator {
  /* eslint-disable-next-line */
  return (target: Object, propertyKey: string | symbol) => {
    ApiPropertyOptional(options)(target, propertyKey);
    IsOptional()(target, propertyKey);
  };
}
