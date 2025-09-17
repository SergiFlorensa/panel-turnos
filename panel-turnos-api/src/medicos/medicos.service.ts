import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { Medico } from '../entities/medico.entity';

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
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMedicoDto): Promise<Medico> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.prisma.medico.create({
      data: {
        especialidad: data.especialidad,
        usuario: {
          create: {
            nombre: data.nombre,
            email: data.email,
            password: hashedPassword,
            rol: 'MEDICO',
          },
        },
      },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async findAll(): Promise<Medico[]> {
    return this.prisma.medico.findMany({
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async findOne(id: string): Promise<Medico> {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: { usuario: { select: usuarioSafeSelect } },
    });

    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }

    return medico;
  }

  async update(id: string, data: UpdateMedicoDto): Promise<Medico> {
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const usuarioUpdateData: Record<string, unknown> = {};

    if (data.nombre !== undefined) {
      usuarioUpdateData.nombre = data.nombre;
    }
    if (data.email !== undefined) {
      usuarioUpdateData.email = data.email;
    }
    if (hashedPassword) {
      usuarioUpdateData.password = hashedPassword;
    }

    return this.prisma.medico.update({
      where: { id },
      data: {
        ...(data.especialidad !== undefined
          ? { especialidad: data.especialidad }
          : {}),
        usuario: Object.keys(usuarioUpdateData).length
          ? { update: usuarioUpdateData }
          : undefined,
      },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }

  async remove(id: string): Promise<Medico> {
    return this.prisma.medico.delete({
      where: { id },
      include: { usuario: { select: usuarioSafeSelect } },
    });
  }
}
