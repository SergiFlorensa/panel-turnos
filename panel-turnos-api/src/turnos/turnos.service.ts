import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTurnoDto } from '../dto/create-turno.dto';
import { UpdateTurnoDto } from '../dto/update-turno.dto';
import { Turno } from '../entities/turno.entity';

@Injectable()
export class TurnosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTurnoDto): Promise<Turno> {
    const fecha = new Date(data.fechaHora);
    const hora = fecha.getHours();

    // Validar horario (8–18h)
    if (hora < 8 || hora >= 18) {
      throw new BadRequestException('Los turnos solo pueden asignarse entre las 08:00 y las 18:00');
    }

    // Validar solapamiento: mismo médico, misma fecha/hora
    const solapado = await this.prisma.turno.findFirst({
      where: {
        medicoId: data.medicoId,
        fechaHora: fecha,
      },
    });

    if (solapado) {
      throw new BadRequestException('El médico ya tiene un turno en ese horario');
    }

    return this.prisma.turno.create({
      data: {
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        fechaHora: fecha,
        estado: data.estado ?? 'PENDIENTE',
        notas: data.notas,
      },
      include: { medico: true, paciente: true },
    });
  }

  async findAll(): Promise<Turno[]> {
    return this.prisma.turno.findMany({ include: { medico: true, paciente: true } });
  }

  async findOne(id: string): Promise<Turno> {
    const turno = await this.prisma.turno.findUnique({
      where: { id },
      include: { medico: true, paciente: true },
    });
    if (!turno) throw new NotFoundException(`Turno con id ${id} no encontrado`);
    return turno;
  }

  async update(id: string, data: UpdateTurnoDto): Promise<Turno> {
    return this.prisma.turno.update({
      where: { id },
      data,
      include: { medico: true, paciente: true },
    });
  }

  async remove(id: string): Promise<Turno> {
    return this.prisma.turno.delete({
      where: { id },
      include: { medico: true, paciente: true },
    });
  }
}
