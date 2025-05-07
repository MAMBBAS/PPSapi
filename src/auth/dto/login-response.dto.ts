// login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен доступа',
  })
  access_token: string;
  
  @ApiProperty({
    example: { id: 1, email: 'user@example.com', name: 'Иван Иванов' },
    description: 'Данные пользователя',
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}
