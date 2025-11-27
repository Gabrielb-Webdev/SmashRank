# 🎮 PROMPT COMPLETO PARA DESARROLLAR SMASHRANK BY BRODEV LAB

## Plataforma de torneos y ranking para Super Smash Bros Ultimate

---

## 🎯 OBJETIVO

Desarrollar una aplicación web responsive (PC y Android inicialmente) que permita:
- Sistema de torneos con brackets tipo start.gg
- Matchmaking automático entre jugadores
- Sistema de ranking con puntos personalizados (alternativo para jugadores sin Switch)
- Integración con start.gg para sincronización de resultados
- Proceso de selección de stages/personajes por turnos (DSR - Dave's Stupid Rule)
- Sistema de verificación de resultados entre jugadores

---

## 👥 ROLES DE USUARIO

### Admin (Credenciales especiales)
- Crear y configurar torneos
- Definir stages habilitados/baneados
- Configurar formato de bracket (BO1, BO3, BO5 por ronda)
- Gestionar jugadores y moderar resultados
- Ver estadísticas globales

### Jugador (Sin cuenta admin)
- Registrarse e iniciar sesión
- Unirse a torneos
- Marcar presencia ("Check-in")
- Jugar matches con proceso de stage/character select
- Reportar resultados (requiere confirmación del oponente)
- Ver ranking personal y global

---

## 🎮 FLUJO PRINCIPAL: SISTEMA DE MATCH

### 1. Check-in antes del match
- Ambos jugadores deben marcar "Presente" antes del tiempo límite
- Si un jugador no marca presencia, pierde por DQ (Disqualification)

### 2. Stage Banning/Picking (Primer game del set)
**IMPORTANTE: Este proceso debe ser interactivo y por turnos**

1. **Sistema elige aleatoriamente** quién banea primero (Jugador A)
2. **Jugador A banea 1 stage**
3. **Jugador B banea 2 stages**
4. **Jugador A selecciona el stage** de los restantes
5. **Jugador A elige su personaje primero** y confirma (se bloquea su elección)
6. **Jugador B ve el personaje del rival**, elige su personaje y confirma
7. **Match comienza**

### 3. Después del primer game (Game 2 en adelante - DSR)
1. **Perdedor del game anterior banea 1 stage** (opcional según reglas del torneo)
2. **Perdedor selecciona stage**
3. **Ganador del game anterior elige personaje primero**
4. **Perdedor elige personaje** (counter-pick)
5. **Match comienza**

### 4. Reportar resultado
- Cualquier jugador puede reportar: "Gané 2-1" o "Perdí 1-2"
- El **otro jugador debe confirmar** si el resultado es correcto
- Si hay discrepancia, se notifica a un admin
- Una vez confirmado, se actualizan puntos y se avanza en el bracket

---

## 🏆 FUNCIONALIDADES PRINCIPALES

### Gestión de Torneos (Solo Admin)

#### Crear torneo
- Nombre del torneo
- Fecha y hora de inicio
- Formato de bracket:
  - Single Elimination
  - Double Elimination
  - Round Robin
- **Configuración de Best-Of por ronda:**
  - Winners Round 1: BO1
  - Winners Semis: BO3
  - Winners Finals: BO5
  - Grand Finals: BO5 (con bracket reset si viene de losers)
- Máximo de participantes
- Puntos por colocación (1°: 100pts, 2°: 75pts, 3°: 50pts, etc.)
- **Stages habilitados** para este torneo (selección múltiple)
- **Stages de starter** (para el primer game)
- **Stages de counterpick** (para games posteriores)

#### Gestionar stages
Base de datos de stages de Smash Ultimate:
- Battlefield
- Small Battlefield
- Final Destination
- Pokémon Stadium 2
- Smashville
- Town & City
- Hollow Bastion
- Northern Cave
- Kalos Pokémon League
- etc.

Cada stage tiene:
- Nombre
- Imagen
- Tipo (Starter / Counterpick)
- Estado (Habilitado / Baneado) por torneo

### Sistema de Inscripción (Jugadores)
- Ver torneos próximos
- Botón "Unirse al torneo"
- Check-in 15 minutos antes del inicio
- Ver bracket en tiempo real

### Sistema de Matchmaking Automático
- Cola de espera para friendlies (partidas amistosas)
- Emparejamiento por rango de puntos similar (±100 puntos)
- Notificación push cuando se encuentra match
- Ambos jugadores deben aceptar en 60 segundos

### Sistema de Ranking
- Tabla global ordenada por puntos
- Filtros:
  - Por región (si se implementa)
  - Por main character
  - Por período: Mensual, Anual, All-time
- Historial de puntos ganados/perdidos
- Gráfico de evolución de puntos

### Integración con start.gg (Fase 2 - Opcional para MVP)
- Vincular cuenta de start.gg
- Importar resultados automáticamente
- Validar participación en torneos oficiales

---

## 🎨 DISEÑO Y ESTILOS (BRODEV LAB)

**CRÍTICO: Debes usar estos estilos exactos del repositorio Gabrielb-Webdev/BroDev-Lab**

### Paleta de Colores (Obligatorio)

```css
:root {
  /* Colores principales */
  --primary: #7C3AED;
  --primary-dark: #6D28D9;
  --primary-light: #8B5CF6;
  --secondary: #EC4899;
  --accent-blue: #3B82F6;
  --accent-cyan: #06B6D4;
  
  /* Backgrounds */
  --bg-dark: #0A0118;
  --bg-darker: #050010;
  --bg-card: #1A0B2E;
  --bg-card-hover: #2D1B4E;
  
  /* Textos */
  --text-primary: #FFFFFF;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
  --gradient-secondary: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
  --gradient-accent: linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%);
  
  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(124, 58, 237, 0.1);
  --shadow-md: 0 4px 20px rgba(124, 58, 237, 0.15);
  --shadow-lg: 0 8px 40px rgba(124, 58, 237, 0.25);
  --shadow-glow: 0 0 60px rgba(124, 58, 237, 0.4);
  
  /* Transiciones */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tipografías
- **Títulos:** 'Poppins', sans-serif (font-weight: 700-800)
- **Cuerpo:** 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Logo
Debes copiar el logo desde el repositorio **Gabrielb-Webdev/BroDev-Lab**: `logo.svg` y `favicon.svg`

### Componentes de UI requeridos

#### Navbar
```tsx
<nav className="fixed top-0 w-full bg-[#0A0118]/80 backdrop-blur-xl border-b border-purple-500/10 z-50">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <img src="/logo.svg" alt="Brodev Lab" className="h-12" />
      <span className="text-2xl font-bold font-['Poppins']">
        <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
          SmashRank
        </span>
      </span>
    </div>
    {/* Nav links */}
  </div>
</nav>
```

#### Card con efecto hover
```tsx
<div className="bg-[#1A0B2E] border border-purple-500/20 rounded-2xl p-6 transition-all duration-[0.4s] hover:transform hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(124,58,237,0.4)] hover:border-purple-500">
  {/* Contenido */}
</div>
```

#### Botón primario
```tsx
<button className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-[0.4s] hover:shadow-[0_6px_30px_rgba(124,58,237,0.6)] hover:-translate-y-0.5">
  Unirse al Torneo
</button>
```

#### Botón secundario
```tsx
<button className="bg-transparent text-white border-2 border-purple-500/50 px-8 py-3 rounded-xl font-semibold transition-all duration-[0.4s] hover:border-[#7C3AED] hover:bg-purple-500/10">
  Ver Detalles
</button>
```

---

## 💾 ESTRUCTURA DE BASE DE DATOS

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hashed con bcrypt
  gamertag      String    @unique
  role          String    @default("player") // "admin" | "player"
  
  // Perfil
  mainCharacter String[]  // ["Mario", "Fox"]
  region        String? 
  points        Int       @default(0)
  startggId     String?   @unique
  avatar        String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relaciones
  tournaments   TournamentParticipant[]
  matchesAsP1   Match[]   @relation("Player1")
  matchesAsP2   Match[]   @relation("Player2")
  pointHistory  PointHistory[]
  createdTournaments Tournament[]
}

model Tournament {
  id            String    @id @default(cuid())
  name          String
  startDate     DateTime
  checkInTime   DateTime  // 15 min antes del inicio
  
  // Configuración
  format        String    // "single" | "double" | "roundrobin"
  maxPlayers    Int
  status        String    @default("upcoming") // "upcoming" | "checkin" | "ongoing" | "finished"
  
  // Stages
  starterStages Json      // ["Battlefield", "FD", "PS2"]
  cpStages      Json      // ["Town & City", "Smashville"]
  bannedStages  Json      // ["Temple"]
  
  // Best-of por ronda (JSON)
  roundConfig   Json      // { "WR1": 1, "WSF": 3, "WF": 5, "GF": 5 }
  
  // Puntos
  pointsConfig  Json      // { "1": 100, "2": 75, "3": 50, "4": 35 }
  
  startggUrl    String?
  createdById   String
  createdAt     DateTime  @default(now())
  
  participants  TournamentParticipant[]
  matches       Match[]
  creator       User      @relation(fields: [createdById], references: [id])
}

model TournamentParticipant {
  id            String    @id @default(cuid())
  userId        String
  tournamentId  String
  
  checkedIn     Boolean   @default(false)
  seed          Int?
  placement     Int?
  pointsEarned  Int       @default(0)
  
  user          User      @relation(fields: [userId], references: [id])
  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  
  @@unique([userId, tournamentId])
}

model Match {
  id            String    @id @default(cuid())
  tournamentId  String
  round         String    // "WR1", "WSF", "WF", "LR1", "GF"
  bestOf        Int       // 1, 3, 5
  
  player1Id     String
  player2Id     String
  
  // Check-in
  p1CheckedIn   Boolean   @default(false)
  p2CheckedIn   Boolean   @default(false)
  
  // Estado del match
  status        String    @default("pending") // "pending" | "checkin" | "stage_pick" | "char_select" | "in_progress" | "finished"
  
  // Current game info
  currentGame   Int       @default(1)
  currentPhase  String?   // "ban" | "pick" | "char_select" | "playing"
  currentTurn   String?   // userId de quien tiene el turno
  
  // Ganador
  winnerId      String?
  
  // Scores
  player1Score  Int       @default(0)
  player2Score  Int       @default(0)
  
  // Reporte de resultados
  reportedBy    String?   // userId que reportó primero
  reportedScore Json?     // { "p1": 2, "p2": 1 }
  confirmedBy   String?   // userId que confirmó
  
  // Games individuales
  games         Game[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  player1       User      @relation("Player1", fields: [player1Id], references: [id])
  player2       User      @relation("Player2", fields: [player2Id], references: [id])
  tournament    Tournament @relation(fields: [tournamentId], references: [id])
}

model Game {
  id            String    @id @default(cuid())
  matchId       String
  gameNumber    Int       // 1, 2, 3, etc.
  
  // Stage selection
  bannedStages  Json      // ["FD", "Battlefield"]
  selectedStage String? 
  pickedBy      String?   // userId
  
  // Character selection
  p1Character   String?
  p2Character   String?
  
  winnerId      String?
  
  createdAt     DateTime  @default(now())
  
  match         Match     @relation(fields: [matchId], references: [id], onDelete: Cascade)
}

model PointHistory {
  id            String    @id @default(cuid())
  userId        String
  tournamentId  String? 
  
  pointsChange  Int       // +100, -20, etc.
  reason        String    // "Tournament: 1st place", "Matchmaking win"
  
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id])
}

model Stage {
  id            String    @id @default(cuid())
  name          String    @unique
  imageUrl      String?
  type          String    // "starter" | "counterpick"
  isLegal       Boolean   @default(true)
}
```

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (configurado con las variables de Brodev Lab)
- **Shadcn/ui** para componentes base
- **Framer Motion** para animaciones
- **Socket.io Client** para real-time
- **React Query (TanStack Query)** para data fetching
- **Zustand** para state management

### Backend
- **Next.js API Routes**
- **PostgreSQL**
- **Prisma ORM**
- **Socket.io** (real-time updates)
- **NextAuth.js v5** (autenticación)
- **Bcrypt** (hash de contraseñas)
- **Zod** (validación de datos)

### Infraestructura
- **Vercel** para deploy
- **Neon o Supabase** para PostgreSQL
- **Cloudinary** para imágenes de stages

---

## 📱 RUTAS DE LA APLICACIÓN

```
Públicas:
/ ................................  Home + próximos torneos + Hero section con estilos Brodev
/login ...........................  Login con gradient card
/register ........................  Registro con gradient card
/ranking .........................  Tabla de clasificación
/tournaments .....................  Lista de torneos con cards

Protegidas (requiere login):
/profile .........................  Perfil personal
/profile/[id] ....................  Perfil de otro jugador
/tournaments/[id] ................  Detalle de torneo + bracket interactivo
/match/[id] ......................  Vista de match (stage/char select)
/matchmaking .....................  Cola de búsqueda

Admin only:
/admin/tournaments/create ........  Crear torneo
/admin/tournaments/[id]/edit .....  Editar torneo
/admin/stages ....................  Gestionar stages
/admin/users .....................  Gestionar usuarios
/admin/dashboard .................  Panel de control
```

---

## 🎯 PRIORIDADES DE DESARROLLO (MVP)

### ✅ FASE 1 - Core (MVP esencial)
- [ ] Configuración inicial: Next.js 14 + TypeScript + Tailwind + Prisma
- [ ] Implementar estilos de Brodev Lab (copiar variables CSS)
- [ ] Sistema de autenticación (NextAuth.js con credenciales)
- [ ] Roles (admin/player)
- [ ] CRUD de torneos (solo admins)
- [ ] Sistema de inscripción a torneos
- [ ] Check-in system
- [ ] Bracket básico (single elimination) - puedes usar librería react-tournament-bracket
- [ ] Tabla de ranking simple con paginación
- [ ] Diseño responsive con estilos de Brodev Lab
- [ ] Navbar con logo de Brodev Lab

### ✅ FASE 2 - Sistema de Match (Core gameplay)
- [ ] Modal de stage banning/picking por turnos con Socket.io
- [ ] Character selection interactivo
- [ ] Reporte de resultados con modal de confirmación
- [ ] Actualización automática de puntos
- [ ] Notificaciones en tiempo real (Socket.io)
- [ ] Sistema de resolución de conflictos (admin panel)
- [ ] Visualización de games dentro de un match

### ✅ FASE 3 - Features Avanzadas
- [ ] Double elimination brackets
- [ ] Best-of configurable por ronda en la creación de torneos
- [ ] Matchmaking automático con cola de espera
- [ ] Filtros en ranking (por character, región, período)
- [ ] Historial de puntos con gráficos (Chart.js o Recharts)
- [ ] Estadísticas de usuario (winrate, character más usado)

### 🔮 FASE 4 - Integración start.gg (Post-MVP)
- [ ] OAuth con start.gg
- [ ] Importación automática de resultados
- [ ] Sincronización de brackets

---

## 🎨 COMPONENTES UI CRÍTICOS

### 1. Stage Select Modal (CRÍTICO)

Este es el componente más complejo. Debe:
- Mostrar claramente de quién es el turno
- Permitir solo al jugador del turno hacer acciones
- Actualizar en tiempo real para ambos jugadores
- Mostrar stages baneados con overlay rojo y ❌
- Mostrar stage seleccionado con borde verde

```tsx
// Pseudocódigo del flow
const StageSelectModal = ({ matchId, player1, player2, currentTurn, phase }) => {
  const [bannedStages, setBannedStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  
  const handleStageBan = (stageId) => {
    if (currentTurn !== currentUserId) return; // No es mi turno
    
    socket.emit('ban-stage', { matchId, stageId });
    // El servidor validará y emitirá actualización a ambos jugadores
  };
  
  const handleStagePick = (stageId) => {
    if (currentTurn !== currentUserId) return;
    
    socket.emit('pick-stage', { matchId, stageId });
    // Transición a phase: "char_select"
  };
  
  useEffect(() => {
    socket.on('stage-banned', (data) => {
      setBannedStages([...bannedStages, data.stageId]);
    });
    
    socket.on('stage-picked', (data) => {
      setSelectedStage(data.stageId);
      setPhase('char_select');
    });
    
    return () => {
      socket.off('stage-banned');
      socket.off('stage-picked');
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1A0B2E] rounded-2xl p-8 max-w-5xl w-full border border-purple-500/20">
        <h2 className="text-3xl font-bold font-['Poppins'] mb-6">
          {phase === 'ban' ? 'Banea Stages' : 'Selecciona Stage'}
        </h2>
        
        {/* Indicador de turno */}
        <div className="mb-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <p className="text-lg">
            Turno de: <span className="font-bold text-purple-400">
              {currentTurn === player1.id ? player1.gamertag : player2.gamertag}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            {phase === 'ban' ? `Banea ${bansRemaining} stage(s)` : 'Elige el stage para jugar'}
          </p>
        </div>
        
        {/* Grid de stages */}
        <div className="grid grid-cols-3 gap-4">
          {stages.map(stage => (
            <button
              key={stage.id}
              disabled={bannedStages.includes(stage.id) || currentTurn !== currentUserId}
              onClick={() => phase === 'ban' ? handleStageBan(stage.id) : handleStagePick(stage.id)}
              className={`
                relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                ${bannedStages.includes(stage.id) ? 'opacity-30 cursor-not-allowed border-red-500' : 'hover:border-purple-500'}
                ${selectedStage === stage.id ? 'border-green-500 ring-4 ring-green-500/50' : 'border-purple-500/20'}
              `}
            >
              <img src={stage.imageUrl} alt={stage.name} className="w-full h-full object-cover" />
              {bannedStages.includes(stage.id) && (
                <div className="absolute inset-0 bg-red-500/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-4xl">❌</span>
                </div>
              )}
              <p className="absolute bottom-0 w-full bg-black/80 p-2 text-sm font-semibold">
                {stage.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 2. Character Select Modal

Similar al stage select, pero con roster de Smash Ultimate:

```tsx
const CharacterSelectModal = ({ matchId, isFirstPick, opponentCharacter }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1A0B2E] rounded-2xl p-8 max-w-6xl w-full border border-purple-500/20">
        <h2 className="text-3xl font-bold font-['Poppins'] mb-6">
          Selecciona tu personaje
        </h2>
        
        {!isFirstPick && opponentCharacter && (
          <div className="mb-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <p className="text-sm text-gray-400">Tu oponente seleccionó:</p>
            <p className="text-xl font-bold text-purple-400">{opponentCharacter}</p>
          </div>
        )}
        
        {/* Grid de personajes */}
        <div className="grid grid-cols-8 gap-3">
          {characters.map(char => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                hover:scale-105 hover:border-purple-500
                ${selectedChar?.id === char.id ? 'border-purple-500 ring-4 ring-purple-500/50' : 'border-purple-500/20'}
              `}
            >
              <img src={char.iconUrl} alt={char.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        
        <button
          disabled={!selectedChar}
          onClick={() => handleCharacterConfirm(selectedChar)}
          className="mt-6 w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar Personaje
        </button>
      </div>
    </div>
  );
};
```

### 3. Bracket Visualization

Usa `react-tournament-bracket` o crea uno custom. Debe:
- Actualizar en tiempo real con Socket.io
- Mostrar scores de cada match
- Ser clickeable para ver detalles
- Adaptarse a mobile (scroll horizontal)

```tsx
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets';

const TournamentBracket = ({ matches }) => {
  return (
    <div className="w-full overflow-x-auto">
      <Bracket
        rounds={rounds}
        renderSeedComponent={(props) => (
          <Seed {...props}>
            <SeedItem>
              <div className="bg-[#1A0B2E] border border-purple-500/20 rounded-lg p-3">
                <SeedTeam className="flex justify-between items-center">
                  <span className="font-semibold">{props.seed.teams[0]?.name}</span>
                  <span className="text-purple-400 font-bold">{props.seed.teams[0]?.score}</span>
                </SeedTeam>
                <SeedTeam className="flex justify-between items-center mt-2">
                  <span className="font-semibold">{props.seed.teams[1]?.name}</span>
                  <span className="text-purple-400 font-bold">{props.seed.teams[1]?.score}</span>
                </SeedTeam>
              </div>
            </SeedItem>
          </Seed>
        )}
      />
    </div>
  );
};
```

---

## 🔌 SOCKET.IO EVENTS

### Cliente emite (client -> server):
- `join-match`: Unirse a room del match
- `check-in`: Marcar presencia
- `ban-stage`: Banear un stage
- `pick-stage`: Seleccionar stage
- `select-character`: Elegir personaje
- `report-result`: Reportar resultado del match
- `confirm-result`: Confirmar resultado reportado

### Servidor emite (server -> client):
- `match-updated`: Estado del match cambió
- `stage-banned`: Un stage fue baneado
- `stage-picked`: Stage seleccionado
- `character-selected`: Personaje seleccionado
- `turn-changed`: Cambio de turno
- `result-reported`: Resultado reportado, esperando confirmación
- `match-finished`: Match terminado y confirmado
- `bracket-updated`: Bracket actualizado

### Implementación básica del servidor Socket.io:

```typescript
// lib/socket-server.ts
import { Server } from 'socket.io';
import { prisma } from './prisma';

export function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-match', async (matchId) => {
      socket.join(`match-${matchId}`);
      console.log(`Socket ${socket.id} joined match-${matchId}`);
    });
    
    socket.on('ban-stage', async ({ matchId, stageId, userId }) => {
      // Validar turno
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (match.currentTurn !== userId) {
        socket.emit('error', { message: 'No es tu turno' });
        return;
      }
      
      // Actualizar match
      const currentGame = await prisma.game.findFirst({
        where: { matchId, gameNumber: match.currentGame }
      });
      
      const bannedStages = [...(currentGame.bannedStages as string[]), stageId];
      
      await prisma.game.update({
        where: { id: currentGame.id },
        data: { bannedStages }
      });
      
      // Cambiar turno
      const nextTurn = match.currentTurn === match.player1Id ? match.player2Id : match.player1Id;
      await prisma.match.update({
        where: { id: matchId },
        data: { currentTurn: nextTurn }
      });
      
      // Emitir a todos en el room
      io.to(`match-${matchId}`).emit('stage-banned', { stageId, nextTurn });
    });
    
    socket.on('pick-stage', async ({ matchId, stageId, userId }) => {
      // Similar lógica de validación
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      
      await prisma.game.update({
        where: { 
          matchId_gameNumber: {
            matchId,
            gameNumber: match.currentGame
          }
        },
        data: { 
          selectedStage: stageId,
          pickedBy: userId
        }
      });
      
      await prisma.match.update({
        where: { id: matchId },
        data: { currentPhase: 'char_select' }
      });
      
      io.to(`match-${matchId}`).emit('stage-picked', { stageId });
      io.to(`match-${matchId}`).emit('match-updated', { currentPhase: 'char_select' });
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  return io;
}
```

---

## 🔒 CONSIDERACIONES DE SEGURIDAD

### Autenticación:
- NextAuth.js v5 con CredentialsProvider
- Contraseñas hasheadas con bcrypt (12+ rounds)
- JWT con expiración de 7 días
- Rate limiting en login (5 intentos/15min) usando `@upstash/ratelimit`

### Autorización:
- Middleware para verificar rol de admin en rutas `/admin/*`
- Server Actions de Next.js 14 con validación de sesión
- No exponer endpoints de admin sin verificación

### Validación:
- Zod schemas para todos los inputs
- Validación en cliente Y servidor
- Sanitización de datos con DOMPurify si permites HTML

### Socket.io:
- Autenticación de sockets con JWT en handshake
- Validar en servidor que el usuario tiene permisos para emitir eventos
- Rate limiting en eventos críticos

---

## 📊 SEED DATA PARA TESTING

Crear archivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smashrank.com' },
    update: {},
    create: {
      email: 'admin@smashrank.com',
      password: adminPassword,
      gamertag: 'Admin',
      role: 'admin',
      points: 0,
      mainCharacter: ['Mario']
    }
  });
  
  // Test players
  const player1Password = await bcrypt.hash('player123', 12);
  const player1 = await prisma.user.create({
    data: {
      email: 'player1@test.com',
      password: player1Password,
      gamertag: 'Paco',
      role: 'player',
      points: 1250,
      mainCharacter: ['Fox', 'Falco']
    }
  });
  
  const player2 = await prisma.user.create({
    data: {
      email: 'player2@test.com',
      password: player1Password,
      gamertag: 'Doku',
      role: 'player',
      points: 1180,
      mainCharacter: ['Mario']
    }
  });
  
  // Stages
  const stages = [
    { name: 'Battlefield', type: 'starter', imageUrl: '/stages/battlefield.jpg', isLegal: true },
    { name: 'Small Battlefield', type: 'starter', imageUrl: '/stages/small-battlefield.jpg', isLegal: true },
    { name: 'Final Destination', type: 'starter', imageUrl: '/stages/fd.jpg', isLegal: true },
    { name: 'Pokémon Stadium 2', type: 'starter', imageUrl: '/stages/ps2.jpg', isLegal: true },
    { name: 'Smashville', type: 'counterpick', imageUrl: '/stages/smashville.jpg', isLegal: true },
    { name: 'Town & City', type: 'counterpick', imageUrl: '/stages/town-city.jpg', isLegal: true },
    { name: 'Hollow Bastion', type: 'counterpick', imageUrl: '/stages/hollow-bastion.jpg', isLegal: true },
    { name: 'Northern Cave', type: 'counterpick', imageUrl: '/stages/northern-cave.jpg', isLegal: true },
  ];
  
  for (const stage of stages) {
    await prisma.stage.upsert({
      where: { name: stage.name },
      update: {},
      create: stage
    });
  }
  
  // Test tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'TRUE COMBO WEEKLIES #45',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
      checkInTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 - 15 * 60 * 1000), // 15 min antes
      format: 'double',
      maxPlayers: 32,
      status: 'upcoming',
      starterStages: ['Battlefield', 'Small Battlefield', 'Final Destination', 'Pokémon Stadium 2'],
      cpStages: ['Smashville', 'Town & City', 'Hollow Bastion'],
      bannedStages: [],
      roundConfig: {
        'WR1': 3,
        'WQF': 3,
        'WSF': 3,
        'WF': 5,
        'LR1': 3,
        'LQF': 3,
        'LSF': 3,
        'LF': 5,
        'GF': 5
      },
      pointsConfig: {
        '1': 100,
        '2': 75,
        '3': 50,
        '4': 35,
        '5': 25,
        '7': 15,
        '9': 10
      },
      createdById: admin.id
    }
  });
  
  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agregar a `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

---

## 📝 VARIABLES DE ENTORNO

Crear `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smashrank"

# NextAuth
NEXTAUTH_SECRET="genera-un-secret-random-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Socket.io (si usas servidor separado)
SOCKET_SERVER_URL="ws://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

# Start.gg API (Fase 4 - Opcional)
STARTGG_API_KEY="tu-api-key-aqui"

# Cloudinary (para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## 🚀 COMANDOS PARA INICIAR EL PROYECTO

```bash
# Crear proyecto Next.js
npx create-next-app@latest smashrank --typescript --tailwind --app --src-dir

cd smashrank

# Instalar dependencias principales
npm install prisma @prisma/client
npm install next-auth bcrypt zod
npm install socket.io socket.io-client
npm install @tanstack/react-query zustand
npm install framer-motion
npm install react-hot-toast

# Instalar dependencias de desarrollo
npm install -D @types/bcrypt
npm install -D ts-node

# Inicializar Prisma
npx prisma init

# Copiar el schema.prisma del prompt anterior

# Crear migración inicial
npx prisma migrate dev --name init

# Seed data
npx prisma db seed

# Ejecutar en desarrollo
npm run dev
```

---

## 📦 ESTRUCTURA DE ARCHIVOS RECOMENDADA

```
smashrank/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── logo.svg                    # Logo de Brodev Lab
│   ├── favicon.svg
│   └── stages/                     # Imágenes de stages
│       ├── battlefield.jpg
│       ├── fd.jpg
│       └── ...
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (protected)/
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── tournaments/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── match/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── matchmaking/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── tournaments/
│   │   │   │   └── create/
│   │   │   │       └── page.tsx
│   │   │   └── stages/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── tournaments/
│   │   │   │   └── route.ts
│   │   │   └── socket/
│   │   │       └── route.ts
│   │   ├── ranking/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Home
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # Shadcn components
│   │   ├── Navbar.tsx
│   │   ├── TournamentCard.tsx
│   │   ├── Bracket.tsx
│   │   ├── StageSelectModal.tsx
│   │   ├── CharacterSelectModal.tsx
│   │   └── RankingTable.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── socket-server.ts
│   │   ├── socket-client.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useSocket.ts
│   │   └── useAuth.ts
│   ├── store/
│   │   └── matchStore.ts           # Zustand store
│   └── types/
│       └── index.ts
├── .env
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 CONFIGURACIÓN DE TAILWIND CON ESTILOS BRODEV LAB

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        secondary: '#EC4899',
        accent: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        bg: {
          dark: '#0A0118',
          darker: '#050010',
          card: '#1A0B2E',
          cardHover: '#2D1B4E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 2px 8px rgba(124, 58, 237, 0.1)',
        'glow-md': '0 4px 20px rgba(124, 58, 237, 0.15)',
        'glow-lg': '0 8px 40px rgba(124, 58, 237, 0.25)',
        'glow-xl': '0 0 60px rgba(124, 58, 237, 0.4)',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-card': 'floatCard 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(100px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-50px, 100px) scale(0.9)' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
          '50%': { transform: 'translateY(-20px) rotateY(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

```css
/* src/app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply box-border;
  }
  
  html {
    @apply scroll-smooth overflow-x-hidden;
  }
  
  body {
    @apply bg-bg-dark text-white font-sans leading-relaxed overflow-x-hidden;
  }
}

@layer components {
  .gradient-text {
    @apply bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent;
  }
  
  .btn-primary {
    @apply bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold transition-all duration-[0.4s] hover:shadow-glow-lg hover:-translate-y-0.5;
  }
  
  .btn-secondary {
    @apply bg-transparent text-white border-2 border-primary/50 px-8 py-3 rounded-xl font-semibold transition-all duration-[0.4s] hover:border-primary hover:bg-primary/10;
  }
  
  .card {
    @apply bg-bg-card border border-primary/20 rounded-2xl p-6 transition-all duration-[0.4s] hover:-translate-y-2 hover:shadow-glow-xl hover:border-primary;
  }
  
  .input {
    @apply bg-bg-card border border-primary/30 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all;
  }
}

@layer utilities {
  .text-shadow-glow {
    text-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  }
}
```

---

## ✅ CHECKLIST DE CALIDAD PRE-LAUNCH

Antes de considerar el MVP completo:

- [ ] Diseño 100% fiel a estilos de Brodev Lab (colores, tipografías, sombras, transiciones)
- [ ] Logo de Brodev Lab visible en navbar
- [ ] Responsive perfecto en móvil (360px), tablet (768px) y desktop (1920px)
- [ ] Carga rápida: Lighthouse score > 90
- [ ] Sistema de match funciona sin bugs (stage/char select con turnos)
- [ ] Confirmación de resultados funciona correctamente
- [ ] Brackets se actualizan en tiempo real (Socket.io)
- [ ] Ranking se actualiza correctamente con puntos
- [ ] No hay errores en consola del navegador
- [ ] No hay memory leaks en Socket.io (disconnect limpia listeners)
- [ ] Migraciones de Prisma funcionan sin errores
- [ ] Seed data carga correctamente
- [ ] Deploy exitoso en Vercel
- [ ] Variables de entorno configuradas en producción
- [ ] Rate limiting funciona en login
- [ ] Admin panel solo accesible por admins
- [ ] Toast notifications funcionan (éxito/error)
- [ ] Loading states en todas las acciones asíncronas

---

## 🎯 OBJETIVO FINAL

**SmashRank By Brodev Lab** debe ser:

✅ **Visualmente idéntica** a la estética de Brodev Lab (dark purple theme, gradientes, glows)  
✅ **Funcionalmente completa** para organizar torneos sin fricciones  
✅ **Intuitiva** para jugadores que nunca usaron la plataforma  
✅ **Confiable** en el proceso de stage/character selection con turnos  
✅ **Justa** en el reporte y confirmación de resultados  
✅ **Escalable** para agregar más features (start.gg, más juegos, regiones)

El usuario debe sentir que está usando una **plataforma profesional y pulida**, no un MVP básico.

---

## 🚀 ¿LISTO PARA EMPEZAR EL DESARROLLO?

**Copia este prompt completo** y pégalo en tu herramienta de desarrollo AI favorita:
- **Cursor** con Composer
- **GitHub Copilot Workspace**
- **v0.dev** (Vercel)
- **Bolt.new** (StackBlitz)
- **Claude** con Projects
- O cualquier otra herramienta de desarrollo AI

Si necesitas ayuda con alguna parte específica durante el desarrollo, ¡avísame! 💜

---

**NOTA FINAL:** Este prompt incluye TODO lo necesario para desarrollar SmashRank desde cero hasta producción. Cada sección está diseñada para ser auto-contenida y completa. ¡Adelante! 🎮
