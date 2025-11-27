# 🚀 Desplegar SmashRank en Vercel (GRATIS)

## Por qué Vercel es mejor para Next.js:
- ✅ GRATIS para proyectos personales
- ✅ Deploy automático desde GitHub
- ✅ Optimizado específicamente para Next.js
- ✅ SSL/HTTPS automático
- ✅ CDN global incluido
- ✅ Sin configuración de servidor

## Pasos para Deploy en Vercel:

### 1. Crear cuenta en Vercel
- Ve a https://vercel.com
- Haz clic en "Sign Up"
- Conecta con tu cuenta de GitHub (Gabrielb-Webdev)

### 2. Importar tu proyecto
- En Vercel dashboard, haz clic en "Add New..." → "Project"
- Selecciona el repositorio "SmashRank"
- Haz clic en "Import"

### 3. Configurar Variables de Entorno
En la pantalla de configuración, agrega estas variables:

```
DATABASE_URL=mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank
NEXTAUTH_SECRET=pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY=
NODE_ENV=production
```

⚠️ **IMPORTANTE**: La URL de NEXTAUTH_URL se configurará después del deploy

### 4. Deploy
- Deja las configuraciones por defecto
- Haz clic en "Deploy"
- Espera 2-3 minutos

### 5. Actualizar NEXTAUTH_URL
Después del deploy, Vercel te dará una URL como:
`https://smash-rank-xxxx.vercel.app`

Agrega esa URL como variable de entorno:
- Ve a Project Settings → Environment Variables
- Agrega: `NEXTAUTH_URL=https://tu-url.vercel.app`
- Redeploy el proyecto

### 6. Configurar Database (CRÍTICO)
⚠️ El problema: La database está en Hostinger (127.0.0.1) y NO es accesible públicamente

**Opciones:**
1. **Usar PlanetScale** (base de datos MySQL gratuita compatible con Vercel)
2. **Usar Supabase** (PostgreSQL gratuito)
3. **Hacer la DB de Hostinger accesible públicamente** (requiere cambiar 127.0.0.1 por IP pública)

#### Opción más simple: PlanetScale
1. Ve a https://planetscale.com y crea cuenta
2. Crea una database nueva
3. Copia la connection string
4. Actualiza DATABASE_URL en Vercel con la nueva URL

### 7. Migrar Base de Datos
Una vez configurada la nueva database URL:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## ¿Quieres que te ayude con Vercel?
Es MUCHO más simple que Hostinger para Next.js y completamente gratis.
