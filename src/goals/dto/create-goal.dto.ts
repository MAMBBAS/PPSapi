import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 'На новый автомобиль', description: 'Название цели' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ example: 250000, description: 'Целевая сумма для сбора' })
  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;
  
  @ApiProperty({ example: 0, description: 'Текущая накопленная сумма', required: false })
  @IsNumber()
  @IsOptional()
  currentAmount?: number;
}
