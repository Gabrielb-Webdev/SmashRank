'use client'

import { useState } from 'react'
import { SSBU_CHARACTERS } from '@/lib/characters'
import Image from 'next/image'

type Props = {
  value: string[]
  onChange: (characters: string[]) => void
  maxSelections?: number
  label?: string
}

export default function CharacterSelector({ value, onChange, maxSelections = 3, label }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCharacters = SSBU_CHARACTERS.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleCharacter = (characterName: string) => {
    if (value.includes(characterName)) {
      onChange(value.filter(c => c !== characterName))
    } else if (value.length < maxSelections) {
      onChange([...value, characterName])
    }
  }

  const isSelected = (characterName: string) => value.includes(characterName)

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          <span className="text-gray-400 text-xs ml-2">
            (Máximo {maxSelections})
          </span>
        </label>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar personaje..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
        />
        <svg 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Selected Characters */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          {value.map((char, index) => (
            <div 
              key={char}
              className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/40"
            >
              <span className="text-sm font-medium">
                {index === 0 && '⭐ '}
                {char}
              </span>
              <button
                onClick={() => toggleCharacter(char)}
                className="hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Character Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 bg-black/20 rounded-lg border border-purple-500/20">
        {filteredCharacters.map((character) => {
          const selected = isSelected(character.name)
          const disabled = !selected && value.length >= maxSelections

          return (
            <button
              key={character.id}
              onClick={() => !disabled && toggleCharacter(character.name)}
              disabled={disabled}
              className={`
                relative aspect-square rounded-lg overflow-hidden transition-all duration-200
                ${selected 
                  ? 'ring-2 ring-purple-500 scale-105 shadow-lg shadow-purple-500/50' 
                  : disabled
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:scale-110 hover:ring-2 hover:ring-purple-400/50'
                }
              `}
              title={character.name}
            >
              {/* Character Icon */}
              <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center p-1">
                <div className="text-2xl">
                  {character.name.charAt(0)}
                </div>
              </div>

              {/* Selected Badge */}
              {selected && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs w-5 h-5 rounded-bl-lg flex items-center justify-center font-bold">
                  {value.indexOf(character.name) + 1}
                </div>
              )}

              {/* Character Name on Hover */}
              <div className="absolute inset-x-0 bottom-0 bg-black/80 text-xs py-1 px-1 text-center opacity-0 hover:opacity-100 transition-opacity">
                {character.name}
              </div>
            </button>
          )
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No se encontraron personajes
        </p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        {value.length === 0 
          ? `Selecciona hasta ${maxSelections} personaje${maxSelections > 1 ? 's' : ''}. El primero será tu main.`
          : value.length === maxSelections
            ? 'Has alcanzado el límite de selecciones'
            : `Puedes seleccionar ${maxSelections - value.length} más`
        }
      </p>
    </div>
  )
}
