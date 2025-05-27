import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // экспортируем, чтобы другие модули могли использовать
})
export class PrismaModule {}
