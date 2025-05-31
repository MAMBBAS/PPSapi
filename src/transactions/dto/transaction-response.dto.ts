import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from './create-transaction.dto';

export class TransactionResponseDto {
  @ApiProperty({
    example: '5f8d0d55b4ef3b1f2c3d4e5f',
    description: 'Уникальный идентификатор транзакции',
  })
  id: string;
  
  @ApiProperty({
    example: 'Зарплата',
    description: 'Название транзакции',
    maxLength: 100,
  })
  title: string;
  
  @ApiProperty({
    example: 15000.75,
    description: 'Сумма транзакции (в валюте счёта)',
    type: 'number',
    format: 'double',
    minimum: 0.01,
  })
  sum: number;
  
  @ApiProperty({
    example: 'income',
    description: 'Тип транзакции',
    enum: TransactionType,
    enumName: 'TransactionType',
  })
  type: TransactionType;
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z',
    description: 'Дата совершения транзакции',
    type: 'string',
    format: 'date-time',
  })
  date: Date;
  
  @ApiProperty({
    example: 'completed',
    description: 'Статус транзакции',
    enum: TransactionStatus,
    enumName: 'TransactionStatus',
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;
  
  @ApiProperty({
    example: '14a5fee6-bc4c-49c9-b78e-9752746c46c6',
    description: 'ID связанного счёта',
  })
  accountId: string;
  
  @ApiProperty({
    example: 'some-category-uuid',
    description: 'ID категории (если есть)',
    required: false,
    nullable: true,
  })
  categoryId?: string | null;
  
  @ApiProperty({
    example: 'Зарплата за май',
    description: 'Дополнительное описание',
    required: false,
    nullable: true,
  })
  description?: string | null;
  
  @ApiProperty({
    example: ['salary', 'monthly'],
    description: 'Теги для классификации',
    type: [String],
    required: false,
  })
  tags?: string[];
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z',
    description: 'Дата создания записи',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z',
    description: 'Дата последнего обновления',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    example: 'some-user-uuid',
    description: 'ID пользователя',
  })
  userId: string;
}
