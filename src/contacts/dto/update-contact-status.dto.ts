import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContactStatusDto {
  @ApiProperty({
    example: 'accepted',
    enum: ['accepted', 'rejected'],
    description: 'Новый статус контакта'
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
