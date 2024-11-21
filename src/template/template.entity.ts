// template.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from '../admin/admin.entity';

@Entity('template')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Admin, (admin) => admin.templates)
  admin: Admin;

  @Column({ type: 'varchar', length: 20, default: 'custom' })
  type: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  language: string;

  @Column('text')
  header: string;

  @Column('text')
  body: string;

  @Column('text', { nullable: true })
  footer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  button_url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  button_text: string;
}
