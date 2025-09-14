import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Prisma, EstadoTurno } from '@prisma/client';

export class CreateTurnoDto {
  @IsString()
  @IsNotEmpty()
  medicoId: string;

  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @IsDateString()
  fechaHora: string;

  @IsEnum(EstadoTurno)
  @IsOptional()
  estado?: EstadoTurno;

  @IsString()
  @IsOptional()
  notas?: string;
}
