import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create(messageData);
    return await this.messageRepository.save(message);
  }

  async findAllMessages(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findOneMessage(id: string): Promise<Message> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  async updateMessage(id: string, messageData: Partial<Message>): Promise<Message> {
    await this.messageRepository.update(id, messageData);
    return this.findOneMessage(id);
  }

  async deleteMessage(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
