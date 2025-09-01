import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async findByEmail(data: AuthDto){
      return this.prisma.user.findUnique({
        where: { email: data.email }
      })
    }

  async signIn(data: AuthDto) {
    const user = await this.findByEmail(data);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!data.password || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload)
    console.log('Login bem-sucedido:', user , "\n",{Token: accessToken})

    return {
      accessToken
    };
  }
}
