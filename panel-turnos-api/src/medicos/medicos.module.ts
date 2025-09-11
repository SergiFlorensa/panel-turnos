import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { PacientesModule } from '../pacientes/pacientes.module';
import { TurnosModule } from '../turnos/turnos.module';

@Module({
  controllers: [MedicosController],
  providers: [MedicosService],
  imports: [PacientesModule, TurnosModule],
})
export class MedicosModule {}
