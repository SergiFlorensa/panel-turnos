import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { Paciente } from '../entities/paciente.entity';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePacienteDto): Promise<Paciente> {
    return this.prisma.paciente.create({
      data: {
        dni: data.dni,
        telefono: data.telefono,
        usuario: {
          create: {
            email: data.email,
            password: data.password,
            nombre: data.nombre,
            rol: 'PACIENTE',
          },
        },
      },
      include: { usuario: true },
    });
  }

  async findAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany({ include: { usuario: true } });
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: string, data: UpdatePacienteDto): Promise<Paciente> {
    return this.prisma.paciente.update({
      where: { id },
      data: {
        dni: data.dni,
        telefono: data.telefono,
        usuario: data.nombre || data.email || data.password
          ? {
              update: {
                email: data.email,
                password: data.password,
                nombre: data.nombre,
              },
            }
          : undefined,
      },
      include: { usuario: true },
    });
  }

  async remove(id: string): Promise<Paciente> {
    return this.prisma.paciente.delete({
      where: { id },
      include: { usuario: true },
    });
  }
}
