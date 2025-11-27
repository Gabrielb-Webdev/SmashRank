# 🚀 COMANDOS SSH PARA HOSTINGER - COPIA Y PEGA

## 📋 Opción 1: Comandos individuales (paso a paso)

```bash
# 1. Conectarse a Hostinger
ssh u851317150@yellow-spider-549528.hostingersite.com

# 2. Ir al directorio de la aplicación
cd domains/yellow-spider-549528.hostingersite.com/public_html

# 3. Verificar que estás en el lugar correcto
pwd
ls -la

# 4. Pull últimos cambios de GitHub
git pull origin main

# 5. Instalar dependencias
npm install

# 6. Generar Prisma Client
npx prisma generate

# 7. Ejecutar migraciones
npx prisma migrate deploy

# 8. Ejecutar seed (SOLO LA PRIMERA VEZ)
npx prisma db seed

# 9. Build de producción
npm run build

# 10. Instalar PM2 si no está instalado
npm install -g pm2

# 11. Detener proceso anterior
pm2 stop smashrank
pm2 delete smashrank

# 12. Iniciar aplicación
pm2 start server.js --name "smashrank"
pm2 save

# 13. Ver estado
pm2 status

# 14. Ver logs en tiempo real
pm2 logs smashrank
```

---

## ⚡ Opción 2: Script automático (TODO DE UNA VEZ)

```bash
# Conectarse a Hostinger
ssh u851317150@yellow-spider-549528.hostingersite.com

# Ir al directorio
cd domains/yellow-spider-549528.hostingersite.com/public_html

# Descargar y ejecutar el script
curl -o deploy-auto.sh https://raw.githubusercontent.com/Gabrielb-Webdev/SmashRank/main/hostinger-deploy.sh
chmod +x deploy-auto.sh
./deploy-auto.sh
```

**O si el archivo ya está en el servidor:**

```bash
chmod +x hostinger-deploy.sh
./hostinger-deploy.sh
```

---

## 🔧 Opción 3: Un solo comando (Deploy Express)

```bash
ssh u851317150@yellow-spider-549528.hostingersite.com "cd domains/yellow-spider-549528.hostingersite.com/public_html && git pull origin main && npm install && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 restart smashrank || pm2 start server.js --name smashrank && pm2 save"
```

---

## 📊 Comandos de monitoreo útiles

```bash
# Ver logs en tiempo real
pm2 logs smashrank

# Ver logs con filtro de errores
pm2 logs smashrank --err

# Estado de la aplicación
pm2 status

# Información detallada
pm2 show smashrank

# Monitor interactivo
pm2 monit

# Reiniciar aplicación
pm2 restart smashrank

# Detener aplicación
pm2 stop smashrank

# Ver uso de recursos
pm2 list
```

---

## 🐛 Solución de problemas

### Error: "Cannot find module 'next'"
```bash
npm install
npm run build
pm2 restart smashrank
```

### Error: "Port 3000 already in use"
```bash
pm2 delete all
pm2 start server.js --name smashrank
```

### Error: "Database connection failed"
```bash
# Verificar que .env tiene 127.0.0.1 (no mysql.hostinger.com)
cat .env | grep DATABASE_URL

# Si está mal, editar:
nano .env
# Cambiar a: DATABASE_URL=mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank
```

### Error: "NEXTAUTH_SECRET is not set"
```bash
# Generar secret
openssl rand -base64 32

# Agregar a .env
echo "NEXTAUTH_SECRET=TU_SECRET_AQUI" >> .env
```

### La aplicación no responde
```bash
# Ver logs
pm2 logs smashrank --lines 50

# Reiniciar desde cero
pm2 delete smashrank
npm run build
pm2 start server.js --name smashrank
pm2 save
```

---

## 📝 Verificar que todo funcione

```bash
# Ver si el proceso está corriendo
pm2 list

# Debe aparecer "smashrank" con status "online" en verde

# Ver logs para verificar que no hay errores
pm2 logs smashrank --lines 20

# Debe decir: "> SmashRank ready on http://localhost:3000"

# Probar conexión local
curl http://localhost:3000

# Debe retornar HTML de la página
```

---

## 🔄 Para futuros deploys (después de push a GitHub)

```bash
# Conectar SSH
ssh u851317150@yellow-spider-549528.hostingersite.com

# Ir al directorio
cd domains/yellow-spider-549528.hostingersite.com/public_html

# Deploy rápido
git pull && npm install && npm run build && pm2 restart smashrank
```

---

## 🆘 Contacto Hostinger

Si nada funciona:
1. Abre un ticket en Hostinger Support
2. Menciona que necesitas configurar una aplicación Node.js
3. Pídeles que verifiquen la configuración de Node.js en tu hosting

---

**🎯 COMANDO RECOMENDADO PARA EMPEZAR:**

```bash
ssh u851317150@yellow-spider-549528.hostingersite.com
cd domains/yellow-spider-549528.hostingersite.com/public_html
git pull origin main && npm install && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 stop smashrank ; pm2 start server.js --name smashrank && pm2 save && pm2 logs smashrank
```

Copia eso en tu terminal y presiona Enter. Te pedirá la contraseña SSH y luego hará todo automáticamente.
