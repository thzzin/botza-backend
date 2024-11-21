// contact-list.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ContactListService } from './contact-list.service';
import { ContactList } from './contact-list.entity';

@Controller('contact-lists')
export class ContactListController {
  constructor(private readonly contactListService: ContactListService) {}

  @Post()
  async create(@Body() contactListData: Partial<ContactList>): Promise<ContactList> {
    return await this.contactListService.createContactList(contactListData);
  }

  @Get()
  async findAll(): Promise<ContactList[]> {
    return await this.contactListService.findAllContactLists();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ContactList> {
    return await this.contactListService.findOneContactList(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() contactListData: Partial<ContactList>,
  ): Promise<ContactList> {
    return await this.contactListService.updateContactList(id, contactListData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.contactListService.deleteContactList(id);
  }
}
