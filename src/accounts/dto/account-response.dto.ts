// src/accounts/dto/account-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../entities/account.entity';

export class AccountResponseDto {
  @ApiProperty({
    example: '5f8d0d55b4ef3b1f2c3d4e5f',
    description: 'Уникальный идентификатор счёта',
  })
  id: string;
  
  @ApiProperty({
    example: 'Основной счёт',
    description: 'Название счёта',
    maxLength: 50,
  })
  name: string;
  
  @ApiProperty({
    example: 15000.75,
    description: 'Текущий баланс счёта',
    type: 'number',
    format: 'double',
  })
  balance: number;
  
  @ApiProperty({
    example: 'RUB',
    description: 'Валюта счёта (3-х буквенный код ISO)',
    minLength: 3,
    maxLength: 3,
  })
  currency: string;
  
  @ApiProperty({
    example: 'personal',
    description: 'Тип счёта',
    enum: AccountType,
    enumName: 'AccountType',
  })
  type: AccountType;
  
  @ApiProperty({
    example: 'Основной счёт для повседневных расходов',
    description: 'Описание счёта',
    required: false,
    nullable: true,
  })
  description?: string | null;
  
  @ApiProperty({
    example: ['cat_food', 'cat_transport'],
    description: 'ID категорий с кешбэком',
    type: [String],
    required: false,
  })
  cashbackCategories?: string[];
  
  @ApiProperty({
    example: '#FF0000',
    description: 'Цвет счёта в HEX-формате',
    required: false,
  })
  color?: string;
  
  @ApiProperty({
    example: 'wallet',
    description: 'Иконка счёта',
    required: false,
  })
  icon?: string;
  
  @ApiProperty({
    example: true,
    description: 'Является ли счёт активным',
    default: true,
  })
  isActive: boolean;
  
  @ApiProperty({
    example: '2023-05-10T12:00:00Z',
    description: 'Дата создания счёта',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  
  @ApiProperty({
    example: '2023-05-10T12:00:00Z',
    description: 'Дата последнего обновления счёта',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  
  @ApiProperty({
    example: 'user123',
    description: 'ID владельца счёта',
  })
  userId: string;
}
