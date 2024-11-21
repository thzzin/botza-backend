import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsOptional()
  content?: string; // Conteúdo da mensagem (opcional)

  @IsString()
  @IsOptional()
  type?: string; // Tipo da mensagem (opcional)

  @IsString()
  @IsOptional()
  caption?: string; // Legenda (opcional)
}
