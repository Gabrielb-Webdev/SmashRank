# =========================================
# COMANDOS PARA HOSTINGER SSH (LINUX/BASH)
# Ejecuta estos comandos DESPUÉS de conectarte por SSH
# =========================================

# 1. Ir al directorio de la aplicación
cd public_html
# O si no funciona, prueba:
cd domains/yellow-spider-549528.hostingersite.com/public_html

# 2. Crear archivo .env (COMANDO DE LINUX)
cat > .env << 'EOF'
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
EOF

# 3. Verificar que el archivo se creó correctamente
cat .env

# 4. Pull de GitHub
git pull origin main

# 5. Instalar dependencias
npm install

# 6. Generar Prisma
npx prisma generate

# 7. Migraciones
npx prisma migrate deploy

# 8. Seed (datos de prueba)
npx prisma db seed

# 9. Build
npm run build

# 10. Instalar PM2 (si no está)
npm install -g pm2

# 11. Detener proceso anterior (si existe)
pm2 delete smashrank

# 12. Iniciar aplicación
pm2 start server.js --name smashrank

# 13. Guardar configuración PM2
pm2 save

# 14. Ver logs
pm2 logs smashrank

# 15. Ver estado
pm2 status
