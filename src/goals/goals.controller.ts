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
  Patch,
  BadRequestException
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
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
import { GoalService } from './goals.service';

@ApiTags('Цели')
@Controller('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}
  
  @Post()
  @HttpCode(201) // 201 Created
  @ApiOperation({ summary: 'Создать новую цель' })
  @ApiResponse({
    status: 201,
    type: GoalResponseDto,
    description: 'Цель успешно создана',
  })
  async createGoal(@AuthUser() user: User, @Body() dto: CreateGoalDto) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    return this.goalService.createGoal(user.id, dto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Получить все цели пользователя' })
  @ApiResponse({
    status: 200,
    type: [GoalResponseDto],
    description: 'Список целей',
  })
  async getAllGoals(@AuthUser() user: User) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    return this.goalService.getAllGoals(user.id);
  }
  
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID цели' })
  @ApiOperation({ summary: 'Получить цель по ID' })
  @ApiResponse({
    status: 200,
    type: GoalResponseDto,
    description: 'Детальная информация о цели',
  })
  async getGoal(@Param('id') id: string) {
    return this.goalService.getGoalWithDetails(id);
  }
  
  @Put(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID цели' })
  @ApiOperation({ summary: 'Обновить цель' })
  @ApiResponse({
    status: 200,
    type: GoalResponseDto,
    description: 'Цель успешно обновлена',
  })
  async updateGoal(@Param('id') id: string, @AuthUser() user: User, @Body() dto: UpdateGoalDto) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    return this.goalService.updateGoal(id, user.id, dto);
  }
  
  @Delete(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID цели' })
  @ApiOperation({ summary: 'Удалить цель' })
  @ApiResponse({
    status: 200,
    description: 'Цель успешно удалена',
  })
  async deleteGoal(@Param('id') id: string, @AuthUser() user: User) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    return this.goalService.deleteGoal(id, user.id);
  }
  
  @Patch(':id/contribute')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID цели' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 100 },
      },
    },
  })
  @ApiOperation({ summary: 'Внести вклад в цель' })
  @ApiResponse({
    status: 200,
    type: GoalResponseDto,
    description: 'Вклад успешно внесен',
  })
  async contributeToGoal(@Param('id') goalId: string, @AuthUser() user: User, @Body('amount') amount: number) {
    if (!user?.id) {
      throw new UnauthorizedException('Не удалось идентифицировать пользователя');
    }
    if (amount <= 0) {
      throw new BadRequestException('Сумма вклада должна быть положительной.');
    }
    return this.goalService.contributeToGoal(goalId, user.id, amount);
  }
}
