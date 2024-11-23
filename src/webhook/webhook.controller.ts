import { Controller, Post, Body, Logger, BadRequestException, Get, Query, Res } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { ContactService } from 'src/contact/contact.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { Response } from 'express';
import * as fs from 'fs';
//import { OpenAiService } from './openaibot.service'; // Importando o serviço OpenAI
import { OpenAiService } from 'src/openaibot/openaibot.service';

const processedMessagesFile = 'processedMessages.json';
let processedMessages: Set<string> = new Set();

// Carregar os IDs processados ao iniciar o servidor
if (fs.existsSync(processedMessagesFile)) {
  const data = fs.readFileSync(processedMessagesFile, 'utf-8');
  processedMessages = new Set(JSON.parse(data));
}

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly verifyToken = 'EAAMaEvMlYFYBOzM0Ga4ef907rL4NXA6IwM8z5uc7ZAs3lJZBfd2wrxk9j3F5ldTE7duE7eZCpRCyGiFWYTPsqz9W7az2gAyujlhyKrMd5ocyWAxWm6sIZAlv26YWHSmlbycmbZAg86tYvDjkZAPIUdteBBWhHmzL6jyeQCKhddcw9xJIqgp0SlmxnYwESponYZCy0nxKuPlCnczOKZAwPTBquV3hYE0ZD';

  constructor(
    private readonly contactService: ContactService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly adminService: AdminService,
    private readonly openAiService: OpenAiService, // Injetando o serviço OpenAI
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
      this.logger.debug('Recebendo dados do webhook:', incomingData);

      if (!incomingData?.entry?.[0]?.changes?.[0]?.value) {
        throw new BadRequestException('Estrutura de dados inválida: dados ausentes.');
      }

      const entry = incomingData.entry[0];
      const change = entry.changes[0];
      const data = change.value;

      if (change.field !== 'messages') {
        throw new BadRequestException('Estrutura de dados inválida: campo "field" ausente ou incorreto.');
      }

      if (!data.contacts || !data.messages || data.contacts.length === 0 || data.messages.length === 0) {
        throw new BadRequestException('Estrutura de dados inválida: "contacts" ou "messages" não encontrado.');
      }

      const contact = data.contacts[0];
      const message = data.messages[0];

      // Verificar se a mensagem já foi processada
      const messageId = message.id;

      if (processedMessages.has(messageId)) {
        this.logger.warn(`Mensagem duplicada ignorada: ${messageId}`);
        return { message: 'Mensagem já processada.' };
      }

      // Adicionar a mensagem ao conjunto de mensagens processadas
      processedMessages.add(messageId);
      fs.writeFileSync(processedMessagesFile, JSON.stringify([...processedMessages]));

      // Dados da mensagem
      const nameContact = contact.profile?.name || 'Nome não informado';
      const phoneNumberReceptor = data.metadata?.display_phone_number;
      const phoneSender = message.from;
      const tipo = message.type;

      switch (tipo) {
        case 'text':
          return await this.processText(message, phoneNumberReceptor, nameContact, phoneSender);
        case 'image':
          return await this.processImage(message);
        case 'audio':
          return await this.processAudio(message);
        default:
          throw new BadRequestException(`Tipo de mensagem ${tipo} não suportado.`);
      }
    } catch (err) {
      this.logger.error('Erro ao processar a mensagem:', err);
      throw new BadRequestException('Erro no servidor');
    }
  }

  // Processamento de mensagem de texto com integração ao OpenAI
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

    // Processar a mensagem com o OpenAI
    let botResponse;
    try {
      botResponse = await this.openAiService.processMessage(message.text.body);
    } catch (error) {
      throw new BadRequestException('Erro ao processar mensagem com o bot');
    }

    // Criar a mensagem de texto com a resposta do bot (ou a original, dependendo do fluxo)
    const messageData = {
      conversation, // A conversa associada
      adminId: admin.id,
      contact_id: contact.id,
      content: botResponse || message.text.body, // Use a resposta do bot ou a mensagem original
      type: 'text',
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
