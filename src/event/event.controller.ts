import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { EventResponseDto } from './dto/event-response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthUser } from '../decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { EventsService } from './event.service';

@ApiTags('События')
@Controller('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Создать новое событие' })
  @ApiResponse({
    status: 200,
    type: EventResponseDto,
    description: 'Событие успешно создано',
  })
  async createEvent(@AuthUser() user: User, @Body() dto: CreateEventDto) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    return this.eventsService.createEvent(user.id, dto);
  }
  
  @Post(':id/members')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID события' })
  @ApiOperation({ summary: 'Добавить участника к событию' })
  @ApiBody({ type: AddParticipantDto })
  @ApiResponse({
    status: 200,
    description: 'Участник успешно добавлен',
    type: EventResponseDto,
  })
  async addParticipant(@Param('id') eventId: string, @Body() dto: AddParticipantDto) {
    return this.eventsService.addParticipant(eventId, dto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Получить все события' })
  @ApiResponse({
    status: 200,
    type: [EventResponseDto],
    description: 'Список всех событий',
  })
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }
  
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID события' })
  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiResponse({
    status: 200,
    type: EventResponseDto,
    description: 'Детальная информация о событии',
  })
  async getEvent(@Param('id') id: string) {
    return this.eventsService.getEventWithDetails(id);
  }
  
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID события' })
  @ApiOperation({ summary: 'Обновить событие' })
  @ApiResponse({
    status: 200,
    type: EventResponseDto,
    description: 'Событие успешно обновлено',
  })
  async updateEvent(@Param('id') id: string, @Body() dto: CreateEventDto) {
    return this.eventsService.updateEvent(id, dto);
  }
  
  @Delete(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID события' })
  @ApiOperation({ summary: 'Удалить событие' })
  @ApiResponse({
    status: 200,
    description: 'Событие успешно удалено',
  })
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
