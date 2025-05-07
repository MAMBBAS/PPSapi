import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Корпоратив', description: 'Название события' })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({ example: 50000, description: 'Общая сумма сбора' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  
  @ApiProperty({ example: '2024-12-31T00:00:00Z', description: 'Дедлайн сбора' })
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;
}
