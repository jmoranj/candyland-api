import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateCategoriesDto) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Atualizar um produto' })
  // @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  // @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  // @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  update(
  @Param('id') id: string,
  @Body() body: UpdateCategoriesDto,
) {
  return this.categoryService.update(id, body);
}

  @UseGuards(AuthGuard)
  @Delete(':id')
    remove(@Param('id') id: string) {
      return this.categoryService.remove(id);
    }
}