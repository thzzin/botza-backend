import { Controller, Post, Body, Logger, BadRequestException, Get, Query, Res } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { ContactService } from 'src/contact/contact.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
    private readonly verifyToken = 'EAAMaEvMlYFYBOzM0Ga4ef907rL4NXA6IwM8z5uc7ZAs3lJZBfd2wrxk9j3F5ldTE7duE7eZCpRCyGiFWYTPsqz9W7az2gAyujlhyKrMd5ocyWAxWm6sIZAlv26YWHSmlbycmbZAg86tYvDjkZAPIUdteBBWhHmzL6jyeQCKhddcw9xJIqgp0SlmxnYwESponYZCy0nxKuPlCnczOKZAwPTBquV3hYE0ZD'

  constructor(
    private readonly contactService: ContactService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly adminService: AdminService,
  ) {}

  @Get()
verifyWebhook(
  @Query('hub.mode') mode: string,
  @Query('hub.verify_token') token: string,
  @Query('hub.challenge') challenge: string,
  @Res() res: Response,
) {
  this.logger.log('Recebendo requisição para verificar webhook.');
  this.logger.debug(`Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

  if (mode === 'subscribe' && token === this.verifyToken) {
    this.logger.log('Webhook verificado com sucesso!');
    return res.status(200).send(challenge); // Envia o desafio como resposta HTTP 200
  } else {
    this.logger.error('Falha na verificação do webhook.');
    return res.status(403).send('Falha na verificação do webhook.'); // Envia erro 403
  }
}


  @Post()
  async postMsg(@Body() incomingData: any): Promise<any> {
    try {
      // Verificar se incomingData contém dados
      if (Array.isArray(incomingData) && incomingData.length > 0) {
        const data = incomingData[0];

        // Verificar se há `contacts` e `messages` com dados válidos
        if (data.contacts && data.contacts.length > 0 && data.messages && data.messages.length > 0) {
          const contact = data.contacts[0];
          const message = data.messages[0];

          // Extrair os dados necessários
          const nameContact = contact.profile?.name || "Nome não informado"; // Nome do receptor
          const phoneNumberReceptor = data.metadata?.display_phone_number; // Número do destinatário
          const phoneSender = message.from; // Número do remetente

          // Determinar o tipo de mensagem e processá-la
          const tipo = message.type;

          switch (tipo) {
            case 'text':
              return await this.processText(message, phoneNumberReceptor, nameContact, phoneSender); // Processar mensagem de texto
            case 'image':
              return await this.processImage(message); // Processar imagem
            case 'audio':
              return await this.processAudio(message); // Processar áudio
            default:
              throw new BadRequestException(`Tipo de mensagem ${tipo} não suportado.`);
          }
        } else {
          throw new BadRequestException('Estrutura de dados inválida: "contacts" ou "messages" não encontrado');
        }
      } else {
        throw new BadRequestException('Estrutura de dados inválida: array esperado');
      }
    } catch (err) {
      this.logger.error('Erro ao processar a mensagem:', err);
      throw new BadRequestException('Erro no servidor');
    }
  }

  private async processText(message: any, phoneNumberReceptor: string, nameContact: string, phoneSender: string): Promise<any> {
    // Logar dados

     const admin = await this.adminService.findAdminByPhoneNumber(phoneNumberReceptor);

    if (!admin) {
      throw new BadRequestException(`Admin não encontrado para o número ${phoneNumberReceptor}`);
    }


    // Encontrar ou criar o contato do remetente
  let contact = await this.contactService.findOrCreateContact(phoneSender, admin.id, nameContact);

    if (!contact) {
      throw new BadRequestException('Erro ao criar ou encontrar o contato');
    }
   
    // Encontrar ou criar uma conversa
    let conversation = await this.conversationService.findOrCreateConversation(contact, admin.id);

    if (!conversation) {
      throw new BadRequestException('Erro ao criar ou encontrar a conversa');
    }


    // Criar a mensagem de texto
    const messageData = {
      conversation, // A conversa associada
      adminId: admin.id,
      contact_id: contact.id,
      content: message.text.body,
      type: 'text'
    };

    const newMessage = await this.messageService.createMessage(messageData);


    return { message: 'Texto processado com sucesso!', newMessage };
}





  // Função para processar imagem
  private async processImage(message: any): Promise<any> {
    this.logger.log(`Processando imagem: ID ${message.image.id}`);
    // Aqui você implementa a lógica de processamento para imagem
    return { message: 'Imagem processada com sucesso!' };
  }

  // Função para processar áudio
  private async processAudio(message: any): Promise<any> {
    this.logger.log(`Processando áudio: ID ${message.audio.id}`);
    // Aqui você implementa a lógica de processamento para áudio
    return { message: 'Áudio processado com sucesso!' };
  }
}
 