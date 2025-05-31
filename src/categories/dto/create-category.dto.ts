import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Продукты',
    description: 'Название категории',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
  
  @ApiProperty({
    example: 'icon-shopping-cart',
    description: 'Иконка категории (опционально)',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;
  
  @ApiProperty({
    example: '#FF0000',
    description: 'Цвет категории в HEX (опционально)',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
  
  @ApiProperty({
    example: 'expense',
    description: 'Тип категории: income/expense/transfer',
    enum: ['income', 'expense', 'transfer'],
  })
  @IsString()
  @IsNotEmpty()
  type: 'income' | 'expense' | 'transfer';
}
