// src/event/dto/event-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { EventParticipantResponseDto } from './event-participant.dto';

// Define the enum in TypeScript for consistency
export enum EventStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export class EventResponseDto {
  @ApiProperty({ example: '5f8d0d55b4ef3b1f2c3d4e5a' })
  id: string;
  
  @ApiProperty({ example: 'Корпоратив' })
  title: string;
  
  @ApiProperty({ example: 50000 })
  totalAmount: number;
  
  @ApiProperty({ example: '2024-12-31T00:00:00.000Z' })
  deadline: Date;
  
  @ApiProperty({ type: UserResponseDto })
  creator: UserResponseDto;
  
  @ApiProperty({ type: [EventParticipantResponseDto], description: 'Список членов события' })
  members: EventParticipantResponseDto[];
  
  @ApiProperty({ example: '2023-01-01T10:00:00.000Z' })
  createdAt: Date;
  
  @ApiProperty({ enum: EventStatus, example: EventStatus.Pending, description: 'Статус события' })
  status: EventStatus; // New status field
}
