// contact.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Admin, (admin) => admin.contacts)
  admin: Admin;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

@OneToMany(() => Conversation, (conversation) => conversation.contact, {
  cascade: true, // Isso permite que as conversas sejam deletadas automaticamente ao deletar o contato
  onDelete: 'CASCADE', // Isso aplica a exclusão em cascata no banco de dados
})
conversations: Conversation[];



  @OneToMany(() => Message, (message) => message.contact)
  messages: Message[];

   @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
