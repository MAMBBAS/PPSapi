import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  
  private async _checkAndSetEventStatus(eventId: string, tx: any = this.prisma) {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { members: true },
    });
    
    if (!event) {
      return null;
    }
    
    const totalCollectedAmount = event.members.reduce((sum, member) => sum + member.amount, 0);
    
    if (totalCollectedAmount >= event.totalAmount && event.status === EventStatus.Pending) {
      await tx.event.update({
        where: { id: eventId },
        data: { status: EventStatus.Completed },
      });
      return { statusUpdated: true, newStatus: EventStatus.Completed };
    } else if (totalCollectedAmount < event.totalAmount && event.status === EventStatus.Completed) {
      await tx.event.update({
        where: { id: eventId },
        data: { status: EventStatus.Pending },
      });
      return { statusUpdated: true, newStatus: EventStatus.Pending };
    }
    return { statusUpdated: false, currentStatus: event.status };
  }
  
  async createEvent(creatorId: string, dto: CreateEventDto) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title: dto.title,
          totalAmount: dto.totalAmount,
          deadline: dto.deadline,
          creatorId: creatorId,
          status: EventStatus.Pending,
        },
        include: {
          creator: true,
        },
      });
      
      const creatorProvidedMember = dto.members?.find(member => member.userId === creatorId);
      
      const creatorMemberData = {
        eventId: event.id,
        userId: creatorId,
        amount: creatorProvidedMember ? creatorProvidedMember.amount : 0,
      };
      
      const membersToCreate = [creatorMemberData];
      
      if (dto.members && dto.members.length > 0) {
        const otherMembers = dto.members.filter(member => member.userId !== creatorId);
        
        membersToCreate.push(
          ...otherMembers.map((member) => ({
            eventId: event.id,
            userId: member.userId,
            amount: member.amount,
          }))
        );
      }
      
      await tx.eventParticipant.createMany({
        data: membersToCreate,
        skipDuplicates: true,
      });
      
      await this._checkAndSetEventStatus(event.id, tx);
      
      return this.getEventWithDetails(event.id);
    });
  }
  
  async addParticipant(eventId: string, dto: AddParticipantDto) {
    return this.prisma.$transaction(async (tx) => {
      const eventExists = await tx.event.findUnique({ where: { id: eventId } });
      if (!eventExists) {
        throw new NotFoundException(`Событие с ID ${eventId} не найдено.`);
      }
      
      const userExists = await tx.user.findUnique({ where: { id: dto.userId } });
      if (!userExists) {
        throw new NotFoundException(`Пользователь с ID ${dto.userId} не найден.`);
      }
      
      const existingParticipant = await tx.eventParticipant.findFirst({
        where: {
          eventId: eventId,
          userId: dto.userId,
        },
      });
      
      let updatedParticipant;
      if (existingParticipant) {
        updatedParticipant = await tx.eventParticipant.update({
          where: { id: existingParticipant.id },
          data: { amount: dto.amount },
          include: {
            user: true,
            event: {
              include: {
                members: true,
                creator: true,
              },
            },
          },
        });
      } else {
        updatedParticipant = await tx.eventParticipant.create({
          data: {
            eventId,
            userId: dto.userId,
            amount: dto.amount,
          },
          include: {
            user: true,
            event: {
              include: {
                members: true,
                creator: true,
              },
            },
          },
        });
      }
      
      await this._checkAndSetEventStatus(eventId, tx);
      
      return updatedParticipant;
    });
  }
  
  async getAllEvents() {
    return this.prisma.event.findMany({
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async getEventWithDetails(eventId: string, tx: any = this.prisma) {
    return tx.event.findUnique({
      where: { id: eventId },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }
  
  async updateEvent(id: string, dto: CreateEventDto) {
    return this.prisma.$transaction(async (tx) => {
      const updatedEvent = await tx.event.update({
        where: { id },
        data: {
          title: dto.title,
          totalAmount: dto.totalAmount,
          deadline: dto.deadline,
        },
      });
      
      if (dto.members && dto.members.length > 0) {
        const currentParticipants = await tx.eventParticipant.findMany({
          where: { eventId: id },
        });
        
        const currentParticipantMap = new Map(
          currentParticipants.map(p => [p.userId, p])
        );
        
        const newParticipantIds = new Set(dto.members.map(m => m.userId));
        
        for (const [userId, participant] of currentParticipantMap.entries()) {
          if (!newParticipantIds.has(userId)) {
            console.log(`Удаляем участника: ${userId}`);
            await tx.eventParticipant.delete({
              where: { id: participant.id },
            });
          }
        }
        for (const memberDto of dto.members) {
          const existingParticipant = currentParticipantMap.get(memberDto.userId);
          
          if (existingParticipant) {
            if (existingParticipant.amount !== memberDto.amount) {
              console.log(`Обновляем участника <span class="math-inline">\{memberDto\.userId\}\: old amount\=</span>{existingParticipant.amount}, new amount=${memberDto.amount}`);
              await tx.eventParticipant.update({
                where: { id: existingParticipant.id },
                data: { amount: memberDto.amount },
              });
            } else {
              console.log(`Участник <span class="math-inline">\{memberDto\.userId\}\: сумма не изменилась \(</span>{existingParticipant.amount})`);
            }
          } else {
            console.log(`Создаем нового участника: <span class="math-inline">\{memberDto\.userId\} с amount\=</span>{memberDto.amount}`);
            await tx.eventParticipant.create({
              data: {
                eventId: id,
                userId: memberDto.userId,
                amount: memberDto.amount,
              },
            });
          }
        }
        console.log('--- Завершено обновление участников ---');
        
      } else {
        console.log('DTO.members пуст, удаляем всех участников.');
        await tx.eventParticipant.deleteMany({
          where: { eventId: id },
        });
      }
      
      await this._checkAndSetEventStatus(id, tx);
      
      const finalEventDetails = await this.getEventWithDetails(id, tx);
      console.log('Финальный ответ события:', finalEventDetails.members.map(m => ({ userId: m.userId, amount: m.amount })));
      return finalEventDetails;
    });
  }
  
  async deleteEvent(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.eventParticipant.deleteMany({
        where: { eventId: id },
      });
      
      return tx.event.delete({
        where: { id },
        include: {
          creator: true,
          members: true,
        },
      });
    });
  }
}
