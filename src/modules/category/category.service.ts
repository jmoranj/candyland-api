import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoriesDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private  readonly prisma: PrismaService) {}

  async create(data: CategoriesDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        categoryName: data.categoryName,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Categoria com esse nome já existe.');
    }

    const category = await this.prisma.category.create({
      data: {
        categoryName: data.categoryName,
        categoryIcon: data.categoryIcon,
      },
    });
    console.log('Category created:', category);
    return category;
  }

  async findAll() {
    return this.prisma.category.findMany();
  }
}
