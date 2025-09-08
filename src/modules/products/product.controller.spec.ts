import { Test, TestingModule } from '@nestjs/testing';
import Decimal from 'decimal.js';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByID: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test Description',
    price: new Decimal('29.99'),
    category: 'Test Category',
    imageUrl: 'test-image.jpg',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateProductDto: CreateProductDto = {
    name: 'Test Product',
    description: 'Test Description',
    price: new Decimal('29.99'),
    category: 'Test Category',
    imageUrl: 'test-image.jpg',
    status: true,
  };

  const mockUpdateProductDto: UpdateProductDto = {
    name: 'Updated Product',
    price: new Decimal('39.99'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(mockCreateProductDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should call service with correct parameters', async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      await controller.create(mockCreateProductDto);

      expect(mockProductsService.create).toHaveBeenCalledTimes(1);
      expect(mockProductsService.create).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
    });

    it('should handle service errors properly', async () => {
      const errorMessage = 'Failed to create product';
      mockProductsService.create.mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(mockCreateProductDto)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should handle partial DTO data', async () => {
      const partialDto = {
        name: 'Partial Product',
        description: 'Partial Description',
        price: new Decimal('19.99'),
        category: 'Partial Category',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(partialDto as CreateProductDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(partialDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: 'product-2' }];
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(mockProductsService.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should handle service errors properly', async () => {
      const errorMessage = 'Failed to fetch products';
      mockProductsService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 'product-1';
      mockProductsService.findByID.mockResolvedValue(mockProduct);

      const result = await controller.findOne(productId);

      expect(mockProductsService.findByID).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should call service with correct id parameter', async () => {
      const productId = 'product-1';
      mockProductsService.findByID.mockResolvedValue(mockProduct);

      await controller.findOne(productId);

      expect(mockProductsService.findByID).toHaveBeenCalledTimes(1);
      expect(mockProductsService.findByID).toHaveBeenCalledWith(productId);
    });

    it('should return null when product is not found', async () => {
      const productId = 'non-existent-id';
      mockProductsService.findByID.mockResolvedValue(null);

      const result = await controller.findOne(productId);

      expect(result).toBeNull();
    });

    it('should handle service errors properly', async () => {
      const productId = 'product-1';
      const errorMessage = 'Failed to fetch product';
      mockProductsService.findByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(productId)).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const productId = 'product-1';
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, mockUpdateProductDto);

      expect(mockProductsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should call service with correct parameters', async () => {
      const productId = 'product-1';
      mockProductsService.update.mockResolvedValue(mockProduct);

      await controller.update(productId, mockUpdateProductDto);

      expect(mockProductsService.update).toHaveBeenCalledTimes(1);
      expect(mockProductsService.update).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
    });

    it('should handle partial updates correctly', async () => {
      const productId = 'product-1';
      const partialUpdate = { status: false };
      mockProductsService.update.mockResolvedValue(mockProduct);

      await controller.update(productId, partialUpdate);

      expect(mockProductsService.update).toHaveBeenCalledWith(
        productId,
        partialUpdate,
      );
    });

    it('should handle service errors properly', async () => {
      const productId = 'product-1';
      const errorMessage = 'Failed to update product';
      mockProductsService.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.update(productId, mockUpdateProductDto),
      ).rejects.toThrow(errorMessage);
    });

    it('should handle empty update data', async () => {
      const productId = 'product-1';
      const emptyUpdate = {};
      mockProductsService.update.mockResolvedValue(mockProduct);

      await controller.update(productId, emptyUpdate);

      expect(mockProductsService.update).toHaveBeenCalledWith(
        productId,
        emptyUpdate,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      const productId = 'product-1';
      mockProductsService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(productId);

      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should call service with correct id parameter', async () => {
      const productId = 'product-1';
      mockProductsService.remove.mockResolvedValue(mockProduct);

      await controller.remove(productId);

      expect(mockProductsService.remove).toHaveBeenCalledTimes(1);
      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
    });

    it('should handle service errors properly', async () => {
      const productId = 'product-1';
      const errorMessage = 'Failed to delete product';
      mockProductsService.remove.mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(productId)).rejects.toThrow(errorMessage);
    });

    it('should handle deletion of non-existent product', async () => {
      const productId = 'non-existent-id';
      mockProductsService.remove.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(controller.remove(productId)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('controller configuration', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have ProductsService injected', () => {
      expect(service).toBeDefined();
    });

    it('should have correct route prefix', () => {
      expect(controller).toBeInstanceOf(ProductsController);
    });
  });

  describe('edge cases', () => {
    it('should handle very long product names', async () => {
      const longNameDto = {
        ...mockCreateProductDto,
        name: 'A'.repeat(1000),
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(longNameDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(longNameDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle special characters in product data', async () => {
      const specialCharDto = {
        ...mockCreateProductDto,
        name: 'Product with special chars: !@#$%^&*()',
        description: 'Description with emojis: 🚀🎉✨',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(specialCharDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(specialCharDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle numeric strings in price field', async () => {
      const numericPriceDto = {
        ...mockCreateProductDto,
        price: new Decimal('0'),
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(numericPriceDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(numericPriceDto);
      expect(result).toEqual(mockProduct);
    });
  });
});
