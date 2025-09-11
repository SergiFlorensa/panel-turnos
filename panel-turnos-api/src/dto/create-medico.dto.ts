import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}
