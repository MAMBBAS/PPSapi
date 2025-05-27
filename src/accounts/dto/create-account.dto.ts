// src/accounts/dto/create-account.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Основной счёт', description: 'Название счёта' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ example: 'RUB', description: 'Валюта счёта' })
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  @ApiProperty({ example: 'Основной счёт для повседневных трат', required: false })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiProperty({ example: ['cat1', 'cat2'], description: 'ID категорий для кешбэка', type: [String] })
  @IsString({ each: true })
  cashbackCategories: string[];
}
