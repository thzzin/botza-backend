import { IsInt, IsOptional } from 'class-validator';

export class UpdateConversationDto {
  @IsInt()
  @IsOptional()
  assignedAdminId?: number; // ID do admin atribuído à conversa (opcional)
}
