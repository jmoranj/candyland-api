import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoriesDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private  readonly prisma: PrismaService) {}

  async create(data: CategoriesDto) {
    const category = await this.prisma.category.create({
      data: {
        categoryName: data.categoryName,
      },
    });
    console.log('Category created:', category);
    return category;
  }
}
