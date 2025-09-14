import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';
import { UsuariosModule } from './usuarios/usuarios.module'; // <- si lo tienes ya
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,     // <- añade Prisma global
    AuthModule,
    MedicosModule,
    PacientesModule,
    TurnosModule,
    UsuariosModule,
  ],
})
export class AppModule {}
