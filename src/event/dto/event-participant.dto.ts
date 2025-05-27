import {ApiProperty} from '@nestjs/swagger';
import {UserResponseDto} from '../../users/dto/user-response.dto';

export class EventParticipantResponseDto {
  @ApiProperty({ example: 'some-event-participant-id' })
  id: string;
  
  @ApiProperty({ example: 'some-event-id' })
  eventId: string;
  
  @ApiProperty({ example: 'some-user-id' })
  userId: string;
  
  @ApiProperty({ example: 1000 })
  amount: number;
  
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
