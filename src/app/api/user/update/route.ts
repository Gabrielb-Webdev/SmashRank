import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const data = await req.json()

    // Validaciones
    if (data.gamertag) {
      // Verificar que el gamertag no esté en uso por otro usuario
      const existing = await prisma.user.findFirst({
        where: {
          gamertag: data.gamertag,
          NOT: {
            id: session.user.id
          }
        }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este gamertag ya está en uso' },
          { status: 400 }
        )
      }
    }

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gamertag: data.gamertag,
        mainCharacter: data.mainCharacter,
        region: data.region || 'Argentina'
      }
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        gamertag: user.gamertag,
        mainCharacter: user.mainCharacter,
        region: user.region
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}
