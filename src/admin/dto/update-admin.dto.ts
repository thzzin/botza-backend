import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional() // Os campos são opcionais para atualização
  @IsString()
  phones?: string;

  @IsOptional()
  @IsString()
  metaNumbersId?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  superiorId?: number;
}
