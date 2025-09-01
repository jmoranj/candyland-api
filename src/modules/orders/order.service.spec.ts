import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

// Strict types for inspecting Prisma order.create call args in tests
type OrderItemCreate = {
  product: { connect: { id: string } };
  quantity: number;
  unitPrice: Decimal;
  productTotalPrice: Decimal;
};

type OrderCreateArg = {
  data: {
    name: string;
    phone: string;
    scheduled: Date;
    orderPrice: Decimal;
    orderItems: { create: OrderItemCreate[] };
  };
};

describe('OrderService', () => {
  let service: OrderService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  };

  const mockProducts: Product[] = [
    {
      id: 'product-1',
      name: 'Product 1',
      description: 'Description 1',
      price: new Decimal('10.50'),
      category: 'Category 1',
      imageUrl: 'image1.jpg',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'product-2',
      name: 'Product 2',
      description: 'Description 2',
      price: new Decimal('25.00'),
      category: 'Category 2',
      imageUrl: 'image2.jpg',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockCreateOrderDto: CreateOrderDto = {
    name: 'John Doe',
    phone: '123456789',
    scheduled: new Date('2024-12-25T10:00:00.000Z'),
    orderItems: [
      {
        productId: 'product-1',
        quantity: 2,
      },
      {
        productId: 'product-2',
        quantity: 1,
      },
    ],
  };

  const mockOrder = {
    id: 'order-1',
    name: 'John Doe',
    phone: '123456789',
    scheduled: new Date('2024-12-25T10:00:00.000Z'),
    status: 'PENDING',
    orderedAt: new Date(),
    orderPrice: new Decimal('46.00'),
    orderItems: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create(mockCreateOrderDto);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['product-1', 'product-2'] },
        },
      });

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateOrderDto.name,
          phone: mockCreateOrderDto.phone,
          scheduled: mockCreateOrderDto.scheduled,
          orderPrice: new Decimal('46.00'), // 2 * 10.50 + 1 * 25.00
          orderItems: {
            create: [
              {
                product: { connect: { id: 'product-1' } },
                quantity: 2,
                unitPrice: new Decimal('10.50'),
                productTotalPrice: new Decimal('21.00'),
              },
              {
                product: { connect: { id: 'product-2' } },
                quantity: 1,
                unitPrice: new Decimal('25.00'),
                productTotalPrice: new Decimal('25.00'),
              },
            ],
          },
        },
      });

      expect(result).toEqual(mockOrder);
    });

    it('should throw BadRequestException when products are not found', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProducts[0]]); // Only one product found

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockPrismaService.order.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when no products are found', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);

      await expect(service.create(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockPrismaService.order.create).not.toHaveBeenCalled();
    });

    it('should handle single product order correctly', async () => {
      const singleProductOrder: CreateOrderDto = {
        name: 'Single Product Order',
        phone: '123456789',
        scheduled: new Date('2024-12-25T10:00:00.000Z'),
        orderItems: [
          {
            productId: 'product-1',
            quantity: 3,
          },
        ],
      };

      mockPrismaService.product.findMany.mockResolvedValue([mockProducts[0]]);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      await service.create(singleProductOrder);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          name: singleProductOrder.name,
          phone: singleProductOrder.phone,
          scheduled: singleProductOrder.scheduled,
          orderPrice: new Decimal('31.50'), // 3 * 10.50
          orderItems: {
            create: [
              {
                product: { connect: { id: 'product-1' } },
                quantity: 3,
                unitPrice: new Decimal('10.50'),
                productTotalPrice: new Decimal('31.50'),
              },
            ],
          },
        },
      });
    });

    it('should handle zero quantity correctly', async () => {
      const zeroQuantityOrder: CreateOrderDto = {
        name: 'Zero Quantity Order',
        phone: '123456789',
        scheduled: new Date('2024-12-25T10:00:00.000Z'),
        orderItems: [
          {
            productId: 'product-1',
            quantity: 0,
          },
        ],
      };

      mockPrismaService.product.findMany.mockResolvedValue([mockProducts[0]]);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      await service.create(zeroQuantityOrder);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          name: zeroQuantityOrder.name,
          phone: zeroQuantityOrder.phone,
          scheduled: zeroQuantityOrder.scheduled,
          orderPrice: new Decimal('0.00'), // 0 * 10.50
          orderItems: {
            create: [
              {
                product: { connect: { id: 'product-1' } },
                quantity: 0,
                unitPrice: new Decimal('10.50'),
                productTotalPrice: new Decimal('0.00'),
              },
            ],
          },
        },
      });
    });
  });

  describe('private methods', () => {
    it('should calculate order total price correctly', async () => {
      await service.create(mockCreateOrderDto);

      // Read typed call arguments from jest mock without using any-typed matchers
      const orderCreateMock = mockPrismaService.order
        .create as unknown as jest.Mock<unknown, [OrderCreateArg]>;
      const [arg] = orderCreateMock.mock.calls[0];

      expect(arg.data.orderPrice).toBe(new Decimal('46.00'));
    });

    it('should calculate product total price correctly', async () => {
      await service.create(mockCreateOrderDto);

      const orderCreateMock = mockPrismaService.order
        .create as unknown as jest.Mock<unknown, [OrderCreateArg]>;
      const [arg] = orderCreateMock.mock.calls[0];

      const totals = arg.data.orderItems.create.map(
        (i: OrderItemCreate) => i.productTotalPrice,
      );
      expect(totals).toContain(new Decimal('21.00'));
      expect(totals).toContain(new Decimal('25.00'));
    });
  });
});
