import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/ZodValidator.pipe';
import { CreateProductDto, productCreateSchema, productUpdateSchema, UpdateProductDto } from './product.schema';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(productCreateSchema))
    createBody: CreateProductDto,
  ) {
    return this.productsService.create(createBody);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string ) {
    return this.productsService.findByID(id);
  }

  @Put(':id')
  update(@Param('id') id: string , @Body(new ZodValidationPipe(productUpdateSchema)) body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string ) {
    return this.productsService.remove(id);
  }
}
