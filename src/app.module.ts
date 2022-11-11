import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import { TicketsModule } from './tickets/ticket.module';

@Module({
  imports: [
    TicketsModule,MongooseModule.forRoot(
      'mongodb://localhost:27017/ticketmanagement'
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
