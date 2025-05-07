// create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
  
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name: string;
  
  @ApiProperty({ example: 'securePassword123', description: 'Пароль' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
  
  @ApiPropertyOptional({ example: '+79123456789', description: 'Номер телефона' })
  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Некорректный формат номера телефона' })
  phone?: string;
}
