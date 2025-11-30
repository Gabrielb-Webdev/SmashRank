import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import SessionProvider from '@/components/SessionProvider'
import SmashDecoration from '@/components/SmashDecoration'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'SmashRank - Torneos de Super Smash Bros Ultimate',
  description: 'Plataforma de torneos y ranking para Super Smash Bros Ultimate by Brodev Lab',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-[#0A0118] text-white antialiased">
        <SessionProvider>
          <SmashDecoration />
          <Navbar />
          <main className="pt-20 relative z-10">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
