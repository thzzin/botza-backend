  import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
  import { Admin } from '../admin/admin.entity';
  import { Contact } from '../contact/contact.entity';
  import { Message } from '../message/message.entity';

  @Entity('conversation')
  export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    admin_id: string;

    @ManyToOne(() => Admin, (admin) => admin.conversations)
    @JoinColumn({ name: 'admin_id' })
    admin: Admin;

    @Column()
    contact_id: string;

    @ManyToOne(() => Contact, (contact) => contact.conversations, {
    onDelete: 'CASCADE', // Isso garante que, ao deletar um contato, todas as conversas associadas sejam removidas.
  })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

    @ManyToOne(() => Admin, (admin) => admin.assignedConversations)
    assigned_admin: Admin;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];
  }
