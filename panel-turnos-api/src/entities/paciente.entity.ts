import { UsuarioSafe } from './usuario.entity';

export class Paciente {
  id: string;
  dni: string;
  telefono?: string;
  usuarioId: string;
  usuario?: UsuarioSafe;
}
