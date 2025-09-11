import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [AuthModule, MedicosModule, PacientesModule, TurnosModule],
})
export class AppModule {}

