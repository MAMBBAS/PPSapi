import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID пользователя' })
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @ApiProperty({ example: 10000, description: 'Сумма взноса' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
