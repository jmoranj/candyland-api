import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';
import { SharedJwtModule } from '../shared/jwt.module';

@Module({
  controllers: [OrdersController],
  providers: [OrderService],
  imports: [PrismaModule, SharedJwtModule],
})
export class OrdersModule {}
