// contact-list.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactList } from './contact-list.entity';

@Injectable()
export class ContactListService {
  constructor(
    @InjectRepository(ContactList)
    private readonly contactListRepository: Repository<ContactList>,
  ) {}

  async createContactList(contactListData: Partial<ContactList>): Promise<ContactList> {
    const contactList = this.contactListRepository.create(contactListData);
    return await this.contactListRepository.save(contactList);
  }

  async findAllContactLists(): Promise<ContactList[]> {
    return await this.contactListRepository.find();
  }

  async findOneContactList(id: number): Promise<ContactList> {
    return await this.contactListRepository.findOne({ where: { id } });
  }

  async updateContactList(id: number, contactListData: Partial<ContactList>): Promise<ContactList> {
    await this.contactListRepository.update(id, contactListData);
    return this.findOneContactList(id);
  }

  async deleteContactList(id: number): Promise<void> {
    await this.contactListRepository.delete(id);
  }
}
