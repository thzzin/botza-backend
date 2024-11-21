import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Whatsapp } from './whatsapp.entity';

@Injectable()
export class WhatsappService {
  constructor(
    @InjectRepository(Whatsapp)
    private whatsappRepository: Repository<Whatsapp>, // Injetando o repositório correto
  ) {}

  // Adicione seus métodos aqui
}
