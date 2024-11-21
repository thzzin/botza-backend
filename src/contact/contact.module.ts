// contact.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),  // Registra a entidade Contact
  ],
  providers: [ContactService],
  controllers: [ContactController],
    exports: [ContactService],  // Export the service so it can be used in other modules

})
export class ContactModule {}
