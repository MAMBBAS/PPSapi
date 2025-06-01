import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';
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
  
  @ApiProperty({ example: 'USD', description: 'Валюта цели' })
  currency: string;
  
  @ApiProperty({ example: '2026-12-31T23:59:59Z', description: 'Дата достижения цели', nullable: true })
  targetDate?: Date;
  
  @ApiProperty({ example: 'Путешествия', description: 'Категория цели', nullable: true })
  category?: string;
  
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания цели' })
  createdAt: Date;
  
  @ApiProperty({ example: '2025-06-01T12:00:00.000Z', description: 'Дата последнего обновления цели' })
  updatedAt: Date;
}
