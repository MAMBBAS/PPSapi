import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    example: 'Перевод между счетами',
    description: 'Название перевода',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({
    example: 1000,
    description: 'Сумма перевода',
    type: 'number',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
  
  @ApiProperty({
    example: '5f8d0d55b4ef3b1f2c3d4e5a',
    description: 'ID счёта-отправителя',
  })
  @IsString()
  @IsNotEmpty()
  fromAccountId: string;
  
  @ApiProperty({
    example: 'USD',
    description: 'Валюта перевода',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  @ApiProperty({
    example: '5f8d0d55b4ef3b1f2c3d4e5b',
    description: 'ID счёта-получателя',
  })
  @IsString()
  @IsNotEmpty()
  toAccountId: string;
  
  @ApiProperty({
    example: 1.0,
    description: 'Курс конвертации валют',
    default: 1.0,
  })
  @IsNumber()
  @IsPositive()
  exchangeRate: number = 1.0;
  
  @ApiProperty({
    example: '2023-05-10T12:00:00Z',
    description: 'Дата перевода',
    required: false,
  })
  date?: Date;
  
  @ApiProperty({
    example: 'Ежемесячный перевод',
    description: 'Описание',
    required: false,
  })
  description?: string;
}
