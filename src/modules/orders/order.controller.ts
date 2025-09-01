import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}
  @Post()
  create(@Body() createBody: CreateOrderDto) {
    return this.ordersService.create(createBody);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('productId') productId?: string,
  ) {
    return this.ordersService.getAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      { status, startDate, endDate, productId },
    );
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.getByID(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() data: UpdateOrderDto
  ) {
    return this.ordersService.update(id, data);
  }
}
