import { UsuarioSafe } from './usuario.entity';

export class Medico {
  id: string;
  especialidad: string;
  usuarioId: string;
  usuario?: UsuarioSafe;
}
