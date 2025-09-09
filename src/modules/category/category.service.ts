import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  
  constructor(private  readonly prisma: PrismaService) {}

  

  async create(data: CreateCategoriesDto) {
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
  
  async update(id: string, data: Partial<UpdateCategoriesDto>) {
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    throw new BadRequestException('ID inválido.');
  }

  const existingCategory = await this.prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new NotFoundException('Categoria não encontrada.');
  }

  const updatedCategory = await this.prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(data.categoryName !== undefined && { categoryName: data.categoryName }),
      ...(data.categoryIcon !== undefined && { categoryIcon: data.categoryIcon }),
    },
  });

  console.log('Category updated:', updatedCategory);
  return updatedCategory;
}


  async remove(id: string) {
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    throw new BadRequestException('ID inválido.');
  }

  const existingCategory = await this.prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existingCategory) {
    throw new NotFoundException('Categoria não encontrada.');
  }

  const deletedCategory = await this.prisma.category.delete({
    where: { id: Number(id) },
  });

  console.log('Category deleted:', deletedCategory);
  return deletedCategory;
}

}
