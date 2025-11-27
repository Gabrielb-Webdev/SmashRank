import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smashrank.com' },
    update: {},
    create: {
      email: 'admin@smashrank.com',
      password: adminPassword,
      gamertag: 'Admin',
      role: 'admin',
      points: 0,
      mainCharacter: 'Mario'
    }
  });
  console.log('✅ Admin creado:', admin.gamertag);
  
  // Test players
  const player1Password = await bcrypt.hash('player123', 12);
  const player1 = await prisma.user.upsert({
    where: { email: 'player1@test.com' },
    update: {},
    create: {
      email: 'player1@test.com',
      password: player1Password,
      gamertag: 'Paco',
      role: 'player',
      points: 1250,
      mainCharacter: 'Fox,Falco'
    }
  });
  console.log('✅ Jugador 1 creado:', player1.gamertag);
  
  const player2 = await prisma.user.upsert({
    where: { email: 'player2@test.com' },
    update: {},
    create: {
      email: 'player2@test.com',
      password: player1Password,
      gamertag: 'Doku',
      role: 'player',
      points: 1180,
      mainCharacter: 'Mario'
    }
  });
  console.log('✅ Jugador 2 creado:', player2.gamertag);
  
  // Stages
  const stages = [
    { name: 'Battlefield', type: 'starter', imageUrl: '/stages/battlefield.jpg', isLegal: true },
    { name: 'Small Battlefield', type: 'starter', imageUrl: '/stages/small-battlefield.jpg', isLegal: true },
    { name: 'Final Destination', type: 'starter', imageUrl: '/stages/fd.jpg', isLegal: true },
    { name: 'Pokémon Stadium 2', type: 'starter', imageUrl: '/stages/ps2.jpg', isLegal: true },
    { name: 'Smashville', type: 'counterpick', imageUrl: '/stages/smashville.jpg', isLegal: true },
    { name: 'Town & City', type: 'counterpick', imageUrl: '/stages/town-city.jpg', isLegal: true },
    { name: 'Hollow Bastion', type: 'counterpick', imageUrl: '/stages/hollow-bastion.jpg', isLegal: true },
    { name: 'Northern Cave', type: 'counterpick', imageUrl: '/stages/northern-cave.jpg', isLegal: true },
  ];
  
  for (const stage of stages) {
    await prisma.stage.upsert({
      where: { name: stage.name },
      update: {},
      create: stage
    });
  }
  console.log('✅ Stages creados:', stages.length);
  
  // Test tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'TRUE COMBO WEEKLIES #45',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
      checkInTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 - 15 * 60 * 1000), // 15 min antes
      format: 'double',
      maxPlayers: 32,
      status: 'upcoming',
      starterStages: ['Battlefield', 'Small Battlefield', 'Final Destination', 'Pokémon Stadium 2'],
      cpStages: ['Smashville', 'Town & City', 'Hollow Bastion'],
      bannedStages: [],
      roundConfig: {
        'WR1': 3,
        'WQF': 3,
        'WSF': 3,
        'WF': 5,
        'LR1': 3,
        'LQF': 3,
        'LSF': 3,
        'LF': 5,
        'GF': 5
      },
      pointsConfig: {
        '1': 100,
        '2': 75,
        '3': 50,
        '4': 35,
        '5': 25,
        '7': 15,
        '9': 10
      },
      createdById: admin.id
    }
  });
  console.log('✅ Torneo de prueba creado:', tournament.name);
  
  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
