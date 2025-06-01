import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 'На новый автомобиль', description: 'Название цели' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ example: 250000, description: 'Целевая сумма для сбора' })
  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;
  
  @ApiProperty({ example: 'USD', description: 'Валюта цели (например, USD, EUR, RUB)' })
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  @ApiProperty({ example: '2026-12-31T23:59:59Z', description: 'Желаемая дата достижения цели', required: false })
  @IsDateString()
  @IsOptional()
  targetDate?: Date;
  
  @ApiProperty({ example: 'Путешествия', description: 'Категория цели', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}
