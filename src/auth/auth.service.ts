// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private usersService: UsersService,) {}
  
  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hashedPassword,
        phone: dto.phone,
      },
    });
  }
  
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
    
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
