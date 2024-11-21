import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';  // Certifique-se de importar o TypeOrmModule
import { Admin } from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],  // Registrar a entidade Admin no TypeORM
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService, TypeOrmModule],  // Export TypeOrmModule to allow TemplateModule to use AdminRepository
})
export class AdminModule {}
