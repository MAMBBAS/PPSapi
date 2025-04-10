import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') || '10');
  }
  
  async create(createUserDto: CreateUserDto) {
    // Проверка на существующего пользователя
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          ...(createUserDto.phone ? [{ phone: createUserDto.phone }] : [])
        ]
      }
    });
    
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email или телефоном уже существует');
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
    
    // Создание пользователя с автоматическими категориями
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        phone: createUserDto.phone,
        passwordHash: hashedPassword,
        categories: {
          createMany: {
            data: this.getDefaultCategories()
          }
        }
      },
      select: this.userSafeFields()
    });
  }
  
  async findAll() {
    return this.prisma.user.findMany({
      select: this.userSafeFields()
    });
  }
  
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSafeFields()
    });
    
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    return user;
  }
  
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {};
    
    // Copy safe fields from DTO
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
    
    // If password is being updated
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
    
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: this.userSafeFields()
      });
    } catch (e) {
      throw new BadRequestException('Ошибка обновления пользователя');
    }
  }
  
  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: this.userSafeFields()
      });
    } catch (e) {
      throw new NotFoundException('Пользователь не найден');
    }
  }
  
  private userSafeFields() {
    return {
      id: true,
      email: true,
      phone: true,
      name: true,
      createdAt: true,
      updatedAt: true
    };
  }
  
  private getDefaultCategories() {
    return [
      { name: 'Еда', type: 'expense', isSystem: true, icon: '🍔' },
      { name: 'Транспорт', type: 'expense', isSystem: true, icon: '🚗' },
      { name: 'Зарплата', type: 'income', isSystem: true, icon: '💰' },
      { name: 'Жилье', type: 'expense', isSystem: true, icon: '🏠' },
      { name: 'Развлечения', type: 'expense', isSystem: true, icon: '🎭' },
    ];
  }
  
  // Дополнительные методы
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        ...this.userSafeFields(),
        passwordHash: true // Для аутентификации
      }
    });
  }
  
  async validatePassword(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });
    
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }
}
