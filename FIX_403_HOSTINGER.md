# 🚨 SOLUCIÓN ERROR 403 FORBIDDEN EN HOSTINGER

## El problema
Error 403 Forbidden indica que Hostinger no está configurado correctamente para servir la aplicación Node.js.

## Solución paso a paso:

### 1️⃣ Configurar Node.js en Hostinger Panel

1. Ve al **Panel de Hostinger**
2. Busca **"Setup Node.js"** o **"Node.js"** en el menú lateral
3. Click en **"CREATE APPLICATION"**
4. Configura:
   ```
   Application root: /public_html (o /domains/yellow-spider-549528.hostingersite.com/public_html)
   Application URL: https://yellow-spider-549528.hostingersite.com
   Application startup file: server.js
   Node.js version: 18.x o superior
   ```

### 2️⃣ Crear archivo server.js en la raíz

El proyecto Next.js necesita un servidor personalizado. Crea `server.js`:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

### 3️⃣ Actualizar package.json

Asegúrate que el script `start` use el server.js:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node server.js",
    "lint": "next lint"
  }
}
```

### 4️⃣ Ejecutar deploy via SSH

Conéctate por SSH a Hostinger y ejecuta:

```bash
# Ir al directorio de la aplicación
cd domains/yellow-spider-549528.hostingersite.com/public_html

# Instalar dependencias
npm install

# Generar Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Build
npm run build

# Reiniciar aplicación en Node.js panel de Hostinger
# O si tienes PM2:
pm2 restart all
```

### 5️⃣ Verificar en Panel de Hostinger

1. Ve a **"Setup Node.js"**
2. Asegúrate que la aplicación esté **"RUNNING"** (verde)
3. Si está detenida, click en **"Restart"**

### 6️⃣ Revisar logs

En el panel de Node.js de Hostinger, revisa los logs para ver si hay errores.

## ⚠️ Errores comunes:

### Error: "Cannot find module 'next'"
**Solución:** Ejecuta `npm install` en SSH

### Error: "EADDRINUSE"
**Solución:** El puerto está ocupado, usa `pm2 delete all` y reinicia

### Error: "Database connection failed"
**Solución:** Verifica que `DATABASE_URL` use `127.0.0.1` (no mysql.hostinger.com)

### Error: "NEXTAUTH_SECRET is not set"
**Solución:** Agrega las variables de entorno en el panel de Hostinger

## 📝 Variables de entorno en Hostinger:

Ve a **Advanced → Environment Variables** y agrega:

```
DATABASE_URL=mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank
NEXTAUTH_SECRET=(genera con: openssl rand -base64 32)
NEXTAUTH_URL=https://yellow-spider-549528.hostingersite.com
NODE_ENV=production
```

## 🔄 Después de cada push a GitHub:

Hostinger debería hacer deploy automático, pero si no:

```bash
# SSH a Hostinger
ssh u851317150@yellow-spider-549528.hostingersite.com

# Pull cambios
git pull origin main

# Reinstalar
npm install

# Rebuild
npm run build

# Reiniciar desde panel de Node.js
```

---

**Si el error persiste, envíame un screenshot de:**
1. Panel de Node.js de Hostinger (donde se ve el estado de la app)
2. Los logs del error en Hostinger
3. La configuración de variables de entorno
