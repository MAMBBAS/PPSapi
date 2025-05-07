// auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('register')
  @HttpCode(HttpStatus.OK) // Добавляем установку статуса 200
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description: 'Создает нового пользователя в системе',
  })
  @ApiOkResponse({ // Меняем CreatedResponse на OkResponse
    description: 'Пользователь успешно зарегистрирован',
    type: CreateUserDto, // Лучше создать отдельный UserResponseDto
  })
  @ApiBody({ type: CreateUserDto })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Авторизация пользователя',
    description: 'Выполняет вход пользователя и возвращает JWT токен',
  })
  @ApiOkResponse({
    description: 'Успешная авторизация',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные учетные данные',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
