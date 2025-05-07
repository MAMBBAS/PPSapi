import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ example: 'd62d5bbe-afef-4953-a87c-431d611afdc4' })
  id: string;
  
  @ApiProperty({ example: 'Иван Иванов' })
  name: string;
  
  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;
  
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  
  @ApiProperty({ example: '+79161234567', required: false })
  phone?: string;
  
  @ApiProperty({ example: '2024-01-01T12:00:00.000Z' })
  createdAt: Date;
  
  @ApiProperty({ enum: ['pending', 'accepted', 'rejected'] })
  status: string;
  
  @ApiProperty({
    description: 'True если текущий пользователь создал этот контакт',
    example: true
  })
  isOwner: boolean;
  
  @ApiProperty({
    description: 'ID связанного пользователя',
    example: 'd62d5bbe-afef-4953-a87c-431d611afdc4'
  })
  otherUserId: string;
}
