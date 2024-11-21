import { IsNotEmpty, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  adminId: number; // ID do admin que criou o template

  @IsString()
  @IsOptional()
  @MaxLength(20)
  type: string = 'custom'; // Tipo do template (por padrão 'custom')

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // Nome do template

  @IsString()
  @IsOptional()
  @MaxLength(20)
  language?: string; // Idioma do template

  @IsString()
  @IsNotEmpty()
  header: string; // Cabeçalho do template (texto ou URL de imagem)

  @IsString()
  @IsNotEmpty()
  body: string; // Corpo da mensagem

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
