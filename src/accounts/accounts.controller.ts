import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Создать новый счёт' })
  @ApiResponse({ status: 201, type: AccountResponseDto })
  create(@Req() req, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(req.user.id, dto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Получить все счета пользователя' })
  @ApiResponse({ status: 200, type: [AccountResponseDto] })
  findAll(@Req() req) {
    return this.accountsService.findAll(req.user.id);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Получить счёт по ID' })
  @ApiResponse({ status: 200, type: AccountResponseDto })
  findOne(@Req() req, @Param('id') id: string) {
    return this.accountsService.findOne(id, req.user.id);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить счёт' })
  @ApiResponse({ status: 200, type: AccountResponseDto })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(id, req.user.id, dto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить счёт' })
  @ApiResponse({ status: 204 })
  remove(@Req() req, @Param('id') id: string) {
    return this.accountsService.remove(id, req.user.id);
  }
}
