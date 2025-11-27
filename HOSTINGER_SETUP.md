# 🚀 Configuración de Hostinger para SmashRank

## 📋 Información de tu Base de Datos Hostinger

**Base de datos MySQL creada:**
- **Nombre de la BD**: `u851317150_smashrank`
- **Usuario MySQL**: `u851317150_smashrank`
- **Contraseña**: `Lg030920.`
- **Host local**: `127.0.0.1` (solo desde Hostinger)
- **Puerto**: `3306`

**URL del sitio:** https://yellow-spider-549528.hostingersite.com

---

## ⚠️ IMPORTANTE: Conexión Remota

La URL `127.0.0.1` solo funciona **dentro del servidor de Hostinger**. Para trabajar desde tu computadora local, necesitas:

### Opción 1: Obtener Host Remoto (Recomendado)

1. En el panel de Hostinger, ve a **Bases de datos > MySQL remoto**
2. **Habilita el acceso remoto** desde tu IP
3. Busca el **hostname remoto** (algo como: `srv1234.hostinger.com`)
4. Actualiza `.env`:

```env
# Para desarrollo local (conexión remota)
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@srv1234.hostinger.com:3306/u851317150_smashrank"
```

### Opción 2: SSH Tunnel (Alternativa)

Si Hostinger no permite conexión remota directa, usa túnel SSH:

```bash
ssh -L 3306:127.0.0.1:3306 usuario@yellow-spider-549528.hostingersite.com
```

Luego usa:
```env
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
```

### Opción 3: Trabajar Solo en Producción

Si no puedes conectarte remotamente, trabaja directamente en Hostinger:

1. Sube el proyecto a Hostinger via FTP/Git
2. Conéctate por SSH
3. Ejecuta las migraciones desde el servidor

---

## 🔧 Pasos para Migrar

Una vez que tengas acceso a la base de datos:

### 1. Verificar Conexión
```bash
npx prisma db pull
```

Si conecta correctamente, verás "Introspecting database..."

### 2. Crear Tablas (Migración)
```bash
npx prisma migrate dev --name init
```

Esto creará todas las tablas necesarias.

### 3. Poblar Datos de Prueba
```bash
npx prisma db seed
```

Esto creará:
- Admin: admin@smashrank.com / admin123
- Jugadores de prueba
- 8 Stages
- 1 Torneo de ejemplo

### 4. Verificar con Prisma Studio
```bash
npx prisma studio
```

Abre una interfaz visual en http://localhost:5555

---

## 🌐 Configuración de Producción en Hostinger

### Archivo `.env` para Producción
```env
# Base de datos (usar 127.0.0.1 cuando está en Hostinger)
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"

# NextAuth (URL de producción)
NEXTAUTH_SECRET="Oyxj8smFORW3k0tFnYkbQV9a4Gcy3vExfJyCL+GyDuU="
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"

NODE_ENV="production"
```

### Deploy en Hostinger

#### Via Git (Recomendado)
```bash
# 1. Inicializa Git si no lo has hecho
git init
git add .
git commit -m "Initial commit"

# 2. Conecta con GitHub
git remote add origin https://github.com/Gabrielb-Webdev/SmashRank.git
git push -u origin main

# 3. En Hostinger, conecta el repositorio
# Ve a: Git > Conectar repositorio > Selecciona GitHub
```

#### Via FTP
1. Compila el proyecto:
   ```bash
   npm run build
   ```
2. Sube estos archivos a Hostinger:
   - `/.next`
   - `/prisma`
   - `/public`
   - `/node_modules` (o ejecuta `npm install` en Hostinger)
   - `package.json`
   - `.env` (con configuración de producción)

3. En el panel de Hostinger:
   - Ve a **Alojamiento > Configuración**
   - Establece el **comando de inicio**: `npm start`
   - Puerto: `3000`

---

## 🔍 Verificar Acceso Remoto a MySQL

Para saber si puedes conectarte remotamente:

### En el panel de Hostinger:
1. Ve a **Bases de datos**
2. Busca **"MySQL remoto"** o **"Remote MySQL"**
3. Si está disponible:
   - Agrega tu IP pública
   - Anota el hostname remoto
4. Si NO está disponible:
   - Usa la Opción 2 (SSH Tunnel) o
   - Ejecuta todo desde el servidor

### Probar conexión:
```bash
# Con mysql client
mysql -h srv1234.hostinger.com -P 3306 -u u851317150_smashrank -p u851317150_smashrank

# Con Prisma
npx prisma db push
```

---

## 📝 Próximos Pasos

1. ✅ Schema actualizado a MySQL
2. ✅ `.env` configurado con credenciales
3. ⏳ **Obtener hostname remoto de Hostinger**
4. ⏳ Habilitar acceso remoto a MySQL
5. ⏳ Ejecutar migraciones: `npx prisma migrate dev`
6. ⏳ Ejecutar seed: `npx prisma db seed`
7. ⏳ Deploy a Hostinger

---

## 🆘 Soporte

Si tienes problemas:
- Revisa los logs en Hostinger: **Alojamiento > Logs**
- Verifica variables de entorno en el panel
- Asegúrate que Node.js esté habilitado en tu plan

**Hostinger Docs**: https://www.hostinger.com/tutorials/

---

**Configurado para:** https://yellow-spider-549528.hostingersite.com
