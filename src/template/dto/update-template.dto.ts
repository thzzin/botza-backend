import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string; // Nome do template

  @IsString()
  @IsOptional()
  header?: string; // Cabeçalho do template

  @IsString()
  @IsOptional()
  body?: string; // Corpo da mensagem

  @IsString()
  @IsOptional()
  footer?: string; // Rodapé da mensagem

  @IsUrl()
  @IsOptional()
  buttonUrl?: string; // URL do botão

  @IsString()
  @IsOptional()
  @MaxLength(50)
  buttonText?: string; // Texto do botão
}
