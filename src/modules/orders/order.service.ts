import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto, CreateOrderProductDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    const products: Product[] = await this.prisma.product.findMany({
      where: {
        id: { in: data.orderItems.map((product) => product.productId) },
      },
    });

    if (products.length !== data.orderItems.length) {
      throw new BadRequestException('Product not found');
    }

    const order = await this.prisma.order.create({
      data: {
        name: data.name,
        phone: data.phone,
        scheduled: data.scheduled,
        orderPrice: this.getOrderTotalPrice(data.orderItems, products),
        orderItems: {
          create: data.orderItems.map((p) => ({
            product: { connect: { id: p.productId } },
            quantity: p.quantity,
            unitPrice: this.getUnitPrice(p.productId, products),
            productTotalPrice: this.getProductTotalPrice(
              p.productId,
              p.quantity,
              products,
            ),
          })),
        },
      },
    });

    return order;
  }

  private getOrderTotalPrice(
    orderItems: CreateOrderProductDto[],
    products: Product[],
  ) {
    return orderItems
      .reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new BadRequestException();
        }

        return acc.plus(new Decimal(product.price).times(item.quantity));
      }, new Decimal(0))
      .toString();
  }

  private getUnitPrice(productId: string, products: Product[]) {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new BadRequestException();
    }

    return product.price;
  }

  private getProductTotalPrice(
    productId: string,
    quantity: number,
    products: Product[],
  ) {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new BadRequestException();
    }

    return new Decimal(product.price).times(quantity).toString();
  }
}
