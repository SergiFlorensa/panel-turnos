import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() data: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(data);
  }

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return this.usuariosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.remove(id);
  }
}
