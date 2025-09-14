import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
