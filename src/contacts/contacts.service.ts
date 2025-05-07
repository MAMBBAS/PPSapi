// src/contacts/contacts.service.ts
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
      return this.prisma.user.findUnique({
        where: { id: dto.contactId },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    if (dto.contactEmail) {
      return this.prisma.user.findUnique({
        where: { email: dto.contactEmail },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    if (dto.contactPhone) {
      return this.prisma.user.findUnique({
        where: { phone: dto.contactPhone },
        select: { id: true, name: true, avatar: true }
      });
    }
    
    throw new BadRequestException('Не указан идентификатор пользователя');
  }
  
  async createContactRequest(user: User, dto: CreateContactDto) {
    // Определяем ID текущего пользователя
    const currentUserId = dto.userId || user.id;
    
    // Ищем пользователя по любому идентификатору
    const contactUser = await this.findUserByIdentifier(dto);
    
    if (!contactUser) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    if (currentUserId === contactUser.id) {
      throw new ConflictException('Нельзя добавить самого себя');
    }
    
    // Проверяем существующую связь в обоих направлениях
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
    
    // Создаем контакт
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
    // Получаем все связи, где пользователь участвует
    const contacts = await this.prisma.userContact.findMany({
      where: {
        OR: [
          // Контакты, которые пользователь создал
          { userId },
          // Контакты, где пользователя добавили (независимо от статуса)
          { contactUserId: userId }
        ]
      },
      include: {
        // Информация о другом пользователе в контакте
        contactUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        // Информация о самом пользователе (для контактов, где его добавили)
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
    
    // Преобразуем данные в единый формат
    return contacts.map(contact => {
      // Определяем, кто является "другим" пользователем в контакте
      const isOwner = contact.userId === userId;
      const otherUser = isOwner ? contact.contactUser : contact.user;
      
      return {
        id: contact.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
        email: otherUser.email,
        phone: otherUser.phone,
        createdAt: contact.createdAt,
        status: contact.status,
        // Показываем, кто инициатор контакта
        isOwner: isOwner,
        // ID другого пользователя
        otherUserId: otherUser.id
      };
    });
  }
  
  async deleteContact(contactId: string, currentUserId: string) {
    // Проверяем существование контакта и права на удаление
    const contact = await this.prisma.userContact.findUnique({
      where: { id: contactId }
    });
    
    if (!contact) {
      throw new NotFoundException('Контакт не найден');
    }
    
    // Проверяем, что текущий пользователь является участником контакта
    if (contact.userId !== currentUserId && contact.contactUserId !== currentUserId) {
      throw new ForbiddenException('Нет прав для удаления этого контакта');
    }
    
    // Удаляем контакт
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
