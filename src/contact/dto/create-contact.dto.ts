import { IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  adminId: number; // ID do admin que gerencia o contato

  @IsPhoneNumber('BR') // Validação do número de telefone no formato brasileiro
  @IsNotEmpty()
  phone: string; // Número de telefone do contato

  @IsString()
  @IsOptional() // O nome é opcional
  name?: string; // Nome do contato

  @IsString()
  @IsOptional() // O nome é opcional
  email?: string; // Nome do contato

  @IsString()
  @IsOptional() // A URL da foto é opcional
  photoUrl?: string; // URL da foto do contato
}
