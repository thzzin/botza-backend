import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // Para verificar o token JWT
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('caiu no login');
    const admin = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!admin) {
      throw new UnauthorizedException();
    }
    return this.authService.login(admin);
  }

  // Novo endpoint para verificar a validade do token
  @Post('verify')
  async verifyToken(@Body() body: { token: string }) {
    try {
      const decoded = this.jwtService.verify(body.token); // Verifica se o token é válido
      return { valid: true, decoded }; // Se for válido, retorna o payload decodificado
    } catch (error) {
      return { valid: false }; // Se o token for inválido, retorna como inválido
    }
  }

  // Endpoint de heartbeat
  @Post('heartbeat')
  async heartbeat(@Body() body: { token: string }) {
    try {
      const decoded = this.jwtService.verify(body.token); // Verifica se o token é válido
      return { status: 'OK' }; // Se for válido, retorna OK
    } catch (error) {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
