import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { Medico } from '../entities/medico.entity';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMedicoDto): Promise<Medico> {
    return this.prisma.medico.create({
      data: {
        especialidad: data.especialidad,
        usuario: {
          create: {
            nombre: data.nombre,
            email: data.email,
            password: data.password,
            rol: 'MEDICO',
          },
        },
      },
      include: { usuario: true },
    });
  }

  async findAll(): Promise<Medico[]> {
    return this.prisma.medico.findMany({ include: { usuario: true } });
  }

  async findOne(id: string): Promise<Medico> {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!medico) {
      throw new NotFoundException(`Médico con id ${id} no encontrado`);
    }
    return medico;
  }

  async update(id: string, data: UpdateMedicoDto): Promise<Medico> {
    return this.prisma.medico.update({
      where: { id },
      data: {
        especialidad: data.especialidad,
        usuario: data.nombre || data.email || data.password
          ? {
              update: {
                nombre: data.nombre,
                email: data.email,
                password: data.password,
              },
            }
          : undefined,
      },
      include: { usuario: true },
    });
  }

  async remove(id: string): Promise<Medico> {
    return this.prisma.medico.delete({
      where: { id },
      include: { usuario: true },
    });
  }
}
