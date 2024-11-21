import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { Whatsapp } from './whatsapp.entity';
import { Admin } from 'src/admin/admin.entity';
import { AdminModule } from 'src/admin/admin.module';


@Module({
  imports: [TypeOrmModule.forFeature([Whatsapp]), AdminModule], // Registre o Whatsapp entity aqui
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [TypeOrmModule, WhatsappService], // Exporte se necessário em outros módulos
})
export class WhatsappModule {}
