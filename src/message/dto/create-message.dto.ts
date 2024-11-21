import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  adminId: number; // ID do admin que enviou ou gerenciou a mensagem

  @IsInt()
  @IsNotEmpty()
  contactId: number; // ID do contato envolvido na mensagem

  @IsInt()
  @IsNotEmpty()
  conversationId: number; // ID da conversa associada à mensagem

  @IsString()
  @IsNotEmpty()
  content: string; // Conteúdo da mensagem (texto ou link)

  @IsString()
  @IsNotEmpty()
  type: string; // Tipo da mensagem (texto, imagem, documento, vídeo)

  @IsString()
  @IsOptional()
  caption?: string; // Legenda (se o tipo de mensagem for imagem, documento ou vídeo)
}
