import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './admin.entity';
import { CreateEmployeeDto } from './dto/createEmployeeDto.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Post('create-employee')
  @UseGuards(AuthGuard('jwt'))  // O guard JWT protege a rota
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto, 
    @Request() req: any,  // Acessa o objeto de requisição, onde o JWT está decodificado
  ): Promise<Admin> {
    const adminId = req.user.id;  // Aqui você pega o ID do admin a partir do JWT

    return this.adminService.createEmployee(createEmployeeDto, adminId);
  }

 @Get('subordinates')
  @UseGuards(AuthGuard('jwt'))  // Protege a rota com o JWT
  async getSubordinates(@Request() req: any): Promise<Admin[]> {
    const adminId = req.user.id;  // Pega o ID do admin do JWT
    console.log("AdminId do JWT: ", adminId);  // Debugging
    return this.adminService.getSubordinates(adminId);
  }

  @Delete('employees/:employeeId')
  @UseGuards(AuthGuard('jwt'))  // Protege a rota com o JWT
  async deleteEmployee(
    @Param('employeeId') employeeId: string, // O ID do subordinado a ser excluído
    @Request() req: any,  // Acessa o ID do admin no JWT
  ): Promise<void> {
    const adminId = req.user.id;  // Pega o ID do admin do JWT
    return this.adminService.deleteEmployee(employeeId, adminId);
  }

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  async findAll(): Promise<Admin[]> {
    return await this.adminService.findAllAdmins();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Admin> {
    return await this.adminService.findOneAdmin(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() adminData: Partial<Admin>,
  ): Promise<Admin> {
    return await this.adminService.updateAdmin(id, adminData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminService.deleteAdmin(id);
  }

}
