'use client'

import { useState, useEffect } from 'react'

interface TournamentCountdownProps {
  startDate: string
  status: string
}

export default function TournamentCountdown({ startDate, status }: TournamentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(startDate).getTime() - new Date().getTime()
      
      if (difference <= 0) {
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  if (status !== 'upcoming') {
    return null
  }

  if (!timeLeft) {
    return (
      <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 text-center">
        <p className="text-green-400 font-bold text-xl">¡El torneo ha comenzado!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500 rounded-lg p-6">
      <h3 className="text-white text-center font-bold text-lg mb-4">
        ⏰ Tiempo para el inicio
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-gray-400">Días</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-gray-400">Horas</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-400">Min</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-400">Seg</div>
        </div>
      </div>
    </div>
  )
}
