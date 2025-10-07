import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedJwtModule } from '../shared/jwt.module';

@Module({
  imports: [PrismaModule, SharedJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
