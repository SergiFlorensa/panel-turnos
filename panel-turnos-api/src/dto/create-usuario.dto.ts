import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  rol: Rol;
}
