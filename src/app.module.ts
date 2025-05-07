import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import {EventsModule} from './event/event.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, ContactsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
