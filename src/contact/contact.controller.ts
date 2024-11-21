// contact.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request  } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

   @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  async findContactsByAdmin(@Request() req): Promise<Contact[]> {
    const adminId = req.user.id; // The admin's ID from JWT payload
    return await this.contactService.findContactsByAdmin(adminId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() contactData: { phone: string; nameContact: string }, @Request() req): Promise<Contact> {
    const adminId = req.user.id; // Extract the admin ID from JWT
    const { phone, nameContact } = contactData; // Destructure the phone and name from the body

    // Use the service method to find or create the contact
    return await this.contactService.findOrCreateContact(phone, adminId, nameContact);
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return await this.contactService.findAllContacts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return await this.contactService.findOneContact(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() contactData: Partial<Contact>,
  ): Promise<Contact> {
    return await this.contactService.updateContact(id, contactData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.contactService.deleteContact(id);
  }
}
