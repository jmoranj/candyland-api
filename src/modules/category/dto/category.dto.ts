import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoriesDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  categoryIcon: string;
}

export class UpdateCategoriesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryIcon?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryName?: string;
}
