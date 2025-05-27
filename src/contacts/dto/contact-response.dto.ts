import { ApiProperty } from '@nestjs/swagger';

// Если у вас еще нет этого DTO, создайте его
export class ContactResponseDto {
  @ApiProperty({
    description: 'ID записи контакта (связи) в базе данных',
    example: 'eebf5f8d-1e8b-41d6-9d9c-8391b13fa426',
  })
  contactId: string; // Изменено с 'id' на 'contactId'
  
  @ApiProperty({
    description: 'ID пользователя, с которым установлен контакт',
    example: '694bb5ee-b915-4b84-82c1-d311da01301a',
  })
  contactUserId: string;
  
  @ApiProperty({ example: 'Стёпа Мокрушин' })
  name: string;
  
  @ApiProperty({ example: null, nullable: true })
  avatar: string | null;
  
  @ApiProperty({ example: 'stepa@gmail.com' })
  email: string;
  
  @ApiProperty({ example: '+79832894116' })
  phone: string;
  
  @ApiProperty({ example: '2025-05-27T20:36:36.157Z' })
  createdAt: Date;
  
  @ApiProperty({ example: 'pending', enum: ['pending', 'accepted', 'blocked'] })
  status: string; // Или 'ContactStatus' если у вас есть enum
  
  @ApiProperty({
    description: 'True, если текущий пользователь является инициатором контакта',
    example: true,
  })
  isOwner: boolean;
}
