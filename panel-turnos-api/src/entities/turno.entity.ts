import { EstadoTurno } from '@prisma/client';
import { Medico } from './medico.entity';
import { Paciente } from './paciente.entity';

export class Turno {
  id: string;
  medicoId: string;
  pacienteId: string;
  fechaHora: Date;
  estado: EstadoTurno;
  notas?: string;
  creadoEn: Date;
  actualizadoEn: Date;
  medico?: Medico;
  paciente?: Paciente;
}
