import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MedicosModule } from './medicos.module';
import { PacientesModule } from './pacientes.module';
import { TurnosModule } from './turnos.module';

@Module({
  imports: [AuthModule, MedicosModule, PacientesModule, TurnosModule],
})
export class AppModule {}

