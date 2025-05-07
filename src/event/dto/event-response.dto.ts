import { ApiProperty } from '@nestjs/swagger';

class ParticipantDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ example: 10000 })
  amount: number;
  
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' }
    }
  })
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class EventResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ example: 'Корпоратив' })
  title: string;
  
  @ApiProperty({ example: 50000 })
  totalAmount: number;
  
  @ApiProperty({ example: '2024-12-31T00:00:00Z' })
  deadline: Date;
  
  @ApiProperty({ example: '2023-12-01T12:00:00Z' })
  createdAt: Date;
  
  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];
  
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' }
    }
  })
  User: {
    id: string;
    name: string;
    email: string;
  };
}
