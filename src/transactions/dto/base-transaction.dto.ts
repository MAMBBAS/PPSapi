import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  MaxLength
} from 'class-validator';

export class BaseTransactionDto {
  @ApiProperty({
    example: 'Зарплата',
    description: 'Название транзакции',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
  
  @ApiProperty({
    example: 15000.5,
    description: 'Сумма транзакции',
    minimum: 0.01,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  
  @ApiProperty({
    example: '2023-05-10T12:00:00Z',
    description: 'Дата транзакции (по умолчанию текущая)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: Date;
  
  @ApiProperty({
    example: 'Комментарий к транзакции',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
