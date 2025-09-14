import { Rol } from '@prisma/client';

export class Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  rol: Rol;
  creadoEn: Date;
  actualizadoEn: Date;
}
