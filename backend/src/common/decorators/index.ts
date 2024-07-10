import { IsOptional, ValidateIf, ValidationOptions } from 'class-validator';

export * from './public.decorator';
export * from './req-user.decorator';
export * from './custom-api-response.decorator';
export * from './api-pagination.decorator';
export * from './pagination.decorator';
export * from './mongo-id.decorator';

export function IsOptionalNonNullable(data?: {
  nullable: boolean;
  validationOptions?: ValidationOptions;
}) {
  const { nullable = false, validationOptions = undefined } = data || {};

  if (nullable) {
    // IsOptional allows null
    return IsOptional(validationOptions);
  }

  return ValidateIf((ob: any, v: any) => {
    return v !== undefined;
  }, validationOptions);
}
