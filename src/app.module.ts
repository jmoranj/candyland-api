import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/database/prisma.module';
import { OrdersModule } from './modules/orders/order.module';
import { ProductsModule } from './modules/product/product.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
