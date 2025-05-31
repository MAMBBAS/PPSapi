import { PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({ example: 'uuid', description: 'ID счёта' })
  id: string;
  
  @ApiProperty({ example: 'Основной счёт', description: 'Название счёта' })
  name: string;
  
  @ApiProperty({ example: 10000.5, description: 'Баланс счёта' })
  balance: number;
  
  @ApiProperty({ example: 'RUB', description: 'Валюта счёта' })
  currency: string;
  
  @ApiProperty({ example: ['cat1', 'cat2'], type: [String] })
  cashbackCategories: string[];
  
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;
  
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
