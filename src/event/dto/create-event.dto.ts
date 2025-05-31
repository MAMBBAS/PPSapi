import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EventMemberDto {
  @ApiProperty({ example: '5f8d0d55b4ef3b1f2c3d4e5a', description: 'ID пользователя' })
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @ApiProperty({ example: 1000, description: 'Сумма вклада участника' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreateEventDto {
  @ApiProperty({ example: 'Корпоратив', description: 'Название события' })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({ example: 50000, description: 'Общая сумма сбора' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  
  @ApiProperty({ example: '2024-12-31T00:00:00Z', description: 'Дедлайн сбора' })
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;
  
  @ApiProperty({
    type: [EventMemberDto],
    description: 'Список участников события с их вкладами, включая создателя, если есть взнос.',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventMemberDto)
  @IsOptional()
  members?: EventMemberDto[];
}
