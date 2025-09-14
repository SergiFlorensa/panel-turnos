import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Iniciando seed...');

  // Limpieza previa (cuidado en entornos reales)
  console.log('🧹 Limpiando tablas (turnos, medicos, pacientes, usuarios)...');
  await prisma.turno.deleteMany();
  await prisma.medico.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.usuario.deleteMany();
  console.log('🧹 Tablas limpiadas.');

  // 0) Usuario de administración simple (prueba mínima)
  console.log('🔰 Creando usuario ADMIN de prueba...');
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@demo.com',
      password: 'admin1234',
      nombre: 'Admin Demo',
      rol: 'ADMIN',
    },
  });
  console.log('🔰 Usuario ADMIN creado:', { id: admin.id, email: admin.email });

  // 1) Crear médicos con usuarios (secuencial para mejor trazabilidad)
  console.log('👨‍⚕️ Creando médicos...');
  const medicosData = [
    { especialidad: 'Cardiología', nombre: 'Dr. Juan Pérez', email: 'juan.perez@demo.com' },
    { especialidad: 'Pediatría', nombre: 'Dra. María López', email: 'maria.lopez@demo.com' },
    { especialidad: 'Traumatología', nombre: 'Dr. Carlos Sánchez', email: 'carlos.sanchez@demo.com' },
  ];

  const medicos = [];
  for (const m of medicosData) {
    const created = await prisma.medico.create({
      data: {
        especialidad: m.especialidad,
        usuario: {
          create: {
            nombre: m.nombre,
            email: m.email,
            password: '1234',
            rol: 'MEDICO',
          },
        },
      },
      include: { usuario: true },
    });
    medicos.push(created);
    console.log(`  ✅ Médico creado: ${created.usuario.nombre} (medicoId=${created.id})`);
  }

  // 2) Crear pacientes con usuarios
  console.log('🧑‍🤝‍🧑 Creando pacientes...');
  const pacientes = [];
  for (let i = 0; i < 10; i++) {
    const usuarioEmail = `paciente${i + 1}@demo.com`;
    const created = await prisma.paciente.create({
      data: {
        dni: `1234567${i}A`,
        telefono: `60000000${i}`,
        usuario: {
          create: {
            nombre: `Paciente ${i + 1}`,
            email: usuarioEmail,
            password: '1234',
            rol: 'PACIENTE',
          },
        },
      },
      include: { usuario: true },
    });
    pacientes.push(created);
    console.log(`  ✅ Paciente creado: ${created.usuario.nombre} (pacienteId=${created.id})`);
  }

  console.log(`👨‍⚕️ Médicos totales: ${medicos.length}, 🧑‍🤝‍🧑 Pacientes totales: ${pacientes.length}`);

  // 3) Validar que hay suficientes para crear turnos
  if (medicos.length < 3 || pacientes.length < 5) {
    throw new Error('No hay suficientes médicos/pacientes para crear los turnos de ejemplo.');
  }

  // 4) Crear turnos iniciales (fechas en UTC; ajusta si necesitas otra zona)
  console.log('📅 Creando turnos de ejemplo...');
  const turnosToCreate = [
    { medicoIndex: 0, pacienteIndex: 0, iso: '2025-09-15T09:00:00Z', estado: 'PENDIENTE' },
    { medicoIndex: 1, pacienteIndex: 1, iso: '2025-09-15T10:00:00Z', estado: 'CONFIRMADO' },
    { medicoIndex: 2, pacienteIndex: 2, iso: '2025-09-15T11:00:00Z', estado: 'PENDIENTE' },
    { medicoIndex: 0, pacienteIndex: 3, iso: '2025-09-16T09:00:00Z', estado: 'PENDIENTE' },
    { medicoIndex: 1, pacienteIndex: 4, iso: '2025-09-16T10:00:00Z', estado: 'PENDIENTE' },
  ];

  for (const t of turnosToCreate) {
    const created = await prisma.turno.create({
      data: {
        medicoId: medicos[t.medicoIndex].id,
        pacienteId: pacientes[t.pacienteIndex].id,
        fechaHora: new Date(t.iso),
        estado: t.estado as any, // Prisma enum string accepted
      },
    });
    console.log(`  ✅ Turno creado: id=${created.id} medico=${created.medicoId} paciente=${created.pacienteId} fecha=${created.fechaHora.toISOString()}`);
  }

  console.log('✅ Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
