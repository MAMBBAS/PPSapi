import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'd62d5bbe-afef-4953-a87c-431d611afdc4' })
  id: string;
  
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  
  @ApiProperty({ example: 'Иван Иванов' })
  name: string;
  
  @ApiProperty({ example: '+79123456789', required: false })
  phone?: string;
  
  @ApiProperty({ example: '2024-01-01T12:00:00.000Z' })
  createdAt: Date;
  
  @ApiProperty({ example: '2024-01-01T12:00:00.000Z' })
  updatedAt: Date;
}
