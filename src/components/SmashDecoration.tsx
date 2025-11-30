'use client';

export default function SmashDecoration() {
  return (
    <>
      {/* Smash Bros Cross Logo - Top Left */}
      <div className="fixed top-8 left-8 pointer-events-none z-0 opacity-10">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          {/* Smash Cross */}
          <path 
            d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" 
            fill="url(#smashGradient)"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="8" fill="#FF0046" />
          
          <defs>
            <linearGradient id="smashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF0046" />
              <stop offset="50%" stopColor="#00D9FF" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Smash Bros Cross Logo - Bottom Right */}
      <div className="fixed bottom-8 right-8 pointer-events-none z-0 opacity-10">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path 
            d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" 
            fill="url(#smashGradient2)"
            stroke="#00D9FF"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="8" fill="#00D9FF" />
          
          <defs>
            <linearGradient id="smashGradient2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF0046" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Stars */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              filter: `drop-shadow(0 0 10px ${
                i % 3 === 0 ? '#FF0046' : i % 3 === 1 ? '#00D9FF' : '#FFD700'
              })`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Impact Lines (como cuando golpeas en Smash) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <g stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.3">
            <line x1="0" y1="20%" x2="100%" y2="20%" />
            <line x1="0" y1="40%" x2="100%" y2="40%" />
            <line x1="0" y1="60%" x2="100%" y2="60%" />
            <line x1="0" y1="80%" x2="100%" y2="80%" />
            <line x1="20%" y1="0" x2="20%" y2="100%" />
            <line x1="40%" y1="0" x2="40%" y2="100%" />
            <line x1="60%" y1="0" x2="60%" y2="100%" />
            <line x1="80%" y1="0" x2="80%" y2="100%" />
          </g>
        </svg>
      </div>
    </>
  );
}
