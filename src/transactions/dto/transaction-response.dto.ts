import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from './create-transaction.dto'; // Import TransactionStatus from here

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
  sum: number; // Corrected: this is 'sum', not 'amount'
  
  @ApiProperty({
    example: 'income',
    description: 'Тип транзакции',
    enum: TransactionType,
    enumName: 'TransactionType',
  })
  type: TransactionType;
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z', // Updated example to current year
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
  status: TransactionStatus; // Added back if you need it
  
  @ApiProperty({
    example: '14a5fee6-bc4c-49c9-b78e-9752746c46c6', // Updated example
    description: 'ID связанного счёта',
  })
  accountId: string;
  
  @ApiProperty({
    example: 'some-category-uuid', // Added example
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
  description?: string | null; // Added back if you need it
  
  @ApiProperty({
    example: ['salary', 'monthly'],
    description: 'Теги для классификации',
    type: [String],
    required: false,
  })
  tags?: string[]; // Added back if you need it
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z', // Updated example to current year
    description: 'Дата создания записи',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date; // Note: Prisma models usually have createdAt/updatedAt. Add these to your Prisma Transaction model if not already there.
  
  @ApiProperty({
    example: '2025-05-10T12:00:00Z', // Updated example to current year
    description: 'Дата последнего обновления',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date; // Note: Prisma models usually have createdAt/updatedAt. Add these to your Prisma Transaction model if not already there.
  
  @ApiProperty({
    example: 'some-user-uuid', // Added example
    description: 'ID пользователя',
  })
  userId: string;
}
