import { Test, TestingModule } from '@nestjs/testing';
import Decimal from 'decimal.js';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './product.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(mockCreateProductDto);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateProductDto.name,
          description: mockCreateProductDto.description,
          price: mockCreateProductDto.price,
          category: mockCreateProductDto.category,
          imageUrl: mockCreateProductDto.imageUrl,
          status: mockCreateProductDto.status,
        },
      });

      expect(result).toEqual(mockProduct);
    });

    it('should create a product with default values when optional fields are not provided', async () => {
      const partialDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: new Decimal('29.99'),
        category: 'Test Category',
      };

      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.create(partialDto as CreateProductDto);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: partialDto.name,
          description: partialDto.description,
          price: partialDto.price,
          category: partialDto.category,
          imageUrl: '', // default value
          status: true, // default value
        },
      });
    });

    it('should handle empty imageUrl correctly', async () => {
      const dtoWithoutImage = {
        ...mockCreateProductDto,
        imageUrl: undefined,
      };

      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.create(dtoWithoutImage);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: dtoWithoutImage.name,
          description: dtoWithoutImage.description,
          price: dtoWithoutImage.price,
          category: dtoWithoutImage.category,
          imageUrl: '', // should default to empty string
          status: true,
        },
      });
    });

    it('should handle undefined status correctly', async () => {
      const dtoWithoutStatus = {
        ...mockCreateProductDto,
        status: undefined,
      };

      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.create(dtoWithoutStatus);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: dtoWithoutStatus.name,
          description: dtoWithoutStatus.description,
          price: dtoWithoutStatus.price,
          category: dtoWithoutStatus.category,
          imageUrl: dtoWithoutStatus.imageUrl,
          status: true, // should default to true
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: 'product-2' }];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByID', () => {
    it('should return a product by id', async () => {
      const productId = 'product-1';
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findByID(productId);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product is not found', async () => {
      const productId = 'non-existent-id';
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.findByID(productId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const productId = 'product-1';
      const updateData = {
        name: 'Updated Product',
        price: new Decimal('39.99'),
      };

      const updatedProduct = { ...mockProduct, ...updateData };
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateData);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          name: updateData.name,
          description: mockCreateProductDto.description,
          price: updateData.price,
          category: mockCreateProductDto.category,
          imageUrl: '',
          status: true,
        },
      });

      expect(result).toEqual(updatedProduct);
    });

    it('should handle partial updates correctly', async () => {
      const productId = 'product-1';
      const updateData = {
        status: false,
      };

      const updatedProduct = { ...mockProduct, status: false };
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      await service.update(productId, updateData);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          name: mockCreateProductDto.name,
          description: mockCreateProductDto.description,
          price: mockCreateProductDto.price,
          category: mockCreateProductDto.category,
          imageUrl: '',
          status: false,
        },
      });
    });

    it('should use default values for undefined fields in update', async () => {
      const productId = 'product-1';
      const updateData = {
        name: 'Updated Product',
      };

      mockPrismaService.product.update.mockResolvedValue(mockProduct);

      await service.update(productId, updateData);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          name: updateData.name,
          description: mockCreateProductDto.description,
          price: mockCreateProductDto.price,
          category: mockCreateProductDto.category,
          imageUrl: '',
          status: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      const productId = 'product-1';
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(productId);

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should handle deletion of non-existent product', async () => {
      const productId = 'non-existent-id';
      mockPrismaService.product.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.remove(productId)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('service configuration', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have PrismaService injected', () => {
      expect(prismaService).toBeDefined();
    });
  });
});
