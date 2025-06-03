import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}
  
  private async _checkAndSetGoalStatus(goalId: string, tx: any = this.prisma) {
    const goal = await tx.goal.findUnique({
      where: { id: goalId },
      select: { currentAmount: true, targetAmount: true, status: true },
    });
    
    if (!goal) {
      return null;
    }
    
    if (goal.currentAmount.comparedTo(goal.targetAmount) >= 0 && goal.status === GoalStatus.Pending) {
      await tx.goal.update({
        where: { id: goalId },
        data: { status: GoalStatus.Completed },
      });
      return { statusUpdated: true, newStatus: GoalStatus.Completed };
    } else if (goal.currentAmount.comparedTo(goal.targetAmount) < 0 && goal.status === GoalStatus.Completed) {
      await tx.goal.update({
        where: { id: goalId },
        data: { status: GoalStatus.Pending },
      });
      return { statusUpdated: true, newStatus: GoalStatus.Pending };
    }
    return { statusUpdated: false, currentStatus: goal.status };
  }
  
  async createGoal(creatorId: string, dto: CreateGoalDto) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId: creatorId,
          name: dto.name,
          targetAmount: new Decimal(dto.targetAmount),
          currentAmount: new Decimal(dto.currentAmount ?? 0),
          status: GoalStatus.Pending,
        },
      });
      
      await this._checkAndSetGoalStatus(goal.id, tx);
      
      return tx.goal.findUnique({
        where: { id: goal.id },
        select: {
          id: true,
          userId: true,
          name: true,
          currentAmount: true,
          targetAmount: true,
        }
      });
    });
  }
  
  async getAllGoals(userId: string) {
    return this.prisma.goal.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        currentAmount: true,
        targetAmount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async getGoalWithDetails(goalId: string, tx: any = this.prisma) {
    const goal = await tx.goal.findUnique({
      where: { id: goalId },
      select: {
        id: true,
        userId: true,
        name: true,
        currentAmount: true,
        targetAmount: true,
      },
    });
    if (!goal) {
      throw new NotFoundException(`Цель с ID ${goalId} не найдена.`);
    }
    return goal;
  }
  
  async updateGoal(goalId: string, userId: string, dto: UpdateGoalDto) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.findUnique({
        where: { id: goalId },
        select: { userId: true },
      });
      
      if (!goal) {
        throw new NotFoundException(`Цель с ID ${goalId} не найдена.`);
      }
      
      if (goal.userId !== userId) {
        throw new UnauthorizedException('Вы не можете обновить эту цель.');
      }
      
      await tx.goal.update({
        where: { id: goalId },
        data: {
          name: dto.name,
          targetAmount: dto.targetAmount !== undefined ? new Decimal(dto.targetAmount) : undefined,
          currentAmount: dto.currentAmount !== undefined ? new Decimal(dto.currentAmount) : undefined,
        },
      });
      
      await this._checkAndSetGoalStatus(goalId, tx);
      
      return tx.goal.findUnique({
        where: { id: goalId },
        select: {
          id: true,
          userId: true,
          name: true,
          currentAmount: true,
          targetAmount: true,
        }
      });
    });
  }
  
  async contributeToGoal(goalId: string, userId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.findUnique({
        where: { id: goalId },
        select: { userId: true, currentAmount: true, targetAmount: true, status: true },
      });
      
      if (!goal) {
        throw new NotFoundException(`Цель с ID ${goalId} не найдена.`);
      }
      
      if (goal.userId !== userId) {
        throw new UnauthorizedException('Вы не можете вносить вклад в эту цель.');
      }
      
      const newGoalCurrentAmount = new Decimal(goal.currentAmount).plus(new Decimal(amount));
      
      await tx.goal.update({
        where: { id: goalId },
        data: { currentAmount: newGoalCurrentAmount },
      });
      
      await this._checkAndSetGoalStatus(goalId, tx);
      
      return tx.goal.findUnique({
        where: { id: goalId },
        select: {
          id: true,
          userId: true,
          name: true,
          currentAmount: true,
          targetAmount: true,
        }
      });
    });
  }
  
  async deleteGoal(goalId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.findUnique({
        where: { id: goalId },
        select: { userId: true },
      });
      
      if (!goal) {
        throw new NotFoundException(`Цель с ID ${goalId} не найдена.`);
      }
      
      if (goal.userId !== userId) {
        throw new UnauthorizedException('Вы не являетесь создателем этой цели.');
      }
      
      await tx.goal.delete({
        where: { id: goalId },
      });
      return { message: 'Цель успешно удалена' };
    });
  }
}
