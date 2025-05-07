// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создание пользователя (администратор)' })
  @ApiCreatedResponse({
    description: 'Пользователь успешно создан',
    type: UserResponseDto,
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Получение списка всех пользователей' })
  @ApiOkResponse({
    description: 'Список пользователей получен',
    type: [UserResponseDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получение текущего пользователя' })
  @ApiOkResponse({
    description: 'Текущий пользователь получен',
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Доступ запрещен' })
  getCurrentUser(@Req() req: Request & { user: User }) {
    return req.user;
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiOkResponse({ description: 'Пользователь найден', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiOkResponse({
    description: 'Данные пользователя обновлены',
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Доступ запрещен' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiOkResponse({ description: 'Пользователь удален' })
  @ApiForbiddenResponse({ description: 'Доступ запрещен' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
