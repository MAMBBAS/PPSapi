import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @ApiProperty({ example: 1500, description: 'Текущая накопленная сумма', required: false })
  @IsNumber()
  @IsOptional()
  currentSum?: number;
}
