import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRESIN },
    }),
  ],
  exports: [JwtModule],
})
export class SharedJwtModule {}
