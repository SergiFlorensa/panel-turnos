import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { Medico } from '../entities/medico.entity';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  create(@Body() data: CreateMedicoDto): Promise<Medico> {
    return this.medicosService.create(data);
  }

  @Get()
  findAll(): Promise<Medico[]> {
    return this.medicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Medico> {
    return this.medicosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateMedicoDto,
  ): Promise<Medico> {
    return this.medicosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Medico> {
    return this.medicosService.remove(id);
  }
}
