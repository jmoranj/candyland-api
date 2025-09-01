import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { format, sum, toDecimal } from '../../utils/money';
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
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  private getOrderTotalPrice(
    orderItems: CreateOrderProductDto[],
    products: Product[],
  ) {
    const values = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new BadRequestException();
      }

      return toDecimal(product.price).times(item.quantity);
    });

    return format(sum(values));
  }

  private getUnitPrice(productId: string, products: Product[]) {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new BadRequestException();
    }

    return format(product.price);
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

    return format(toDecimal(product.price).times(quantity));
  }

  async getAll() {
    const orders = await this.prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
          },
        },
      },
    });
    return orders;
  }
}
