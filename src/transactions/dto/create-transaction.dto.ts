import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  MaxLength,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
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
  sum: number;
  
  @ApiProperty({
    example: 'income',
    description: 'Тип транзакции',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z',
    description: 'Дата транзакции (по умолчанию текущая)',
    required: false,
  })
  @IsOptional()
  date?: Date;
}
