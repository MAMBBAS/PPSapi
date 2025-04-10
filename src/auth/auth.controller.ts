// auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {LoginDto} from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  
  @Post('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }
}
