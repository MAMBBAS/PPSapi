import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus, Get, Param, Delete, Req
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthUser } from '../decorators/auth-user.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse, ApiParam, ApiOkResponse, ApiForbiddenResponse
} from '@nestjs/swagger';
import { ContactResponseDto } from './dto/contact-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';

@ApiTags('Контакты')
@Controller('contacts') // <-- Base path for all routes in this controller
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Добавить новый контакт',
    description: 'Добавление пользователя в контакты по ID, email или телефону'
  })
  @ApiBody({ type: CreateContactDto })
  @ApiCreatedResponse({
    description: 'Контакт успешно создан',
    type: ContactResponseDto
  })
  @ApiConflictResponse({
    description: 'Контакт уже существует или попытка добавить самого себя'
  })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBadRequestResponse({
    description: 'Не указан идентификатор или неверный формат данных'
  })
  async createContact(
    @AuthUser() user: User,
    @Body() dto: CreateContactDto,
    @Req() req: Request // Добавляем запрос для отладки
  ) {
    if (!user) {
      throw new Error('User object is missing - check your AuthGuard');
    }
    
    return this.contactsService.createContactRequest(user, dto);
  }
  
  // Этот эндпоинт останется /api/contacts/user/:userId
  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Получить контакты пользователя',
    description: 'Возвращает все контакты для указанного пользователя'
  })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiOkResponse({
    description: 'Список контактов',
    type: [ContactResponseDto]
  })
  async getUserContacts(@Param('userId') userId: string) {
    return this.contactsService.getUserContacts(userId);
  }
  
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  @Delete('user/:contactId') // Маршрут теперь /contacts/user/:contactId
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить контакт' })
  @ApiParam({ name: 'contactId', description: 'ID контакта для удаления' })
  @ApiOkResponse({
    description: 'Контакт успешно удален',
    type: ContactResponseDto
  })
  @ApiNotFoundResponse({ description: 'Контакт не найден' })
  @ApiForbiddenResponse({ description: 'Нет прав для удаления контакта' })
  async deleteContact(
    @AuthUser() user: User,
    @Param('contactId') contactId: string
  ) {
    return this.contactsService.deleteContact(contactId, user.id);
  }
}
