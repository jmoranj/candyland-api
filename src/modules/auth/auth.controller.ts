import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

interface LoginDto {
  email: string;
  password: string;
} 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
 
  @Post('login')
  async login(@Body() data: AuthDto) {
    console.log('Login body:', data);
    return this.authService.signIn(data);
  }
}
