import {ApiPropertyOptional, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'newpassword123', required: false })
  password?: string;
}
