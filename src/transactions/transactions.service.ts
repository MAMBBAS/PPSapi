import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  
  private toTransactionResponseDto(transaction: any): TransactionResponseDto {
    return {
      createdAt: transaction.createdAt, status: transaction.status, updatedAt: new Date(),
      id: transaction.id,
      title: transaction.title,
      sum: transaction.sum.toNumber(),
      type: transaction.type as TransactionType,
      date: transaction.date,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      userId: transaction.userId
    };
  }
  
  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
    });
    if (!account) {
      throw new BadRequestException('Счёт не найден или не принадлежит вам.');
    }
    
    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, OR: [{ userId }, { userId: null }] }, });
      if (!category) {
        throw new BadRequestException('Категория не найдена или не принадлежит вам.');
      }
    }
    const transaction = await this.prisma.transaction.create({
      data: {
        title: dto.title,
        sum: dto.sum,
        type: dto.type,
        date: dto.date || new Date(),
        accountId: dto.accountId,
        userId: userId,
        categoryId: dto.categoryId,
      },
    });
    
    await this.prisma.account.update({
      where: { id: dto.accountId },
      data: {
        balance: {
          increment: dto.type === TransactionType.INCOME ? dto.sum : -dto.sum,
        },
      },
    });
    
    return this.toTransactionResponseDto(transaction);
  }
  
  async findAll(
    userId: string,
    filters: {
      type?: TransactionType;
      accountId?: string;
      categoryId?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TransactionResponseDto[]> {
    const { type, accountId, categoryId, startDate, endDate, limit, offset } = filters;
    
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: type,
        accountId: accountId,
        categoryId: categoryId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: offset ? Number(offset) : undefined,
      take: limit ? Number(limit) : undefined,
    });
    
    return transactions.map(transaction => this.toTransactionResponseDto(transaction));
  }
  
  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена или не принадлежит вам.');
    }
    
    return this.toTransactionResponseDto(transaction);
  }
  
  async update(userId: string, id: string, dto: UpdateTransactionDto): Promise<TransactionResponseDto> {
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    
    if (!existingTransaction) {
      throw new NotFoundException('Транзакция не найдена или не принадлежит вам.');
    }
    
    const oldSum = existingTransaction.sum.toNumber();
    const oldType = existingTransaction.type as TransactionType;
    const oldAccountId = existingTransaction.accountId;
    
    if (dto.accountId && dto.accountId !== oldAccountId) {
      const newAccount = await this.prisma.account.findFirst({
        where: { id: dto.accountId, userId },
      });
      if (!newAccount) {
        throw new BadRequestException('Новый счет не найден или не принадлежит вам.');
      }
    }
    
    if (dto.categoryId !== undefined && dto.categoryId !== existingTransaction.categoryId) {
      if (dto.categoryId !== null) {
        const newCategory = await this.prisma.category.findFirst({
          where: { id: dto.categoryId, OR: [{ userId }, { userId: null }] },
        });
        if (!newCategory) {
          throw new BadRequestException('Новая категория не найдена или не принадлежит вам.');
        }
      }
    }
    
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        title: dto.title,
        sum: dto.sum,
        type: dto.type,
        date: dto.date,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
      },
    });
    
    if (oldType === TransactionType.INCOME) {
      await this.prisma.account.update({
        where: { id: oldAccountId },
        data: { balance: { decrement: oldSum } },
      });
    } else if (oldType === TransactionType.EXPENSE) {
      await this.prisma.account.update({
        where: { id: oldAccountId },
        data: { balance: { increment: oldSum } },
      });
    }
    
    const newAccountId = dto.accountId || oldAccountId;
    const newType = dto.type || oldType;
    const newSum = dto.sum !== undefined ? dto.sum : oldSum;
    
    if (newType === TransactionType.INCOME) {
      await this.prisma.account.update({
        where: { id: newAccountId },
        data: { balance: { increment: newSum } },
      });
    } else if (newType === TransactionType.EXPENSE) {
      await this.prisma.account.update({
        where: { id: newAccountId },
        data: { balance: { decrement: newSum } },
      });
    }
    
    return this.toTransactionResponseDto(updatedTransaction);
  }
  
  async remove(userId: string, id: string): Promise<void> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена или не принадлежит вам.');
    }
    
    const accountId = transaction.accountId;
    const sum = transaction.sum.toNumber();
    const type = transaction.type as TransactionType;
    
    if (type === TransactionType.INCOME) {
      await this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: sum } },
      });
    } else if (type === TransactionType.EXPENSE) {
      await this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: sum } },
      });
    }
    
    await this.prisma.transaction.delete({ where: { id } });
  }
}
