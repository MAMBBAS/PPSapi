import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({ example: '5f8d0d55b4ef3b1f2c3d4e5a', description: 'ID пользователя, добавляемого в участники' })
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @ApiProperty({ example: 1000, description: 'Сумма вклада участника' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
