# ✅ SmashRank - Configurado para Hostinger

## 🎉 Estado Actual

✅ **Proyecto completamente configurado para Hostinger MySQL**

### Archivos Actualizados:
- ✅ `prisma/schema.prisma` - Cambiado a MySQL
- ✅ `prisma/seed.ts` - Adaptado para MySQL (sin arrays)
- ✅ `.env` - Configurado con credenciales de Hostinger
- ✅ `.env.production` - Variables para producción
- ✅ `.env.local` - Variables para desarrollo local

### Credenciales de Base de Datos:
```
Base de datos: u851317150_smashrank
Usuario: u851317150_smashrank
Contraseña: Lg030920.
Host (en Hostinger): 127.0.0.1
Puerto: 3306
```

### URL del Sitio:
**Producción:** https://yellow-spider-549528.hostingersite.com

---

## ⚠️ ACCIÓN REQUERIDA: Obtener Hostname Remoto

**Problema:** El host `127.0.0.1` solo funciona **dentro del servidor de Hostinger**.

### Cómo Obtener el Hostname Remoto:

#### Opción 1: Panel de Hostinger (MySQL Remoto)
1. Inicia sesión en https://hpanel.hostinger.com
2. Ve a **"Bases de datos"** en el menú lateral
3. Busca la sección **"MySQL remoto"** o **"Remote MySQL"**
4. Habilita el acceso remoto
5. Agrega tu IP pública (busca "cual es mi ip" en Google)
6. **Anota el hostname remoto** - será algo como:
   - `srv1234.hostinger.com` o
   - `mysql.hostinger.com` o
   - Similar al hostname de tu sitio

#### Opción 2: Soporte de Hostinger
Si no encuentras la opción de MySQL remoto:
1. Contacta el soporte de Hostinger
2. Pregunta: **"¿Cuál es el hostname remoto para conectarme a mi base de datos MySQL desde mi PC local?"**
3. Menciona que la base de datos es: `u851317150_smashrank`

#### Opción 3: Usar phpMyAdmin
1. Ve a Hostinger > **Bases de datos** > **phpMyAdmin**
2. En la barra superior, verás el servidor conectado (puede mostrar el hostname)

### Una vez que tengas el Hostname Remoto:

Actualiza `.env` línea 2:
```env
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@TU_HOSTNAME_REMOTO:3306/u851317150_smashrank"
```

Ejemplo:
```env
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@srv1234.hostinger.com:3306/u851317150_smashrank"
```

---

## 🚀 Pasos Siguientes (Después de Obtener Hostname)

### 1. Ejecutar Migraciones
```bash
npx prisma migrate deploy
```

O si es la primera vez:
```bash
npx prisma migrate dev --name init
```

### 2. Poblar Datos de Prueba
```bash
npx prisma db seed
```

### 3. Verificar Datos
```bash
npx prisma studio
```

### 4. Deploy a Hostinger

Ver guía completa en: **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

---

## 📚 Documentación Creada

| Archivo | Descripción |
|---------|-------------|
| `HOSTINGER_SETUP.md` | Guía completa de configuración Hostinger |
| `DEPLOY_GUIDE.md` | Pasos detallados para deploy |
| `DATABASE_SETUP.md` | Configuración de base de datos (original, para Neon/Supabase) |
| `PROJECT_STATUS.md` | Estado del proyecto y progreso |
| `.env.production` | Variables de entorno para producción |
| `.env.local` | Variables de entorno para desarrollo |

---

## 🎮 Cuentas de Prueba (Después del Seed)

```
Admin:
Email: admin@smashrank.com
Password: admin123

Jugador 1:
Email: player1@test.com
Password: player123
Gamertag: Paco
Personajes: Fox, Falco

Jugador 2:
Email: player2@test.com
Password: player123
Gamertag: Doku
Personaje: Mario
```

---

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Ver base de datos
npx prisma studio

# Regenerar cliente Prisma
npx prisma generate

# Push schema sin migración
npx prisma db push

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Ejecutar migraciones en producción
npx prisma migrate deploy
```

---

## 📝 Resumen de lo Configurado

### Base de Datos:
- ✅ Schema adaptado a MySQL
- ✅ Campos `mainCharacter` cambiado de array a string con delimitador
- ✅ Todos los JSON mantienen su tipo (MySQL soporta JSON nativo)
- ✅ Relaciones many-to-many configuradas

### Autenticación:
- ✅ NextAuth.js v5 configurado
- ✅ NEXTAUTH_URL apunta a Hostinger
- ✅ NEXTAUTH_SECRET generado

### Estructura:
- ✅ 7 modelos: User, Tournament, Match, Game, Stage, TournamentParticipant, PointHistory
- ✅ Seed con admin, 2 jugadores, 8 stages, 1 torneo

---

## 🆘 ¿Necesitas Ayuda?

### Si no puedes obtener el hostname remoto:

**Alternativa 1: SSH Tunnel**
```bash
ssh -L 3306:127.0.0.1:3306 usuario@yellow-spider-549528.hostingersite.com
```
Luego usa `127.0.0.1` en DATABASE_URL

**Alternativa 2: Ejecutar Migraciones desde Hostinger**
1. Sube el proyecto a Hostinger
2. Conéctate por SSH
3. Ejecuta:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Logs de Error:
Si algo falla, revisa:
- Hostinger > **Alojamiento** > **Logs**
- Terminal local con: `npx prisma db push --help`

---

## 🎯 Siguiente en la Lista

1. **[AHORA]** Obtener hostname remoto de MySQL
2. Actualizar `.env` con hostname
3. Ejecutar migraciones
4. Ejecutar seed
5. Verificar con Prisma Studio
6. Build del proyecto: `npm run build`
7. Deploy a Hostinger (Git o FTP)
8. Configurar variables de entorno en Hostinger
9. Verificar en https://yellow-spider-549528.hostingersite.com
10. Implementar CRUD de torneos

---

**¡Todo está listo para migrar una vez que tengas el hostname remoto!** 🚀

**Base de datos:** u851317150_smashrank  
**Sitio:** https://yellow-spider-549528.hostingersite.com  
**Repo:** https://github.com/Gabrielb-Webdev/SmashRank
