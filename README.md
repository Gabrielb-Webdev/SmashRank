# 🎮 SmashRank by Brodev Lab

Plataforma de torneos y ranking para Super Smash Bros Ultimate

## 🚀 Características

- ✅ Sistema de torneos con brackets tipo start.gg
- ✅ Matchmaking automático entre jugadores
- ✅ Sistema de ranking con puntos personalizados
- ✅ Proceso de selección de stages/personajes por turnos (DSR)
- ✅ Sistema de verificación de resultados entre jugadores
- ✅ Integración con start.gg

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de datos:** PostgreSQL
- **Real-time:** Socket.io
- **Autenticación:** NextAuth.js v5

## 📦 Instalación

### Requisitos previos
- Node.js 18+ 
- PostgreSQL
- npm o pnpm

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Gabrielb-Webdev/SmashRank.git
cd SmashRank
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` y configura:
- `DATABASE_URL`: Tu conexión a PostgreSQL
- `NEXTAUTH_SECRET`: Genera uno con `openssl rand -base64 32`
- `NEXTAUTH_URL`: URL de tu app (http://localhost:3000 en dev)

4. **Configurar base de datos**
```bash
# Crear migración inicial
npx prisma migrate dev --name init

# Cargar datos de prueba
npx prisma db seed
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Datos de prueba

Después del seed, puedes usar estas credenciales:

**Admin:**
- Email: `admin@smashrank.com`
- Password: `admin123`

**Jugador 1:**
- Email: `player1@test.com`
- Password: `player123`

**Jugador 2:**
- Email: `player2@test.com`
- Password: `player123`

## 🎯 Roadmap

### ✅ Fase 1 - Core (MVP)
- [x] Configuración inicial
- [x] Estilos de Brodev Lab
- [ ] Sistema de autenticación
- [ ] CRUD de torneos
- [ ] Sistema de inscripción
- [ ] Check-in system
- [ ] Bracket básico
- [ ] Tabla de ranking

### 🚧 Fase 2 - Sistema de Match
- [ ] Stage banning/picking por turnos
- [ ] Character selection
- [ ] Reporte de resultados
- [ ] Notificaciones real-time
- [ ] Resolución de conflictos

### 📅 Fase 3 - Features Avanzadas
- [ ] Double elimination brackets
- [ ] Matchmaking automático
- [ ] Filtros en ranking
- [ ] Gráficos de evolución

### 🔮 Fase 4 - Integración start.gg
- [ ] OAuth con start.gg
- [ ] Importación de resultados
- [ ] Sincronización de brackets

## 📝 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Lint
npm run lint

# Prisma Studio (GUI para la DB)
npx prisma studio

# Reset DB
npx prisma migrate reset
```

## 🎨 Estilos

Este proyecto usa la paleta de colores de **Brodev Lab**:
- Primary: `#7C3AED` (Púrpura)
- Secondary: `#EC4899` (Rosa/Magenta)
- Background: `#0A0118` (Oscuro)

## 📄 Licencia

© 2024 Brodev Lab. Todos los derechos reservados.

## 🤝 Contribuir

Este es un proyecto privado de Brodev Lab.

## 📧 Contacto

Para soporte o consultas: contacto@brodevlab.com
