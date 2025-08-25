import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { orderCreateDto } from './order.schema';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: orderCreateDto) {

  const products = await this.prisma.product.findMany({
    where:{
      id: {in:data.orderItems.map((product)=> product.productId )}
    }
  })

  if(products.length !== data.orderItems.length){
    throw new BadRequestException
  }
  
  const order = await this.prisma.order.create({
    data: {
      name: data.name,
      phone: data.phone,
      scheduled: data.scheduled,
      orderItems: {
      create: data.orderItems.map((p) => ({
        product: { connect: { id: p.productId } }, // conecta o produto já existente
        quantity: p.quantity, // salva no pivot
      })),
    },
    },
  });

  return order;
}
}