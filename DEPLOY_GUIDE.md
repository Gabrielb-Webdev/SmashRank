# 🚀 Guía Rápida: Deploy SmashRank en Hostinger

**URL de producción:** https://yellow-spider-549528.hostingersite.com

---

## ✅ Ya Configurado

- ✅ Schema de Prisma actualizado a MySQL
- ✅ `.env` configurado con credenciales de Hostinger
- ✅ `.env.production` creado
- ✅ Seed data adaptado a MySQL
- ✅ Cliente Prisma regenerado

---

## 📋 Pasos para Deploy

### 1️⃣ Habilitar Acceso Remoto a MySQL (IMPORTANTE)

En el panel de Hostinger:
1. Ve a **"Bases de datos"** > **"MySQL remoto"**
2. Habilita el acceso remoto
3. Agrega tu IP pública actual
4. **Anota el hostname remoto** (ejemplo: `srv1234.hostinger.com`)
5. Actualiza `.env` con el hostname:
   ```env
   DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@srv1234.hostinger.com:3306/u851317150_smashrank"
   ```

### 2️⃣ Ejecutar Migraciones (Desde tu PC)

```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en Hostinger
npx prisma migrate deploy

# Poblar datos de prueba
npx prisma db seed
```

**Resultado esperado:**
- 7 tablas creadas (User, Tournament, Match, Game, etc.)
- 1 Admin creado
- 2 Jugadores de prueba
- 8 Stages
- 1 Torneo de ejemplo

### 3️⃣ Verificar con Prisma Studio

```bash
npx prisma studio
```

Abre http://localhost:5555 y verifica que los datos estén en la base de datos de Hostinger.

### 4️⃣ Build del Proyecto

```bash
npm run build
```

Esto genera la carpeta `.next` con el código optimizado.

### 5️⃣ Deploy a Hostinger

#### Opción A: Git (Recomendado)

1. **Conecta tu repo en Hostinger:**
   - Panel de Hostinger > **Git** > **Conectar repositorio**
   - Selecciona: `Gabrielb-Webdev/SmashRank`
   - Branch: `main`

2. **Configura variables de entorno:**
   - En Hostinger > **Configuración** > **Variables de entorno**
   - Agrega todas las variables de `.env.production`

3. **Deploy automático:**
   - Hostinger detectará Next.js
   - Ejecutará `npm install` y `npm run build`
   - Iniciará con `npm start`

#### Opción B: FTP Manual

1. **Sube estos archivos via FTP:**
   ```
   /.next/              (carpeta de build)
   /prisma/
   /public/
   /src/
   /node_modules/       (o ejecuta npm install en servidor)
   package.json
   next.config.js
   .env.production      (renombrar a .env)
   ```

2. **En el panel de Hostinger:**
   - Ve a **Alojamiento** > **Configuración avanzada**
   - **Comando de inicio**: `npm start`
   - **Puerto**: `3000`
   - **Node.js version**: `18.x` o superior

### 6️⃣ Verificar Deployment

1. Visita: https://yellow-spider-549528.hostingersite.com
2. Deberías ver la homepage de SmashRank
3. Prueba login con:
   - **Admin**: admin@smashrank.com / admin123
   - **Jugador**: player1@test.com / player123

---

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Ver base de datos
npx prisma studio

# Recrear base de datos (⚠️ elimina datos)
npx prisma migrate reset

# Solo ejecutar migraciones
npx prisma migrate deploy
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Verifica que el acceso remoto esté habilitado
- Confirma que tu IP esté en la lista blanca
- Prueba el hostname remoto

### Error: "P1001: Can't reach database"
- El hostname `127.0.0.1` solo funciona **dentro de Hostinger**
- Usa el hostname remoto para desarrollo local
- O usa SSH tunnel

### Error al hacer deploy
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate que `.env.production` esté en el servidor
- Revisa los logs en Hostinger > Logs

### Página en blanco o 500 error
- Verifica que las migraciones se ejecutaron
- Confirma que `DATABASE_URL` en producción use `127.0.0.1`
- Revisa logs: Hostinger > **Alojamiento** > **Logs**

---

## 📝 Checklist de Deploy

- [ ] Acceso remoto a MySQL habilitado
- [ ] IP actual agregada a lista blanca
- [ ] Hostname remoto obtenido
- [ ] `.env` actualizado con hostname remoto
- [ ] Migraciones ejecutadas: `npx prisma migrate deploy`
- [ ] Seed ejecutado: `npx prisma db seed`
- [ ] Datos verificados en Prisma Studio
- [ ] Proyecto compilado: `npm run build`
- [ ] Variables de entorno configuradas en Hostinger
- [ ] Código subido via Git o FTP
- [ ] `.env.production` renombrado a `.env` en servidor
- [ ] Sitio funcionando en https://yellow-spider-549528.hostingersite.com
- [ ] Login funcionando con credenciales de prueba

---

## 🎯 Próximos Pasos Después del Deploy

1. **Probar todas las páginas:**
   - Homepage ✓
   - Login/Register ✓
   - Tournaments (placeholder)
   - Ranking (placeholder)
   - Matchmaking (placeholder)

2. **Implementar features (Fase 1 - MVP):**
   - CRUD de torneos
   - Sistema de inscripción
   - Tabla de ranking
   - Visualización de brackets

3. **Optimizaciones:**
   - Configurar dominio personalizado
   - Habilitar HTTPS (ya incluido en Hostinger)
   - Configurar caché de Next.js
   - Monitoreo de errores

---

**Base de datos:** u851317150_smashrank @ Hostinger MySQL  
**Sitio:** https://yellow-spider-549528.hostingersite.com  
**Repo:** https://github.com/Gabrielb-Webdev/SmashRank
