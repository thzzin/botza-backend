import { IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional() // Nome do contato (opcional para atualização)
  name?: string;

  @IsString()
  @IsOptional() // URL da foto (opcional para atualização)
  photoUrl?: string;
}
