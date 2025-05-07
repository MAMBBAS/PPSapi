import { ApiProperty } from '@nestjs/swagger';

export class DeleteContactResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ example: 'Контакт успешно удален' })
  message: string;
  
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  deletedAt: Date;
}
