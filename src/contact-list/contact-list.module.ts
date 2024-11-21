// contact-list.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactListService } from './contact-list.service';
import { ContactListController } from './contact-list.controller';
import { ContactList } from './contact-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactList]),  // Registra a entidade ContactList
  ],
  providers: [ContactListService],
  controllers: [ContactListController],
})
export class ContactListModule {}
