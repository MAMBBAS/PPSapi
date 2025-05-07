// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
  
  @ApiProperty({
    example: 'your_password123',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}
