import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AddParticipantDto } from './dto/add-participant.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  
  async createEvent(creatorId: string, dto: CreateEventDto) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title: dto.title,
          totalAmount: dto.totalAmount,
          deadline: dto.deadline,
          User: {
            connect: { id: creatorId }
          }
        }
      });
      
      await tx.eventParticipant.create({
        data: {
          eventId: event.id,
          userId: creatorId,
          amount: 0
        }
      });
      
      return this.getEvent(event.id);
    });
  }
  
  async addParticipant(eventId: string, dto: AddParticipantDto) {
    return this.prisma.eventParticipant.create({
      data: {
        eventId,
        userId: dto.userId,
        amount: dto.amount
      },
      include: {
        user: true,
        event: {
          include: {
            participants: true,
            User: true
          }
        }
      }
    });
  }
  
  async getAllEvents() {
    return this.prisma.event.findMany({
      include: {
        participants: {
          include: { user: true }
        },
        User: true
      }
    });
  }
  
  async getEvent(eventId: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: {
          include: { user: true }
        },
        User: true
      }
    });
  }
  
  async updateEvent(id: string, dto: CreateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        totalAmount: dto.totalAmount,
        deadline: dto.deadline
      },
      include: {
        participants: { include: { user: true } },
        User: true
      }
    });
  }
  
  async deleteEvent(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.eventParticipant.deleteMany({
        where: { eventId: id }
      });
      
      return tx.event.delete({
        where: { id },
        include: {
          participants: true,
          User: true
        }
      });
    });
  }
}
