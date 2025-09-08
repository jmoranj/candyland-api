import { IsNotEmpty, IsString } from "class-validator";

export class CategoriesDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;
}
