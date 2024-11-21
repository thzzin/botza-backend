import { IsArray, IsOptional } from 'class-validator';

export class UpdateContactListDto {
  @IsOptional() // O campo é opcional no update
  @IsArray() // Garantir que 'contacts' seja um array
  contacts?: string[]; // Lista de números de telefone (como array de strings)
}
