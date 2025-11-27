# 🎯 GUÍA DEFINITIVA - DEPLOY EN HOSTINGER

## ✅ TODO ESTÁ LISTO - SOLO COPIA Y PEGA

Tu aplicación ya está en GitHub con todos los archivos necesarios.
NEXTAUTH_SECRET ya generado: `pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY=`

---

## 🚀 PASOS FINALES (5 minutos)

### PASO 1: Conectar por SSH

Abre tu terminal (PowerShell/CMD) y ejecuta:

```bash
ssh u851317150@yellow-spider-549528.hostingersite.com
```

Te pedirá la contraseña de Hostinger. Escríbela (no se verá mientras escribes, es normal).

---

### PASO 2: Ir al directorio de la aplicación

```bash
cd domains/yellow-spider-549528.hostingersite.com/public_html
```

Si da error "No such file or directory", prueba:

```bash
cd public_html
```

---

### PASO 3: Crear archivo .env con variables de entorno

```bash
cat > .env << 'EOF'
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
EOF
```

---

### PASO 4: Ejecutar deploy automático (TODO DE UNA VEZ)

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run build && npm install -g pm2 && pm2 delete smashrank ; pm2 start server.js --name smashrank && pm2 save && pm2 logs smashrank
```

**Este comando hace TODO:**
- ✅ Instala dependencias
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones
- ✅ Inserta datos de prueba (admin, torneos)
- ✅ Compila la aplicación
- ✅ Instala PM2
- ✅ Inicia la aplicación
- ✅ Muestra los logs

**Espera 2-3 minutos** a que termine. Verás muchos textos corriendo.

---

### PASO 5: Verificar que funciona

Deberías ver al final:

```
> SmashRank ready on http://localhost:3000
```

Si ves eso, ¡FUNCIONA! 🎉

Presiona `Ctrl+C` para salir de los logs.

---

### PASO 6: Verificar en el navegador

Abre: **https://yellow-spider-549528.hostingersite.com**

Deberías ver tu página de inicio.

---

## 🔑 CREDENCIALES DE PRUEBA

### Admin
- **Email:** admin@smashrank.com
- **Contraseña:** admin123

### Jugadores de prueba
- player1@smashrank.com / player123
- player2@smashrank.com / player123

---

## 🐛 SI ALGO SALE MAL

### Error: "Cannot find module"

```bash
npm install
npm run build
pm2 restart smashrank
```

### Error: "Port 3000 already in use"

```bash
pm2 delete all
pm2 start server.js --name smashrank
pm2 save
```

### Error: "Database connection failed"

```bash
# Verificar .env
cat .env

# Si está mal, recrearlo
cat > .env << 'EOF'
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
EOF

pm2 restart smashrank
```

### La página sigue mostrando 403

```bash
# Ver logs para encontrar el error
pm2 logs smashrank --lines 50

# Reiniciar desde cero
pm2 delete smashrank
npm run build
pm2 start server.js --name smashrank
pm2 save
```

---

## 📊 COMANDOS ÚTILES

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs smashrank

# Reiniciar aplicación
pm2 restart smashrank

# Detener aplicación
pm2 stop smashrank

# Información detallada
pm2 show smashrank

# Monitor interactivo
pm2 monit
```

---

## 🔄 PARA FUTUROS UPDATES

Cuando hagas cambios y los subas a GitHub:

```bash
# Conectar SSH
ssh u851317150@yellow-spider-549528.hostingersite.com

# Ir al directorio
cd domains/yellow-spider-549528.hostingersite.com/public_html
# o
cd public_html

# Deploy rápido
git pull origin main && npm install && npm run build && pm2 restart smashrank
```

---

## 📝 RESUMEN DE LO QUE HICIMOS

✅ Creado `server.js` para Hostinger
✅ Configurado `next.config.js` con output standalone
✅ Actualizado `package.json` con script start correcto
✅ Creados archivos `.htaccess` para routing
✅ Generado `NEXTAUTH_SECRET` único
✅ Creado archivo `.env.production.server` con todas las variables
✅ Creado script `hostinger-deploy.sh` para deploy automático
✅ Creado `ecosystem.config.js` para PM2
✅ Creado `SSH_COMMANDS.md` con guía paso a paso
✅ Todo subido a GitHub

---

## 🎮 LO QUE TENDRÁS FUNCIONANDO

- 🏠 Homepage con estadísticas
- 🏆 Lista de torneos
- 📊 Ranking de jugadores
- 🔐 Login/Register
- ⚙️ Panel de admin (crear torneos)
- 📝 Sistema de inscripción
- ✅ Check-in de participantes
- 🎯 Visualización de brackets
- 🔄 Real-time con Socket.io
- 📱 Diseño responsive
- 🎨 Tema Brodev Lab (púrpura/rosa)

---

## 🆘 SI NECESITAS AYUDA

1. Copia el error completo de los logs
2. Ejecuta: `pm2 logs smashrank --lines 50 > error.log`
3. Muéstrame el archivo error.log

---

## ✅ CHECKLIST FINAL

- [ ] SSH conectado
- [ ] Directorio correcto (public_html)
- [ ] Archivo .env creado
- [ ] Comando de deploy ejecutado
- [ ] PM2 status muestra "online" en verde
- [ ] Página carga en el navegador
- [ ] Login funciona

Si todos tienen ✅, **¡FELICIDADES! 🎉** Tu aplicación está en producción.

---

**🎯 COMANDO ÚNICO PARA TODO (después de crear .env):**

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run build && npm install -g pm2 && pm2 delete smashrank ; pm2 start server.js --name smashrank && pm2 save && pm2 logs smashrank
```

**Tiempo estimado:** 2-3 minutos

**¡LISTO PARA DEPLOY! 🚀**
