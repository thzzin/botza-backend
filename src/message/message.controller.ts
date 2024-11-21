// message.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() messageData: Partial<Message>): Promise<Message> {
    return await this.messageService.createMessage(messageData);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return await this.messageService.findAllMessages();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Message> {
    return await this.messageService.findOneMessage(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() messageData: Partial<Message>,
  ): Promise<Message> {
    return await this.messageService.updateMessage(id, messageData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.messageService.deleteMessage(id);
  }
}
