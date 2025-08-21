import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto, productCreateSchema } from './product.schema';
import { ZodValidationPipe } from '../../pipes/ZodValidator.pipe';

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

  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }

  // @Get(':id')
  // @UsePipes(new ZodValidationPipe(productParamsSchema))
  // findOne(@Param('id') params: { id: string }) {
  //   return this.productsService.findOne(params.id);
  // }

  // @Put(':id')
  // @UsePipes(new ZodValidationPipe(productParamsSchema))
  // @UsePipes(new ZodValidationPipe(productUpdateSchema))
  // update(@Param('id') params: { id: string }, @Body() body: any) {
  //   return this.productsService.update(params.id, body);
  // }

  // @Delete(':id')
  // @UsePipes(new ZodValidationPipe(productParamsSchema))
  // remove(@Param('id') params: { id: string }) {
  //   return this.productsService.remove(params.id);
  // }
}
