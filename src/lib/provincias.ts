// Provincias de Argentina
export const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán'
] as const

export type ProvinciaArgentina = typeof PROVINCIAS_ARGENTINA[number]

// Helper para validar provincia
export function isValidProvincia(provincia: string): provincia is ProvinciaArgentina {
  return PROVINCIAS_ARGENTINA.includes(provincia as ProvinciaArgentina)
}

// Mapeo de provincias a regiones (para agrupar si es necesario)
export const REGIONES_ARGENTINA = {
  'NOA': ['Jujuy', 'Salta', 'Tucumán', 'Catamarca', 'La Rioja', 'Santiago del Estero'],
  'NEA': ['Formosa', 'Chaco', 'Misiones', 'Corrientes'],
  'Cuyo': ['Mendoza', 'San Juan', 'San Luis'],
  'Centro': ['Córdoba', 'Santa Fe', 'Entre Ríos', 'La Pampa'],
  'Patagonia': ['Neuquén', 'Río Negro', 'Chubut', 'Santa Cruz', 'Tierra del Fuego'],
  'AMBA': ['Buenos Aires', 'Ciudad Autónoma de Buenos Aires']
}

export function getRegionFromProvincia(provincia: ProvinciaArgentina): string {
  for (const [region, provincias] of Object.entries(REGIONES_ARGENTINA)) {
    if ((provincias as readonly string[]).includes(provincia)) {
      return region
    }
  }
  return 'Argentina'
}
