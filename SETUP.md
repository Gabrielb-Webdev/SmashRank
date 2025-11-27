# 🚀 Guía de Configuración de SmashRank

## ✅ Estado Actual

El proyecto ya tiene:
- ✅ Dependencias instaladas
- ✅ Prisma Client generado
- ✅ Servidor de desarrollo corriendo en http://localhost:3000
- ✅ Navbar funcional con logo Brodev Lab
- ✅ Páginas de Login y Register creadas
- ✅ NextAuth.js configurado
- ✅ Middleware de protección de rutas
- ✅ API de registro de usuarios

## 📋 Próximos Pasos

### 1. Configurar Base de Datos PostgreSQL

Tienes 3 opciones:

#### Opción A: Base de Datos Local (PostgreSQL instalado localmente)
```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/smashrank"
```

#### Opción B: Neon (Recomendado - Gratis)
1. Regístrate en https://neon.tech
2. Crea un nuevo proyecto
3. Copia la connection string
4. Actualiza `.env`:
```env
DATABASE_URL="postgresql://usuario:password@host.neon.tech/smashrank?sslmode=require"
```

#### Opción C: Supabase (Alternativa - Gratis)
1. Regístrate en https://supabase.com
2. Crea un nuevo proyecto
3. Ve a Project Settings > Database
4. Copia la "Connection string" (URI)
5. Actualiza `.env`:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### 2. Migrar la Base de Datos

Una vez configurado el `DATABASE_URL` en `.env`, ejecuta:

```bash
# Crear las tablas en la base de datos
npx prisma migrate dev --name init

# Poblar con datos de prueba (admin, jugadores, stages, torneo)
npx prisma db seed
```

### 3. Generar NEXTAUTH_SECRET

Ejecuta este comando para generar un secreto seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia el resultado y actualiza `.env`:
```env
NEXTAUTH_SECRET="tu_secreto_generado_aqui"
```

### 4. Verificar la Aplicación

Con el servidor corriendo (`npm run dev`):

1. **Página principal**: http://localhost:3000
2. **Login**: http://localhost:3000/login
3. **Register**: http://localhost:3000/register

### 5. Cuentas de Prueba (después de ejecutar seed)

```
Admin:
Email: admin@smashrank.com
Password: admin123

Jugador 1:
Email: player1@test.com
Password: player123
Nombre: Paco
Puntos: 1250

Jugador 2:
Email: player2@test.com
Password: player123
Nombre: Doku
Puntos: 1180
```

## 🎨 Características Implementadas

### Diseño Brodev Lab
- ✅ Colores: Purple (#7C3AED), Pink (#EC4899), Dark (#0A0118)
- ✅ Logo Brodev Lab (SVG)
- ✅ Fuentes: Poppins (títulos) + Inter (texto)
- ✅ Efectos: Glow shadows, gradient text, animations

### Autenticación
- ✅ NextAuth.js v5 configurado
- ✅ Login con email/password
- ✅ Registro de usuarios
- ✅ Hash de passwords con bcrypt (12 rounds)
- ✅ Roles: ADMIN y PLAYER
- ✅ Middleware para rutas protegidas

### Base de Datos
- ✅ Prisma ORM configurado
- ✅ Schema completo (User, Tournament, Match, Game, Stage, etc.)
- ✅ Relaciones many-to-many (User-Tournament)
- ✅ Cascading deletes configurados
- ✅ Seed data listo

### Navegación
- ✅ Navbar responsive con logo
- ✅ Links: Inicio, Torneos, Ranking, Matchmaking
- ✅ Menú móvil (hamburger)
- ✅ Botones Login/Register

### Páginas
- ✅ Homepage con hero y features
- ✅ Login page (con cuentas de prueba)
- ✅ Register page (validaciones)
- ✅ Tournaments page (placeholder)
- ✅ Ranking page (placeholder)
- ✅ Matchmaking page (placeholder)

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Prisma
npx prisma studio        # Abrir interfaz visual de la BD
npx prisma migrate dev   # Crear nueva migración
npx prisma db seed       # Ejecutar seed
npx prisma generate      # Regenerar cliente
npx prisma db push       # Push schema sin migración (dev)

# Build
npm run build            # Compilar para producción
npm start                # Iniciar en producción

# Lint
npm run lint             # Verificar código
```

## 📂 Estructura del Proyecto

```
SmashRank/
├── prisma/
│   ├── schema.prisma    # Schema de BD (User, Tournament, Match, etc.)
│   └── seed.ts          # Datos de prueba
├── public/
│   ├── logo.svg         # Logo Brodev Lab
│   └── favicon.svg      # Favicon
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts
│   │   │       └── register/route.ts
│   │   ├── tournaments/page.tsx
│   │   ├── ranking/page.tsx
│   │   ├── matchmaking/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── auth.ts      # NextAuth config
│   │   └── prisma.ts    # Prisma client
│   ├── types/
│   │   └── next-auth.d.ts
│   └── middleware.ts
├── .env                 # Variables de entorno (DATABASE_URL, NEXTAUTH_SECRET)
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Siguiente Fase: CRUD de Torneos

Después de configurar la base de datos, el siguiente paso es implementar:

1. **Página de creación de torneos** (solo admin)
2. **Lista de torneos activos**
3. **Sistema de inscripción**
4. **Vista de brackets (visualización)**
5. **Socket.io para actualizaciones en tiempo real**

## 📚 Referencias

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Desarrollado con 💜 por Brodev Lab**
