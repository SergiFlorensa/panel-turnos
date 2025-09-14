// create-medico.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

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

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
