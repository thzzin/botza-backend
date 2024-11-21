// message.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),  // Registra a entidade Message
  ],
  providers: [MessageService],
  controllers: [MessageController],
    exports: [MessageService], // Certifique-se de que MessageService está exportado

})
export class MessageModule {}
