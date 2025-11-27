#!/bin/bash

# ============================================
# SCRIPT DE DEPLOY COMPLETO PARA HOSTINGER
# Ejecuta este script via SSH en Hostinger
# ============================================

echo "🚀 SmashRank - Deploy Automático"
echo "=================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Verificar que estamos en el directorio correcto
echo "📁 Verificando directorio..."
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi
print_status "Directorio correcto"

# 2. Pull de últimos cambios
echo ""
echo "📥 Descargando últimos cambios de GitHub..."
git pull origin main
if [ $? -eq 0 ]; then
    print_status "Código actualizado desde GitHub"
else
    print_warning "No se pudo hacer pull (puede que ya esté actualizado)"
fi

# 3. Limpiar instalación anterior
echo ""
echo "🧹 Limpiando instalación anterior..."
rm -rf node_modules/.cache
rm -rf .next
print_status "Cache limpiada"

# 4. Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install --production=false
if [ $? -eq 0 ]; then
    print_status "Dependencias instaladas"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# 5. Generar Prisma Client
echo ""
echo "🔧 Generando Prisma Client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_status "Prisma Client generado"
else
    print_error "Error al generar Prisma Client"
    exit 1
fi

# 6. Ejecutar migraciones
echo ""
echo "🗄️ Ejecutando migraciones de base de datos..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    print_status "Migraciones aplicadas"
else
    print_warning "Error en migraciones (puede que ya estén aplicadas)"
fi

# 7. Seed de base de datos (preguntar)
echo ""
read -p "¿Ejecutar seed de datos? (S/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]] || [[ -z $REPLY ]]; then
    echo "🌱 Ejecutando seed..."
    npx prisma db seed
    if [ $? -eq 0 ]; then
        print_status "Datos seed insertados"
    else
        print_warning "Error en seed (puede que los datos ya existan)"
    fi
else
    print_warning "Seed omitido"
fi

# 8. Build de producción
echo ""
echo "🏗️ Compilando aplicación para producción..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Build completado exitosamente"
else
    print_error "Error en el build"
    exit 1
fi

# 9. Gestión de proceso con PM2
echo ""
echo "🔄 Gestionando proceso de aplicación..."

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📥 PM2 no encontrado, instalando globalmente..."
    npm install -g pm2
    print_status "PM2 instalado"
fi

# Detener proceso anterior
pm2 stop smashrank 2>/dev/null
pm2 delete smashrank 2>/dev/null

# Iniciar aplicación
echo "▶️ Iniciando aplicación..."
pm2 start server.js --name "smashrank" --time
pm2 save
print_status "Aplicación iniciada con PM2"

# 10. Mostrar estado
echo ""
echo "📊 Estado de la aplicación:"
pm2 list

echo ""
echo "=================================="
echo -e "${GREEN}✅ DEPLOY COMPLETADO EXITOSAMENTE${NC}"
echo "=================================="
echo ""
echo "📝 Comandos útiles:"
echo "   Ver logs:      pm2 logs smashrank"
echo "   Reiniciar:     pm2 restart smashrank"
echo "   Detener:       pm2 stop smashrank"
echo "   Estado:        pm2 status"
echo "   Monitorear:    pm2 monit"
echo ""
echo "🌐 URL: https://yellow-spider-549528.hostingersite.com"
echo ""
