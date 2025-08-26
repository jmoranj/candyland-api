import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule],
})
export class ProductsModule {}
