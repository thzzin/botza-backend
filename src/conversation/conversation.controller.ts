// conversation.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  private readonly logger = new Logger(ConversationController.name); // Criação do logger

  @Post()
  async create(@Body() conversationData: Partial<Conversation>): Promise<Conversation> {
    return await this.conversationService.createConversation(conversationData);
  }

/*   @Get()
  async findAll(): Promise<Conversation[]> {
    return await this.conversationService.findAllConversations();
  } */

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.conversationService.findConversationWithMessages(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() conversationData: Partial<Conversation>,
  ): Promise<Conversation> {
    return await this.conversationService.updateConversation(id, conversationData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.conversationService.deleteConversation(id);
  }

  @Get()
@UseGuards(AuthGuard('jwt')) // Protege a rota com autenticação JWT
async findAllConversationsWithDetails(@Request() req): Promise<any[]> {
  const adminId = req.user.id; // Obtendo o ID do admin autenticado a partir do JWT
  return await this.conversationService.findAllConversationsWithDetails(adminId);
}

}
