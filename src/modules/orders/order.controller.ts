import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}
  @Post()
  create(@Body() createBody: CreateOrderDto) {
    return this.ordersService.create(createBody);
  }
}
