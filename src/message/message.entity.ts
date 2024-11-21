// message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn  } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Admin } from '../admin/admin.entity';
import { Contact } from '../contact/contact.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Admin, (admin) => admin.messages)
  admin: Admin;

  @Column()
  contact_id: string;

  @ManyToOne(() => Contact, (contact) => contact.messages)
  contact: Contact;

   @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE', // Isso garante que, ao deletar uma conversa, suas mensagens também sejam removidas.
  })
  conversation: Conversation;

  @Column('text')
  content: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
created_at: Date;

}
