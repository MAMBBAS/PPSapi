import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf
} from 'class-validator';

export class CreateContactDto {
  @ApiPropertyOptional({
    description: 'ID текущего пользователя (автоматически подставляется, если не указан)',
    example: 'd62d5bbe-afef-4953-a87c-431d611afdc4'
  })
  @IsOptional()
  @IsString()
  userId?: string;
  
  @ApiPropertyOptional({
    description: 'ID пользователя для добавления в контакты',
    example: 'd62d5bbe-afef-4953-a87c-431d611afdc4'
  })
  @IsOptional()
  @IsString()
  contactId?: string;
  
  @ApiPropertyOptional({
    description: 'Email пользователя для добавления в контакты',
    example: 'user@example.com'
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
  
  @ApiPropertyOptional({
    description: 'Телефон пользователя для добавления в контакты',
    example: '+79161234567'
  })
  @IsOptional()
  @IsPhoneNumber('RU')
  contactPhone?: string;
  
  @ApiPropertyOptional({
    description: 'Кастомное имя для контакта',
    example: 'Лучший друг'
  })
  @IsOptional()
  @IsString()
  contactName?: string;
  
  @ValidateIf(o => !o.contactId && !o.contactEmail && !o.contactPhone)
  @IsNotEmptyObject()
  atLeastOneIdentifier?: never;
}
