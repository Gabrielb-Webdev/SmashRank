import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Ejecutar prisma db push para crear las tablas
    const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate')
    
    console.log('Prisma push output:', stdout)
    if (stderr) console.error('Prisma push errors:', stderr)

    return NextResponse.json({
      success: true,
      message: 'Tablas creadas exitosamente',
      output: stdout
    })
  } catch (error: any) {
    console.error('Error creating tables:', error)
    
    return NextResponse.json({
      error: 'Error al crear las tablas',
      details: error.message,
      output: error.stdout || '',
      errorOutput: error.stderr || ''
    }, { status: 500 })
  }
}
