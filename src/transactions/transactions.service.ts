import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  
  private toTransactionResponseDto(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      title: transaction.title,
      sum: transaction.sum.toNumber(),
      type: transaction.type as TransactionType,
      date: transaction.date,
      userId: transaction.userId,
    };
  }
  
  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          title: dto.title,
          sum: new Decimal(dto.sum),
          type: dto.type,
          date: dto.date || new Date(),
          userId: userId,
        },
      });
      return this.toTransactionResponseDto(transaction);
    });
  }
  
  async findAll(
    userId: string,
    filters: {
      type?: TransactionType;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TransactionResponseDto[]> {
    const { type, startDate, endDate, limit, offset } = filters;
    
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: type,
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
    return this.prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findFirst({
        where: { id, userId },
      });
      
      if (!existingTransaction) {
        throw new NotFoundException('Транзакция не найдена или не принадлежит вам.');
      }
      
      const oldSum = existingTransaction.sum;
      const oldType = existingTransaction.type as TransactionType;
      
      const newSum = dto.sum !== undefined ? new Decimal(dto.sum) : oldSum;
      const newType = dto.type || oldType;
      
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          title: dto.title,
          sum: newSum,
          type: newType,
          date: dto.date,
        },
      });
      
      return this.toTransactionResponseDto(updatedTransaction);
    });
  }
  
  async remove(userId: string, id: string): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: {
          id,
          userId,
        },
      });
      
      if (!transaction) {
        throw new NotFoundException('Транзакция не найдена или не принадлежит вам.');
      }
      
      await tx.transaction.delete({ where: { id } });
    });
  }
}
