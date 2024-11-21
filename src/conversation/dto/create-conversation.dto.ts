import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  @IsNotEmpty()
  admin_id: number; // ID do admin responsável pela conversa

  @IsInt()
  @IsNotEmpty()
  contact_id: number; // ID do contato com quem a conversa está ocorrendo

  @IsInt()
  @IsOptional()
  meta_conversation_id?: string; // ID do admin atualmente atribuído à conversa (opcional)
}
