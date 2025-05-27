import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException, ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import {CreateContactDto} from './dto/create-contact.dto';
import {UpdateContactStatusDto} from './dto/update-contact-status.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}
  
  private async findUserByIdentifier(dto: CreateContactDto) {
    if (dto.contactId) {
      console.log(`Attempting to find user by ID: ${dto.contactId}`);
      return this.prisma.user.findUnique({
        where: { id: dto.contactId },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    if (dto.contactEmail) {
      console.log(`Attempting to find user by email: ${dto.contactEmail}`);
      return this.prisma.user.findUnique({
        where: { email: dto.contactEmail },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    if (dto.contactPhone) {
      console.log(`Attempting to find user by phone: ${dto.contactPhone}`);
      return this.prisma.user.findUnique({
        where: { phone: dto.contactPhone },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    throw new BadRequestException('Не указан идентификатор пользователя (ID, email или телефон)');
  }
  
  async createContactRequest(user: User, dto: CreateContactDto) {
    if (!user || !user.id) {
      throw new BadRequestException('ID текущего пользователя не определен. Убедитесь, что AuthGuard работает корректно.');
    }
    
    const currentUserId = user.id;
    
    if (!dto.contactId && !dto.contactEmail && !dto.contactPhone) {
      throw new BadRequestException('Необходимо указать хотя бы один идентификатор контакта (ID, email или телефон)');
    }
    
    let contactUser: User | null = null;
    
    if (dto.contactId) {
      contactUser = await this.prisma.user.findUnique({
        where: { id: dto.contactId },
      });
    } else if (dto.contactEmail) {
      contactUser = await this.prisma.user.findUnique({
        where: { email: dto.contactEmail },
      });
    } else if (dto.contactPhone) {
      contactUser = await this.prisma.user.findUnique({
        where: { phone: dto.contactPhone },
      });
    }
    
    if (!contactUser) {
      throw new NotFoundException('Пользователь не найден по указанному идентификатору');
    }
    
    if (currentUserId === contactUser.id) {
      throw new ConflictException('Нельзя добавить самого себя в контакты');
    }
    
    const existingContact = await this.prisma.userContact.findFirst({
      where: {
        OR: [
          { userId: currentUserId, contactUserId: contactUser.id },
          { userId: contactUser.id, contactUserId: currentUserId }
        ]
      }
    });
    
    if (existingContact) {
      throw new ConflictException('Контакт уже существует');
    }
    
    return this.prisma.userContact.create({
      data: {
        userId: currentUserId,
        contactUserId: contactUser.id,
        contactName: dto.contactName || contactUser.name,
        status: 'pending'
      },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });
  }
  
  async getUserContacts(userId: string) {
    const contacts = await this.prisma.userContact.findMany({
      where: {
        OR: [
          { userId },
          { contactUserId: userId }
        ]
      },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
    return contacts.map(contact => {
      const isOwner = contact.userId === userId;
      const otherUser = isOwner ? contact.contactUser : contact.user;
      
      return {
        // Переименовываем 'id' записи UserContact в 'contactId'
        contactId: contact.id,
        // 'contactUserId' остаётся ID другого пользователя
        contactUserId: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
        email: otherUser.email,
        phone: otherUser.phone,
        createdAt: contact.createdAt,
        status: contact.status,
        isOwner: isOwner,
      };
    });
    // --- КОНЕЦ ИЗМЕНЕНИЯ ---
  }
  
  async deleteContact(contactId: string, currentUserId: string) {
    const contact = await this.prisma.userContact.findUnique({
      where: { id: contactId }
    });
    
    if (!contact) {
      throw new NotFoundException('Контакт не найден');
    }
    
    if (contact.userId !== currentUserId && contact.contactUserId !== currentUserId) {
      throw new ForbiddenException('Нет прав для удаления этого контакта');
    }
    
    return this.prisma.userContact.delete({
      where: { id: contactId },
      include: {
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }
}
