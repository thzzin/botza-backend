import { Controller, Post, Body, Logger, BadRequestException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { ContactService } from 'src/contact/contact.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly contactService: ContactService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly adminService: AdminService
  ) {}

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
 