import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Whatsapp } from './whatsapp.entity';
import { Admin } from 'src/admin/admin.entity';

@Injectable()
export class WhatsappService {
  constructor(
    @InjectRepository(Whatsapp)
    private readonly whatsappRepository: Repository<Whatsapp>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,  // Certifique-se de injetar o repositório Admin
  ) {}

  // Alterado para receber a imageUrl
async createWhatsapp(data: Partial<Whatsapp>, adminId: string, imageUrl: string) {
  // Verifique se o 'numero' ou 'profilePicture' já existe
  const existingWhatsapp = await this.whatsappRepository.findOne({
    where: [{ numero: data.numero }, { profilePicture: data.profilePicture }],
  });

  if (existingWhatsapp) {
    throw new Error('O número ou a imagem já estão cadastrados.');
  }

    console.log("Dados recebidos no serviço:");
    console.log("Admin ID:", adminId);
    console.log("URL da imagem recebida no serviço:", imageUrl);

  // Crie o novo Whatsapp
  const newWhatsapp = this.whatsappRepository.create({
    ...data,
    admin: { id: adminId },
    profilePicture: imageUrl,
  });

  return this.whatsappRepository.save(newWhatsapp);
}


  async findWhatsappById(id: string, adminId: string): Promise<Whatsapp | undefined> {
    return await this.whatsappRepository.findOne({
      where: { id, admin: { id: adminId } },  // Filtrando WhatsApp pelo adminId
    });
  }

  async updateWhatsapp(id: string, data: Partial<Whatsapp>, adminId: string): Promise<Whatsapp> {
    await this.whatsappRepository.update({ id, admin: { id: adminId } }, data);
    return this.findWhatsappById(id, adminId);
  }

  async deleteWhatsapp(id: string, adminId: string): Promise<void> {
    await this.whatsappRepository.delete({ id, admin: { id: adminId } });
  }

  async findAllWhatsapps(adminId: string): Promise<Whatsapp[]> {
    return await this.whatsappRepository.find({ where: { admin: { id: adminId } } });
  }
}
