import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,  // This should work as AdminModule is imported
  ) {}

   async createTemplate(templateData: Partial<Template>, adminId: string): Promise<Template> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const template = this.templateRepository.create({
      ...templateData,
      admin,  // Associando o template ao admin
    });

    return await this.templateRepository.save(template);
  }

  async findAllTemplates(): Promise<Template[]> {
    return await this.templateRepository.find();
  }

  async findOneTemplate(id: number): Promise<Template> {
    return await this.templateRepository.findOne({ where: { id } });
  }

  async updateTemplate(id: number, templateData: Partial<Template>): Promise<Template> {
    await this.templateRepository.update(id, templateData);
    return this.findOneTemplate(id);
  }

  async deleteTemplate(id: number): Promise<void> {
    await this.templateRepository.delete(id);
  }

  async findTemplatesByAdmin(adminId: string): Promise<Template[]> {
  return await this.templateRepository.find({
    where: { admin: { id: adminId } },
  });
}

}
