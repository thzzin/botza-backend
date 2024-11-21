// admin.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ContactList } from '../contact-list/contact-list.entity';
import { Contact } from '../contact/contact.entity';
import { Template } from '../template/template.entity';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';
import { Whatsapp } from 'src/whatsapp/whatsapp.entity';
  
@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phones: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_numbers_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255 })
  access_token: string;

  @Column({ type: 'varchar', nullable: true })
  superior_id: string;

  @OneToMany(() => Whatsapp, whatsapp => whatsapp.admin) // Relacionamento inverso com Whatsapp
  whatsapps: Whatsapp[];

  // One-to-many relationships for the subordinates (employees)
  @OneToMany(() => Admin, (admin) => admin.superior_id)
  subordinates: Admin[];

  // Other relationships with other entities
  @OneToMany(() => ContactList, (contactList) => contactList.admin)
  contactLists: ContactList[];

  @OneToMany(() => Contact, (contact) => contact.admin)
  contacts: Contact[];

  @OneToMany(() => Template, (template) => template.admin)
  templates: Template[];

  @OneToMany(() => Conversation, (conversation) => conversation.admin)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.admin)
  messages: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.assigned_admin)
  assignedConversations: Conversation[];
}
