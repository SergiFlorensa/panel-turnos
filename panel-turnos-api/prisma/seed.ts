// prisma/seed.ts
import { PrismaClient, Rol, EstadoTurno } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  console.log('Starting database seed...');

  await prisma.turno.deleteMany();
  await prisma.medico.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.usuario.deleteMany();

  const adminPasswordHash = await bcrypt.hash('admin1234', saltRounds);
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@demo.com',
      password: adminPasswordHash,
      nombre: 'Admin Demo',
      rol: Rol.ADMIN,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  const medicosData = [
    { especialidad: 'Cardiologia', nombre: 'Dr. Juan Perez', email: 'juan.perez@demo.com', pass: '1234' },
    { especialidad: 'Pediatria', nombre: 'Dra. Maria Lopez', email: 'maria.lopez@demo.com', pass: '1234' },
    { especialidad: 'Traumatologia', nombre: 'Dr. Carlos Sanchez', email: 'carlos.sanchez@demo.com', pass: '1234' },
  ];

  for (const medico of medicosData) {
    const hash = await bcrypt.hash(medico.pass, saltRounds);
    const created = await prisma.medico.create({
      data: {
        especialidad: medico.especialidad,
        usuario: {
          create: {
            nombre: medico.nombre,
            email: medico.email,
            password: hash,
            rol: Rol.MEDICO,
          },
        },
      },
      include: { usuario: true },
    });
    console.log(`Medico created: ${created.usuario.email}`);
  }

  for (let i = 0; i < 10; i++) {
    const email = `paciente${i + 1}@demo.com`;
    const hash = await bcrypt.hash('1234', saltRounds);
    const created = await prisma.paciente.create({
      data: {
        dni: `1234567${i}A`,
        telefono: `60000000${i}`,
        usuario: {
          create: {
            nombre: `Paciente ${i + 1}`,
            email,
            password: hash,
            rol: Rol.PACIENTE,
          },
        },
      },
      include: { usuario: true },
    });
    console.log(`Paciente created: ${created.usuario.email}`);
  }

  const medicos = await prisma.medico.findMany();
  const pacientes = await prisma.paciente.findMany();
  const turnosToCreate = [
    { medicoIndex: 0, pacienteIndex: 0, iso: '2025-09-15T09:00:00Z', estado: EstadoTurno.PENDIENTE },
    { medicoIndex: 1, pacienteIndex: 1, iso: '2025-09-15T10:00:00Z', estado: EstadoTurno.CONFIRMADO },
    { medicoIndex: 2, pacienteIndex: 2, iso: '2025-09-15T11:00:00Z', estado: EstadoTurno.PENDIENTE },
    { medicoIndex: 0, pacienteIndex: 3, iso: '2025-09-16T09:00:00Z', estado: EstadoTurno.PENDIENTE },
    { medicoIndex: 1, pacienteIndex: 4, iso: '2025-09-16T10:00:00Z', estado: EstadoTurno.PENDIENTE },
  ];

  for (const turno of turnosToCreate) {
    await prisma.turno.create({
      data: {
        medicoId: medicos[turno.medicoIndex].id,
        pacienteId: pacientes[turno.pacienteIndex].id,
        fechaHora: new Date(turno.iso),
        estado: turno.estado,
      },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
