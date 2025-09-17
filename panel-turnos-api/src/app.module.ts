import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MedicosModule,
    PacientesModule,
    TurnosModule,
    UsuariosModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
