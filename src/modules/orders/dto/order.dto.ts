import { PartialType } from '@nestjs/mapped-types';
import { Status } from '@prisma/client';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class CreateOrderProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  scheduled: Date;

  @IsArray()
  @IsNotEmpty()
  orderItems: CreateOrderProductDto[];
}

export class PagingDto{
  page: number;
  limit: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(Status)
  status: Status;
}