// contact-list.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from '../admin/admin.entity';

@Entity('contact_list')
export class ContactList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Admin, (admin) => admin.contactLists)
  admin: Admin;

  @Column('text')
  contacts: string; // Storing an array or JSON of contact numbers
}
