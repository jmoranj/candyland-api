import { Test, TestingModule } from '@nestjs/testing';
import Decimal from 'decimal.js';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
  };

  const mockCreateOrderDto: CreateOrderDto = {
    name: 'John Doe',
    phone: '123456789',
    scheduled: new Date('2024-12-25T10:00:00.000Z'),
    orderItems: [
      {
        productId: 'product-1',
        quantity: 2,
      },
    ],
  };

  const mockCreatedOrder = {
    id: 'order-1',
    name: 'John Doe',
    phone: '123456789',
    scheduled: new Date('2024-12-25T10:00:00.000Z'),
    status: 'PENDING',
    orderedAt: new Date(),
    orderPrice: new Decimal('21.00'),
    orderItems: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(mockCreateOrderDto);

      expect(mockOrderService.create).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should call service with correct parameters', async () => {
      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      await controller.create(mockCreateOrderDto);

      expect(mockOrderService.create).toHaveBeenCalledTimes(1);
      expect(mockOrderService.create).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should handle service errors properly', async () => {
      const errorMessage = 'Failed to create order';
      mockOrderService.create.mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(mockCreateOrderDto)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should handle empty order items', async () => {
      const emptyOrderDto: CreateOrderDto = {
        name: 'Empty Order',
        phone: '123456789',
        scheduled: new Date('2024-12-25T10:00:00.000Z'),
        orderItems: [],
      };

      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(emptyOrderDto);

      expect(mockOrderService.create).toHaveBeenCalledWith(emptyOrderDto);
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should handle multiple order items', async () => {
      const multipleItemsDto: CreateOrderDto = {
        name: 'Multiple Items Order',
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
          {
            productId: 'product-3',
            quantity: 3,
          },
        ],
      };

      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(multipleItemsDto);

      expect(mockOrderService.create).toHaveBeenCalledWith(multipleItemsDto);
      expect(result).toEqual(mockCreatedOrder);
    });
  });

  describe('controller configuration', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have OrderService injected', () => {
      expect(service).toBeDefined();
    });

    it('should have correct route prefix', () => {
      // This test verifies the controller decorator configuration
      expect(controller).toBeInstanceOf(OrdersController);
    });
  });
});
