import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  MaxLength,
  IsUUID,
  IsArray,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
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
  
  @ApiProperty({
    example: '14a5fee6-bc4c-49c9-b78e-9752746c46c6',
    description: 'ID счёта, к которому относится транзакция',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
  
  @ApiProperty({
    example: 'some-category-uuid',
    description: 'ID категории транзакции (опционально)',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string | null;
  
  @ApiProperty({
    example: 'Комментарий к транзакции',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiProperty({
    example: 'completed',
    description: 'Статус транзакции',
    enum: TransactionStatus,
    required: false,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
  
  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Теги для классификации',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
