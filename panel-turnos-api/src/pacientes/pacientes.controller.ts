import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { Paciente } from '../entities/paciente.entity';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() data: CreatePacienteDto): Promise<Paciente> {
    return this.pacientesService.create(data);
  }

  @Get()
  findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Paciente> {
    return this.pacientesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePacienteDto,
  ): Promise<Paciente> {
    return this.pacientesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Paciente> {
    return this.pacientesService.remove(id);
  }
}
