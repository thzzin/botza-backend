import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ContactModule } from '../contact/contact.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module'; // Import MessageModule
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [ContactModule, ConversationModule, MessageModule, AdminModule], // Add MessageModule here
  controllers: [WebhookController],
})
export class WebhookModule {}
