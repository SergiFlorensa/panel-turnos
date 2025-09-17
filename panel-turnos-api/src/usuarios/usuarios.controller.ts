// src/usuarios/usuarios.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UsuarioSafe } from '../entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('perfil')
  getProfile(@CurrentUser() user: any): Promise<UsuarioSafe> {
    return this.usuariosService.findOne(user.userId);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: CreateUsuarioDto): Promise<UsuarioSafe> {
    return this.usuariosService.create(data);
  }

  @Get()
  @Roles('ADMIN')
  findAll(): Promise<UsuarioSafe[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MEDICO')
  findOne(@Param('id') id: string): Promise<UsuarioSafe> {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: UpdateUsuarioDto,
  ): Promise<UsuarioSafe> {
    return this.usuariosService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string): Promise<UsuarioSafe> {
    return this.usuariosService.remove(id);
  }
}
