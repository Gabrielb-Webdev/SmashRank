# 🚀 Script de Deploy para SmashRank

## Paso 1: Commit y Push a GitHub

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Crear commit
git commit -m "feat: SmashRank MVP - Sistema de torneos, ranking y autenticación"

# Agregar remote (si no existe)
git remote add origin https://github.com/Gabrielb-Webdev/SmashRank.git

# Forzar push a main
git push -u origin main --force
```

## Paso 2: Deploy en Hostinger

### Opción A: Deploy con Git (Recomendado)

1. **En el panel de Hostinger:**
   - Ve a "Git" en el menú lateral
   - Click en "Conectar repositorio"
   - Selecciona GitHub
   - Busca y selecciona "Gabrielb-Webdev/SmashRank"
   - Branch: `main`
   - Click en "Conectar"

2. **Configurar variables de entorno:**
   - Ve a "Configuración" > "Variables de entorno"
   - Agrega estas variables:
     ```
     DATABASE_URL=mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank
     NEXTAUTH_SECRET=Oyxj8smFORW3k0tFnYkbQV9a4Gcy3vExfJyCL+GyDuU=
     NEXTAUTH_URL=https://yellow-spider-549528.hostingersite.com
     NODE_ENV=production
     ```

3. **Configurar comandos de build:**
   - Comando de instalación: `npm install`
   - Comando de build: `npm run build`
   - Comando de inicio: `npm start`
   - Puerto: `3000`

4. **Deploy automático:**
   - Hostinger detectará el push y desplegará automáticamente
   - Espera 2-5 minutos

### Opción B: SSH + Comandos Manuales

```bash
# Conectarse por SSH a Hostinger
ssh usuario@yellow-spider-549528.hostingersite.com

# Navegar al directorio del proyecto
cd /home/usuario/htdocs/

# Clonar repositorio (primera vez)
git clone https://github.com/Gabrielb-Webdev/SmashRank.git
cd SmashRank

# O actualizar (si ya existe)
git pull origin main

# Instalar dependencias
npm install

# Crear archivo .env
nano .env
# Pega el contenido de .env.production y guarda (Ctrl+X, Y, Enter)

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed
npx prisma db seed

# Build del proyecto
npm run build

# Iniciar en producción
npm start
# O con PM2 para mantener corriendo:
pm2 start npm --name "smashrank" -- start
pm2 save
```

## Paso 3: Ejecutar Migraciones en Hostinger

**IMPORTANTE**: Las migraciones deben ejecutarse desde el servidor de Hostinger porque usa `127.0.0.1` para MySQL.

```bash
# Por SSH en Hostinger:
cd /ruta/al/proyecto/SmashRank

# Generar cliente
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar datos de prueba
npx prisma db seed
```

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Admin: admin@smashrank.com / admin123
- ✅ 2 Jugadores de prueba
- ✅ 8 Stages
- ✅ 1 Torneo de ejemplo

## Paso 4: Verificar Deployment

1. **Visita el sitio:**
   https://yellow-spider-549528.hostingersite.com

2. **Prueba login:**
   - Email: admin@smashrank.com
   - Password: admin123

3. **Verifica páginas:**
   - Homepage (con stats reales)
   - Torneos (lista dinámica)
   - Ranking (tabla de jugadores)
   - Login/Register

4. **Crea un torneo (como admin):**
   - Ve a Torneos > "Crear Torneo"
   - Llena el formulario
   - Verifica que aparezca en la lista

## Paso 5: Logs y Troubleshooting

### Ver logs de la aplicación:
```bash
# SSH en Hostinger
pm2 logs smashrank

# O si no usas PM2:
tail -f /path/to/logs/error.log
```

### Ver logs de Hostinger:
- Panel de Hostinger > "Alojamiento" > "Logs"
- Busca errores de Node.js o Next.js

### Errores comunes:

**Error: Cannot connect to database**
- Verifica que `DATABASE_URL` use `127.0.0.1` en producción
- Confirma que las migraciones se ejecutaron

**Error: Module not found**
- Ejecuta `npm install` en el servidor
- Verifica que todas las dependencias estén en `package.json`

**Error 500 al crear torneo**
- Revisa los logs de la aplicación
- Verifica que el usuario sea admin
- Confirma que la sesión de NextAuth funcione

**Página en blanco**
- Verifica que `npm run build` se ejecutó exitosamente
- Confirma que todas las variables de entorno están configuradas

## Paso 6: Post-Deploy

### Actualizar código en el futuro:

```bash
# En tu PC local:
git add .
git commit -m "tu mensaje"
git push origin main

# Si usas Git en Hostinger, se actualizará automáticamente
# Si no, por SSH:
cd /ruta/al/proyecto
git pull origin main
npm install
npm run build
pm2 restart smashrank
```

### Monitoreo:

- Revisa logs regularmente
- Verifica que el sitio esté activo
- Prueba las funcionalidades principales

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Repositorio conectado en Hostinger
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Build completado
- [ ] Aplicación corriendo
- [ ] Homepage cargando correctamente
- [ ] Login funcionando
- [ ] Torneos mostrándose
- [ ] Ranking mostrándose
- [ ] Admin puede crear torneos

---

**Una vez completado este checklist, tu aplicación estará LIVE en Hostinger!** 🎉

**URL:** https://yellow-spider-549528.hostingersite.com  
**Repo:** https://github.com/Gabrielb-Webdev/SmashRank
