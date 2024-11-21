import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  // Método para validar usuário, agora retornando somente as informações necessárias
  async validateUser(email: string, password: string) {
    const admin = await this.adminService.findByEmail(email); // Buscar o admin pelo email

    // Verificar se o admin existe e se a senha é válida
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { password, ...result } = admin; // Remover a senha do resultado
      return result; // Retornar os dados do admin sem a senha
    }

    // Se não encontrar o admin ou se a senha for inválida, lança uma exceção
    throw new UnauthorizedException('Invalid credentials');
  }

  // Método de login, que retorna o token JWT
  async login(admin: any) {
    const payload = { email: admin.email, sub: admin.id }; // Dados para gerar o payload do JWT
    const accessToken = this.jwtService.sign(payload); // Geração do JWT

    return { token: accessToken, username: admin.username, email: admin.email,
 }; // Retorno com o token
  }
}
