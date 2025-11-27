import { getServerSession as nextAuthGetServerSession } from 'next-auth/next'
import { authOptions } from './auth'

export async function getServerSession() {
  try {
    return await nextAuthGetServerSession(authOptions)
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}
