import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { format, sum, toDecimal } from '../../utils/money';
import { PrismaService } from '../database/prisma.service';
import {
  CreateOrderDto,
  CreateOrderProductDto,
  UpdateOrderDto,
} from './dto/order.dto';

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

  async getAll(
    page: number,
    limit: number,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
      productId?: string;
    },
  ) {
    // validação para numeros negativos
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const finalOrder: Record<string, any> = {};

    // filtro por status
    if (filters?.status) {
      finalOrder.status = filters.status.toUpperCase();
    }

    // filtro por intervalo de datas
    if (filters?.startDate && filters?.endDate) {
      finalOrder.orderedAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    // filtro por produto
    if (filters?.productId) {
      finalOrder.orderItems = {
        some: {
          productId: filters.productId,
        },
      };
    }

    const orders = await this.prisma.order.findMany({
      skip,
      take: limit,
      where: finalOrder,
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { orderedAt: 'desc' },
    });

    const total = await this.prisma.order.count({ where: finalOrder });

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getByID(id: string) {
    const order = this.prisma.order.findUnique({
      where: { id },
    });
    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    //Verifica se o pedido existe
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    //Atualiza o status do pedido
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: data.status ?? existingOrder.status,
      },
    });

    return updatedOrder;
  }
}
