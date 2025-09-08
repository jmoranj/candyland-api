import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SharedJwtModule } from '../shared/jwt.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [PrismaModule, SharedJwtModule],
})
export class CategoryModule {}
