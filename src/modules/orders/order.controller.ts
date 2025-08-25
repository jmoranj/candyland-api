import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/ZodValidator.pipe";
import { orderCreateDto, orderCreateSchema } from "./order.schema";
import { OrderService } from "./order.sevice";

@Controller('order')
export class OrdersController{
    constructor(private readonly ordersService: OrderService) {}
    @Post()
    create(
        @Body(new ZodValidationPipe(orderCreateSchema))
        createBody: orderCreateDto,
      ) {
        return this.ordersService.create(createBody);
      }
}