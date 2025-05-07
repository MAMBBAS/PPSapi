import { ApiProperty } from '@nestjs/swagger';

class ParticipantDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;
  
  @ApiProperty({ example: 0 })
  amount: number;
  
  @ApiProperty({ example: 'Иван Иванов' })
  userName: string;
}

export class EventWithParticipantsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ example: 'Корпоратив' })
  title: string;
  
  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];
}
