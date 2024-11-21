import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Contact } from '../contact/contact.entity';
import { Logger } from '@nestjs/common';
import { Message } from 'src/message/message.entity';

@Injectable()
export class ConversationService {
    private readonly logger = new Logger(ConversationService.name);

 constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

async createConversation(conversationData: Partial<Conversation>): Promise<Conversation> {

  const { contact, ...rest } = conversationData;
  console.log(contact)

  if (!contact || !contact.id) {
    throw new Error('O contato não possui um ID válido');
  }

  const conversation = this.conversationRepository.create({
    ...rest,
    contact_id: contact.id,  // Passando explicitamente o ID do contato
  });

  return await this.conversationRepository.save(conversation);
}


async findConversationByContactAndAdmin(contact: Contact, adminId: string): Promise<Conversation | undefined> {
  //this.logger.log(`Procurando conversa para contactId: ${contact.id} e adminId: ${adminId}`);
  
  return await this.conversationRepository.findOne({
    where: {
      contact_id: contact.id,  // Certifique-se de que `contact` está sendo passado como objeto
      admin_id: adminId,
    },
  });
}


 async findOrCreateConversation(contact: Contact, adminId: string): Promise<Conversation> {
    let conversation = await this.findConversationByContactAndAdmin(contact, adminId);

    if (!conversation) {
      console.log("vai criar a porra da conversa dnv")
      conversation = await this.createConversation({ contact, admin_id: adminId });
    }

    return conversation;
  }

  async findAllConversations(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async findOneConversation(id: string): Promise<Conversation> {
    return await this.conversationRepository.findOne({ where: { id } });
  }

  async updateConversation(id: string, conversationData: Partial<Conversation>): Promise<Conversation> {
    await this.conversationRepository.update(id, conversationData);
    return this.findOneConversation(id);
  }

  async deleteConversation(id: string): Promise<void> {
    await this.conversationRepository.delete(id);
  }

   async findAllConversationsWithDetails(adminId: string): Promise<any[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.contact', 'contact') // Inclui o contato na conversa
      .leftJoinAndSelect('conversation.messages', 'message') // Inclui as mensagens na conversa
      .where('conversation.admin_id = :adminId', { adminId })
      .getMany();

    // Mapeia as conversas para retornar os detalhes desejados
    return conversations.map(conversation => {
      // Pega a última mensagem (a mais recente)
      const lastMessage = conversation.messages
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0]; // Ordena e pega a última

      return {
        id: conversation.id,
        contact: {
          id: conversation.contact.id,
          name: conversation.contact.name,
          phone: conversation.contact.phone,
          photo: conversation.contact.photo_url, // Supondo que a URL da foto esteja aqui
        },
        lastMessage: lastMessage
          ? {
              text: lastMessage.content,
              createdAt: lastMessage.created_at,
            }
          : null,
      };
    });
  }

  async findConversationWithMessages(conversationId: string): Promise<any> {
    // Busca a conversa com o contato e todas as mensagens associadas
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.contact', 'contact')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :conversationId', { conversationId })
      .orderBy('message.created_at', 'ASC') // Ordena as mensagens por data de criação, do mais antigo para o mais recente
      .getOne();

    // Caso a conversa não exista, lança um erro
    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversationId} not found`);
    }

    // Retorna os dados da conversa com o contato e todas as mensagens
    return {
      id: conversation.id,
      contact: {
        id: conversation.contact.id,
        name: conversation.contact.name,
        phone: conversation.contact.phone,
        photo: conversation.contact.photo_url,
      },
      messages: conversation.messages.map(message => ({
        id: message.id,
        text: message.content,
        type: message.type,
        createdAt: message.created_at,
        caption: message.caption,
      })),
    };
  }
}
