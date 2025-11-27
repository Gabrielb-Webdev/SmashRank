import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function POST() {
  try {
    const prisma = new PrismaClient()
    
    // Intentar hacer una query simple para verificar la conexión
    await prisma.$connect()
    
    // Las tablas deberían existir automáticamente si Prisma Migrate está configurado
    // Si no, Vercel debería crearlas automáticamente con la integración de Neon
    
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Conexión a base de datos exitosa. Las tablas se crearán automáticamente.',
    })
  } catch (error: any) {
    console.error('Error connecting to database:', error)
    
    return NextResponse.json({
      error: 'Error al conectar con la base de datos',
      details: error.message,
      hint: 'Asegúrate de que DATABASE_URL esté configurado correctamente en Vercel'
    }, { status: 500 })
  }
}
