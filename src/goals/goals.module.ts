import { Module } from '@nestjs/common';
import { GoalService } from './goals.service';
import { GoalController } from './goals.controller';
import {PrismaModule} from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalsModule {}
