import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../database/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET || 'defaultSecret',
    signOptions: { expiresIn: process.env.JWT_EXPIRESIN },
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
