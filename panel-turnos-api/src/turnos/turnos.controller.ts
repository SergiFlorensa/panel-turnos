import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from '../dto/create-turno.dto';
import { UpdateTurnoDto } from '../dto/update-turno.dto';
import { Turno } from '../entities/turno.entity';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() data: CreateTurnoDto): Promise<Turno> {
    return this.turnosService.create(data);
  }

  @Get()
  findAll(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('medicoId') medicoId?: string,
  ): Promise<Turno[]> {
    return this.turnosService.findAll({ start, end, medicoId });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Turno> {
    return this.turnosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateTurnoDto): Promise<Turno> {
    return this.turnosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Turno> {
    return this.turnosService.remove(id);
  }
}
