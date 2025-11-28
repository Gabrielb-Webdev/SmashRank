import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import TournamentsClient from './TournamentsClient'

export const dynamic = 'force-dynamic'

async function getTournaments() {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: {},
      // Mostrar torneos de todas las provincias de Argentina
      include: {
        creator: {
          select: {
            gamertag: true
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })
    return tournaments
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return []
  }
}

export default async function TournamentsPage() {
  const session = await getServerSession()
  const tournaments = await getTournaments()

  return (
    <TournamentsClient 
      tournaments={tournaments} 
      isAdmin={(session?.user as any)?.role === 'admin'}
    />
  )
}
