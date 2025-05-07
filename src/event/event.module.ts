import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {EventsService} from './event.service';
import {EventsController} from './event.controller';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
  exports: [EventsService]
})
export class EventsModule {}
