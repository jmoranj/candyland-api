import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl ?? '',
        status: data.status ?? true,
      },
    });
    return product;
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findByID(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateProductDto>) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl ?? '',
        status: data.status ?? true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
