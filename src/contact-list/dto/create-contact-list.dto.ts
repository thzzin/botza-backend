import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContactListDto {
  @IsNumber()
  @IsNotEmpty()
  adminId: number; // ID do admin que criou a lista

  @IsArray() // Garantir que 'contacts' seja um array
  @IsNotEmpty()
  contacts: string[]; // Lista de números de telefone (como array de strings)
}
