import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { Message } from 'src/message/message.entity';
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.contactRepository.create(contactData);
    return await this.contactRepository.save(contact);
  }

  async findContactByPhone(phone: string): Promise<Contact | undefined> {
    return await this.contactRepository.findOne({ where: { phone } });
  }

  async findContactByPhoneAndAdmin(phone: string, adminId: string): Promise<Contact | undefined> {
  return await this.contactRepository.findOne({
    where: { phone, admin: { id: adminId } },
    relations: ['admin'],  // Inclua as relações se precisar do objeto `admin` completo no resultado
  });
}


async findOrCreateContact(phone: string, adminId: string, nameContact: string): Promise<Contact> {
  let contact = await this.findContactByPhoneAndAdmin(phone, adminId);
  
  if (!contact) {
    // Se o contato não for encontrado, cria um novo com o admin associado
    contact = await this.createContact({ phone, admin: { id: adminId }, name: nameContact } as Contact);
    console.log("Contato criado:", contact);
  } else {
    console.log("Contato encontrado:", contact);
  }

  return contact;
}




  async findAllContacts(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findOneContact(id: string): Promise<Contact> {
    return await this.contactRepository.findOne({ where: { id } });
  }

  async updateContact(id: string, contactData: Partial<Contact>): Promise<Contact> {
    await this.contactRepository.update(id, contactData);
    return this.findOneContact(id);
  }

async deleteContact(id: string): Promise<void> {
  // Deleta as mensagens associadas ao contato
  await this.contactRepository.manager.getRepository(Message).delete({ contact: { id } });

  // Deleta as conversas associadas ao contato (se necessário)
  await this.contactRepository.manager.getRepository(Conversation).delete({ contact: { id } });

  // Deleta o contato
  await this.contactRepository.delete(id);
}



  async findContactsByAdmin(adminId: string): Promise<Contact[]> {
  return await this.contactRepository.find({
    where: { admin: { id: adminId } },
    select: {
      id: true,
      phone: true,
      name: true,
      photo_url: true,
      email: true,
      created_at: true,
    },
  });
}

}
