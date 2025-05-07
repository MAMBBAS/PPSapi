// error-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 401,
    description: 'HTTP статус код ошибки'
  })
  statusCode: number;
  
  @ApiProperty({
    example: ['Неверный пароль', 'Пользователь не найден'],
    description: 'Сообщения об ошибках',
    type: [String]
  })
  message: string[] | string;
  
  @ApiProperty({
    example: 'Unauthorized',
    description: 'Название ошибки'
  })
  error: string;
}
