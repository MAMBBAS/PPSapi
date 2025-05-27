// src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards, // Добавляем обратно UseGuards
  Req, // Добавляем обратно Req
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth, // Добавляем обратно ApiBearerAuth
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth-guard'; // Предполагаем, что этот guard есть
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@ApiTags('Transactions')
@ApiBearerAuth() // Указываем, что эндпоинты требуют Bearer токен
@UseGuards(JwtAuthGuard) // Защищаем эндпоинты аутентификацией
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую транзакцию' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Транзакция успешно создана',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Невалидные данные',
  })
  createTransaction(@Req() req, @Body() createTransactionDto: CreateTransactionDto) {
    // userId берется из JWT токена
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Получить все транзакции с фильтрами' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TransactionType,
    description: 'Фильтр по типу транзакции (income или expense)',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    type: String,
    description: 'Фильтр по ID счёта',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Фильтр по ID категории',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Начальная дата периода (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Конечная дата периода (ISO string)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Лимит количества транзакций',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Смещение для пагинации',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список транзакций',
    type: [TransactionResponseDto],
  })
  findAll(
    @Req() req,
    @Query('type') type?: TransactionType,
    @Query('accountId') accountId?: string, // Добавляем accountId в параметры запроса
    @Query('categoryId') categoryId?: string, // Добавляем categoryId в параметры запроса
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.transactionsService.findAll(req.user.id, {
      type,
      accountId,
      categoryId,
      startDate,
      endDate,
      limit,
      offset,
    });
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Получить транзакцию по ID' })
  @ApiParam({ name: 'id', description: 'ID транзакции' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные транзакции',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Транзакция не найдена',
  })
  findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id, id);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить транзакцию' })
  @ApiParam({ name: 'id', description: 'ID транзакции' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Обновлённые данные транзакции',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Транзакция не найдена',
  })
  update(@Req() req, @Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(req.user.id, id, updateTransactionDto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить транзакцию' })
  @ApiParam({ name: 'id', description: 'ID транзакции' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Транзакция успешно удалена',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Транзакция не найдена',
  })
  remove(@Req() req, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.id, id);
  }
}
