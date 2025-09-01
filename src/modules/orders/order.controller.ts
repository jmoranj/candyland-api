import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}
  @Post()
  create(@Body() createBody: CreateOrderDto) {
    return this.ordersService.create(createBody);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.ordersService.getAll();
  }
}
