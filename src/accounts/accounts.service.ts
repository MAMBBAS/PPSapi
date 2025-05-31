import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  
  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...dto,
        userId,
        balance: 0,
      },
    });
  }
  
  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }
  
  async findOne(id: string, userId: string) {
    return this.prisma.account.findUnique({
      where: { id, userId },
    });
  }
  
  async update(id: string, userId: string, dto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id, userId },
      data: dto,
    });
  }
  
  async remove(id: string, userId: string) {
    return this.prisma.account.delete({
      where: { id, userId },
    });
  }
  
  async updateBalance(accountId: string, amount: number) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
}
