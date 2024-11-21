// conversation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './conversation.entity';
import { Message } from 'src/message/message.entity';
import { Contact } from 'src/contact/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Contact]),
  ],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],  // Certifique-se de que isso está presente
})
export class ConversationModule {}
