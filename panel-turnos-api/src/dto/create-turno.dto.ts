import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { EstadoTurno } from '@prisma/client';

console.log('DEBUG EstadoTurno:', EstadoTurno); // 👈 añade esta línea

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
