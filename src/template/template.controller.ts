// template.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

 @Post()
  @UseGuards(AuthGuard('jwt'))  // Garantir que o usuário esteja autenticado
  async create(@Body() templateData: Partial<Template>, @Request() req): Promise<Template> {
    const adminId = req.user.id;  // Pegando o ID do admin do JWT
    return await this.templateService.createTemplate(templateData, adminId);  // Passando o adminId para o service
  }

  @Get()
  async findAll(): Promise<Template[]> {
    return await this.templateService.findAllTemplates();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Template> {
    return await this.templateService.findOneTemplate(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() templateData: Partial<Template>,
  ): Promise<Template> {
    return await this.templateService.updateTemplate(id, templateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.templateService.deleteTemplate(id);
  }

  @Get('by-admin')
@UseGuards(AuthGuard('jwt'))
async findTemplatesByAdmin(@Request() req: any): Promise<Template[]> {
  const adminId = req.user.id;  // Pegando o ID do admin do JWT
  return await this.templateService.findTemplatesByAdmin(adminId);
}

}
