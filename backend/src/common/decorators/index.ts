import { IsOptional, ValidateIf, ValidationOptions } from 'class-validator';
export * from './api-pagination.decorator';
export * from './custom-api-response.decorator';
export * from './mongo-id.decorator';
export * from './req-user.decorator';

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
