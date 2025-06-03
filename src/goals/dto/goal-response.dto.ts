import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class GoalResponseDto {
  @ApiProperty({ example: 'uuid-of-goal', description: 'Уникальный ID цели' })
  id: string;
  
  @ApiProperty({ example: 'uuid-of-user-creator', description: 'ID пользователя, создавшего цель' })
  userId: string;
  
  @ApiProperty({ example: 'На новый автомобиль', description: 'Название цели' })
  name: string;
  
  @ApiProperty({ example: 250000.00, description: 'Целевая сумма' })
  targetAmount: Decimal;
  
  @ApiProperty({ example: 1500.00, description: 'Текущая накопленная сумма' })
  currentAmount: Decimal;
}
