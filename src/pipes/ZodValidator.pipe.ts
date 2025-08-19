import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform<ZodSchema>(value: unknown): ZodSchema {
    try {
      return this.schema.parse(value) as ZodSchema;
    } catch (error: unknown) {
      console.log('Zod validation error:', error);

      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
      }

      throw new BadRequestException({
        message: 'Validation failed',
        error: 'Unknown validation error',
      });
    }
  }
}
