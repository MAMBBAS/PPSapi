import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from './create-transaction.dto';

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
    example: 'some-user-uuid',
    description: 'ID пользователя',
  })
  userId: string;
}
