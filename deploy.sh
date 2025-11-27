#!/bin/bash

# SmashRank - Script de deploy para Hostinger

echo "🚀 Iniciando deploy de SmashRank..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# 3. Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npx prisma migrate deploy

# 4. Ejecutar seed (opcional, comentar si ya tienes datos)
echo "🌱 Ejecutando seed..."
npx prisma db seed

# 5. Build de producción
echo "🏗️ Compilando aplicación..."
npm run build

# 6. Detener proceso anterior (si existe)
echo "⏹️ Deteniendo proceso anterior..."
pm2 stop smashrank || true
pm2 delete smashrank || true

# 7. Iniciar aplicación con PM2
echo "▶️ Iniciando aplicación..."
pm2 start npm --name "smashrank" -- start
pm2 save

echo "✅ Deploy completado!"
echo "📊 Para ver logs: pm2 logs smashrank"
echo "🔄 Para reiniciar: pm2 restart smashrank"
