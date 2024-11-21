import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';  // Importando o ConfigModule e ConfigService
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { AdminModule } from './admin/admin.module';
import { ContactListModule } from './contact-list/contact-list.module';
import { ContactModule } from './contact/contact.module';
import { TemplateModule } from './template/template.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

import { Admin } from './admin/admin.entity';
import { ContactList } from './contact-list/contact-list.entity';
import { Contact } from './contact/contact.entity';
import { Template} from './template/template.entity';
import { Conversation } from './conversation/conversation.entity';
import { Message } from './message/message.entity';
import { AuthModule } from './auth/auth.module';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookModule } from './webhook/webhook.module';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { Whatsapp } from './whatsapp/whatsapp.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist' , 'uploads'),  // Caminho onde os arquivos são armazenados
      serveRoot: '/uploads',  // Prefixo para acessar os arquivos via URL
    }),
    ConfigModule.forRoot({ isGlobal: true }),  // Carregando as variáveis de ambiente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // Importando o ConfigModule para acessar as variáveis
      inject: [ConfigService],  // Injetando o ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),  // Usando a variável DATABASE_URL
        entities: [Admin, ContactList, Contact, Template, Conversation, Message, Whatsapp],  // Suas entidades
        synchronize: true,  // Defina como false em produção
        ssl: { rejectUnauthorized: false },  // Adicionando configuração SSL (caso necessário)
      }),
    }),
    AdminModule,
    ContactListModule,
    ContactModule,
    TemplateModule,
    ConversationModule,
    MessageModule,
    AuthModule,
    WebhookModule,
    WhatsappModule,
  ],
  controllers: [AppController, WebhookController, WhatsappController],
  providers: [AppService, DatabaseService, WhatsappService ],
})
export class AppModule {}
