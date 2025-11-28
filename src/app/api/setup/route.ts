import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST() {
  try {
    // Verificar si ya hay datos (o si las tablas no existen aún)
    let existingUsers = 0
    try {
      existingUsers = await prisma.user.count()
    } catch (tableError: any) {
      // Si las tablas no existen, retornar error específico
      if (tableError.code === 'P2021' || tableError.message.includes('does not exist')) {
        return NextResponse.json({
          error: 'Las tablas de la base de datos no existen. Ejecuta "npx prisma db push" en tu terminal local primero.',
          details: 'Abre tu terminal en la carpeta del proyecto y ejecuta: npx prisma db push',
          code: 'TABLES_NOT_FOUND'
        }, { status: 500 })
      }
      throw tableError
    }
    
    if (existingUsers > 0) {
      return NextResponse.json(
        { message: 'La base de datos ya tiene datos. Setup completado previamente.' },
        { status: 200 }
      )
    }

    // Crear usuario admin
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@smashrank.com',
        password: hashedPasswordAdmin,
        gamertag: 'AdminSmash',
        role: 'admin',
        mainCharacter: 'Mario,Fox',
        region: 'Norte',
        points: 0,
      }
    })

    // Crear jugadores de prueba
    const hashedPasswordPlayer = await bcrypt.hash('player123', 10)
    
    const players = await Promise.all([
      prisma.user.create({
        data: {
          email: 'player1@test.com',
          password: hashedPasswordPlayer,
          gamertag: 'ProGamer',
          role: 'player',
          mainCharacter: 'Fox,Falco',
          region: 'Norte',
          points: 150,
        }
      }),
      prisma.user.create({
        data: {
          email: 'player2@test.com',
          password: hashedPasswordPlayer,
          gamertag: 'SmashMaster',
          role: 'player',
          mainCharacter: 'Marth,Roy',
          region: 'Sur',
          points: 120,
        }
      }),
      prisma.user.create({
        data: {
          email: 'player3@test.com',
          password: hashedPasswordPlayer,
          gamertag: 'ComboKing',
          role: 'player',
          mainCharacter: 'Captain Falcon',
          region: 'Centro',
          points: 90,
        }
      })
    ])

    // Crear un torneo de ejemplo
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // En 7 días
    const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 días después
    const checkInTime = new Date(startDate.getTime() - 15 * 60 * 1000) // 15 min antes
    
    const tournament = await prisma.tournament.create({
      data: {
        name: 'Torneo Inaugural SmashRank Argentina 2024',
        description: 'Torneo nacional de Super Smash Bros Ultimate para jugadores de toda Argentina',
        game: 'Super Smash Bros. Ultimate',
        region: 'Argentina',
        startDate,
        endDate,
        checkInTime,
        format: 'double',
        maxPlayers: 32,
        status: 'upcoming',
        entryFee: 0,
        prizePool: 'Premios simbólicos y ranking points',
        rules: '3 stocks, 7 minutos, stage striking, counterpicks habilitados',
        createdById: admin.id,
        starterStages: ['Battlefield', 'Final Destination', 'Pokemon Stadium 2', 'Smashville'],
        cpStages: ['Kalos Pokemon League', 'Town & City'],
        bannedStages: ['Temple', 'New Pork City'],
        roundConfig: {
          'WR1': 3,
          'WSF': 3,
          'WF': 5,
          'LR1': 3,
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: '¡Base de datos configurada exitosamente!',
      data: {
        usersCreated: players.length + 1,
        tournamentsCreated: 1,
        adminEmail: 'admin@smashrank.com',
        adminPassword: 'admin123',
        testPlayerEmail: 'player1@test.com',
        testPlayerPassword: 'player123'
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Setup error:', error)
    
    // Si es un error de conexión a la base de datos
    if (error.code === 'P1001') {
      return NextResponse.json({
        error: 'No se puede conectar a la base de datos. Verifica que DATABASE_URL esté configurado correctamente en las variables de entorno.',
        details: error.message
      }, { status: 500 })
    }

    // Si las tablas no existen
    if (error.code === 'P2021') {
      return NextResponse.json({
        error: 'Las tablas de la base de datos no existen. Ejecuta "npx prisma db push" en tu terminal local primero.',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Error al configurar la base de datos',
      details: error.message,
      code: error.code
    }, { status: 500 })
  }
}
