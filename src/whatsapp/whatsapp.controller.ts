import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Whatsapp } from './whatsapp.entity';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuidv4 } from 'uuid';  // Importando a função para gerar UUID

import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

 @Post()
@UseGuards(AuthGuard('jwt'))
async create(
  @Body() data: Partial<Whatsapp>,
  @Request() req,
): Promise<Whatsapp> {
  const adminId = req.user.id;
  let imageUrl: string | null = null;

  console.log("Data recebido no controlador:", data);

  if (data.profilePicture && data.profilePicture.startsWith("data:image")) {
    console.log("Imagem em base64 detectada.");

    const matches = data.profilePicture.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches) {
      const extension = matches[1].split('/')[1];
      const buffer = Buffer.from(matches[2], 'base64');

      // Gerando um UUID único para o nome do arquivo
      const filename = `${uuidv4()}.${extension}`;
const uploadDir = path.join(__dirname, '..', 'uploads');
const filePath = path.join(uploadDir, filename);

// Verifica se o arquivo já existe, e gera um novo nome se necessário
let uniqueFilePath = filePath;
while (fs.existsSync(uniqueFilePath)) {
  const newFilename = `${uuidv4()}.${extension}`;
  uniqueFilePath = path.join(uploadDir, newFilename);
}

// Salva o arquivo com um nome único
// Verifique se o diretório existe, caso contrário, crie-o
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

fs.writeFileSync(uniqueFilePath, buffer);
imageUrl = `http://localhost:3005/uploads/${path.basename(uniqueFilePath)}`;
console.log("Imagem salva com sucesso:", imageUrl);

    } else {
      console.log("Formato de base64 inválido.");
    }
  } else {
    console.log("Imagem em base64 não detectada ou inválida.");
  }

  console.log("URL da imagem gerada:", imageUrl);

  // Passa `imageUrl` para o serviço junto com outros dados
  return await this.whatsappService.createWhatsapp(data, adminId, imageUrl);
}
  
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))  // Garantindo que o usuário está autenticado
  async findOne(@Param('id') id: string, @Request() req): Promise<Whatsapp> {
    const adminId = req.user.id;  // Pegando o adminId do JWT
    return await this.whatsappService.findWhatsappById(id, adminId);  // Passando o adminId para o serviço
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))  // Garantindo que o usuário está autenticado
  async findAll(@Request() req): Promise<Whatsapp[]> {
    const adminId = req.user.id;  // Pegando o adminId do JWT
    return await this.whatsappService.findAllWhatsapps(adminId);  // Passando o adminId para o serviço
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))  // Garantindo que o usuário está autenticado
  async update(@Param('id') id: string, @Body() data: Partial<Whatsapp>, @Request() req): Promise<Whatsapp> {
    const adminId = req.user.id;  // Pegando o adminId do JWT
    return await this.whatsappService.updateWhatsapp(id, data, adminId);  // Passando o adminId para o serviço
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))  // Garantindo que o usuário está autenticado
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    const adminId = req.user.id;  // Pegando o adminId do JWT
    await this.whatsappService.deleteWhatsapp(id, adminId);  // Passando o adminId para o serviço
  }
}
