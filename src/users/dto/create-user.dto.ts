import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Имя слишком короткое (минимум 2 символа)' })
  @MaxLength(50, { message: 'Имя слишком длинное (максимум 50 символов)' })
  name: string;
  
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
  
  @IsString()
  @MinLength(8, { message: 'Пароль слишком короткий (минимум 8 символов)' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Пароль должен содержать цифры, заглавные и строчные буквы'
  })
  password: string;
  
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Некорректный номер телефона'
  })
  phone?: string;
}
