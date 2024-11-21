import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { ConflictException } from '@nestjs/common';  // Importar ConflictException
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/CreateEmployeeDto.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

    async createEmployee(createEmployeeDto: CreateEmployeeDto, adminId: string): Promise<Admin> {
    const { email, password, role, username } = createEmployeeDto;

    // Verifica se o admin superior existe
    const superiorAdmin = await this.adminRepository.findOne({ where: { id: adminId } });

    if (!superiorAdmin) {
      throw new Error('Superior admin not found');
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo funcionário
    const newEmployee = this.adminRepository.create({
      email,
      password: hashedPassword,
      role,
      username,
      superior_id: superiorAdmin.id, // Associando ao superior
      access_token: superiorAdmin.access_token
    });

    // Salva e retorna o novo funcionário
    return this.adminRepository.save(newEmployee);
  }

 async getSubordinates(adminId: string): Promise<Admin[]> {
    console.log("Buscando subordinados para adminId: ", adminId);  // Debugging
    return this.adminRepository.find({
      where: { superior_id: adminId },  // Buscando subordinados com base no superior_id
    });
  }

  async deleteEmployee(employeeId: string, adminId: string): Promise<void> {
    // Verifica se o funcionário existe
    const employee = await this.adminRepository.findOne({ where: { id: employeeId } });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Verifica se o admin é o superior do funcionário
    if (employee.superior_id !== adminId) {
      throw new Error('You are not authorized to delete this employee');
    }

    // Exclui o funcionário
    await this.adminRepository.remove(employee);
  }


   async createAdmin(adminData: Partial<Admin>): Promise<Admin> {

    // Verifica se o email já existe
    const existingAdmin = await this.adminRepository.findOne({ where: { email: adminData.email } });
    if (existingAdmin) {
      throw new ConflictException('Email já está em uso');
    }

    // Verifica se a senha foi fornecida e a criptografa
    if (adminData.password) {
      const saltRounds = 10; // Número de rounds de salt para o bcrypt
      adminData.password = await bcrypt.hash(adminData.password, saltRounds);
    }

    const admin = this.adminRepository.create(adminData);
    return await this.adminRepository.save(admin);
  }

  async findAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findOneAdmin(id: string): Promise<Admin> {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async updateAdmin(id: string, adminData: Partial<Admin>): Promise<Admin> {
    if (adminData.password) {
      
      const saltRounds = 10;
      adminData.password = await bcrypt.hash(adminData.password, saltRounds);
    }

    await this.adminRepository.update(id, adminData);
    return this.findOneAdmin(id);
  }

  async deleteAdmin(id: string): Promise<void> {
    await this.adminRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Admin | undefined> {
  return await this.adminRepository.findOne({ where: { email } });
}

async findAdminByPhoneNumber(phoneNumber: string): Promise<Admin | undefined> {
    return await this.adminRepository.findOne({
      where: [
        { phones: phoneNumber },  // Verificar o número do telefone do admin
      ],
    });
  }

}
