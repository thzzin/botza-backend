// template.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { Template } from './template.entity';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    AdminModule  // Registra a entidade Template
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
