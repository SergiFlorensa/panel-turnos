// src/usuarios/usuarios.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UsuarioSafe } from '../entities/usuario.entity';

const SALT_ROUNDS = 10;
const usuarioSafeSelect = {
  id: true,
  email: true,
  nombre: true,
  rol: true,
  creadoEn: true,
  actualizadoEn: true,
};

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioDto): Promise<UsuarioSafe> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.prisma.usuario.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: usuarioSafeSelect,
    });
  }

  async findAll(): Promise<UsuarioSafe[]> {
    return this.prisma.usuario.findMany({ select: usuarioSafeSelect });
  }

  async findOne(id: string): Promise<UsuarioSafe> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: usuarioSafeSelect,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<UsuarioSafe> {
    const updateData: UpdateUsuarioDto = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: usuarioSafeSelect,
    });
  }

  async remove(id: string): Promise<UsuarioSafe> {
    return this.prisma.usuario.delete({
      where: { id },
      select: usuarioSafeSelect,
    });
  }
}
