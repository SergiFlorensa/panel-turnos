import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import * as Prisma from '@prisma/client';

export class CreateTurnoDto {
  @IsString()
  @IsNotEmpty()
  medicoId: string;

  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @IsDateString()
  fechaHora: string;

  @IsEnum(Prisma.EstadoTurno)
  @IsOptional()
  estado?: Prisma.EstadoTurno;

  @IsString()
  @IsOptional()
  notas?: string;
}
