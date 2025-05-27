import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import {EventsModule} from './event/event.module';
import { AccountsService } from './accounts/accounts.service';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import {PrismaModule} from './prisma.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, ContactsModule, EventsModule, AccountsModule, TransactionsModule, CategoriesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, AccountsService],
})
export class AppModule {}
