import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { Paciente } from '../entities/paciente.entity';

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
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePacienteDto): Promise<Paciente> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.prisma.paciente.create({
      data: {
        dni: data.dni,
        telefono: data.telefono,
        usuario: {
          create: {
            email: data.email,
            password: hashedPassword,
            nombre: data.nombre,
            rol: 'PACIENTE',
          },
        },
      },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async findAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany({
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { usuario: { select: usuarioSafeSelect } },
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: string, data: UpdatePacienteDto): Promise<Paciente> {
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const usuarioUpdateData: Record<string, unknown> = {};
    if (data.email !== undefined) {
      usuarioUpdateData.email = data.email;
    }
    if (data.nombre !== undefined) {
      usuarioUpdateData.nombre = data.nombre;
    }
    if (hashedPassword) {
      usuarioUpdateData.password = hashedPassword;
    }

    const pacienteData: Record<string, unknown> = {};
    if (data.dni !== undefined) {
      pacienteData.dni = data.dni;
    }
    if (data.telefono !== undefined) {
      pacienteData.telefono = data.telefono;
    }

    return this.prisma.paciente.update({
      where: { id },
      data: {
        ...pacienteData,
        usuario: Object.keys(usuarioUpdateData).length
          ? { update: usuarioUpdateData }
          : undefined,
      },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async remove(id: string): Promise<Paciente> {
    return this.prisma.paciente.delete({
      where: { id },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }
}
