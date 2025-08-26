import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrdersController],
  providers: [OrderService],
  imports: [PrismaModule],
})
export class OrdersModule {}
