# 🚀 DEPLOY SIN SSH - DESDE PANEL DE HOSTINGER

## ✅ Lo que ya tienes funcionando:
- Git conectado a GitHub
- Base de datos MySQL creada
- Código en el servidor

## 📝 PASOS EN EL PANEL DE HOSTINGER:

### 1️⃣ CONFIGURAR NODE.JS

1. En el menú lateral, busca **"Advanced"** o **"Avanzado"**
2. Click en **"Setup Node.js"** o **"Configurar Node.js"**
3. Click en **"CREATE APPLICATION"** o **"CREAR APLICACIÓN"**

**Configuración:**
```
Application root: /domains/yellow-spider-549528.hostingersite.com/public_html
Application URL: https://yellow-spider-549528.hostingersite.com
Application startup file: server.js
Node.js version: 18.x (o la más reciente disponible)
Application mode: production
```

4. Click en **"CREATE"**

---

### 2️⃣ AGREGAR VARIABLES DE ENTORNO

1. En la configuración de Node.js que acabas de crear
2. Busca **"Environment Variables"** o **"Variables de Entorno"**
3. Agrega estas variables una por una:

```
DATABASE_URL
mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank

NEXTAUTH_URL
https://yellow-spider-549528.hostingersite.com

NEXTAUTH_SECRET
pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY=

NODE_ENV
production

PORT
3000
```

---

### 3️⃣ EJECUTAR COMANDOS EN LA TERMINAL WEB

Hostinger tiene una **terminal web** en el panel:

1. Busca **"Terminal"** en el menú de Avanzado
2. O en la configuración de Node.js, busca **"Run npm command"**

**Ejecuta estos comandos UNO POR UNO:**

```bash
cd /domains/yellow-spider-549528.hostingersite.com/public_html
```

```bash
npm install
```

```bash
npx prisma generate
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed
```

```bash
npm run build
```

---

### 4️⃣ REINICIAR LA APLICACIÓN

1. Ve a **Setup Node.js**
2. Encuentra tu aplicación (SmashRank)
3. Click en **"Restart"** o **"Reiniciar"**

---

### 5️⃣ VERIFICAR

Abre: **https://yellow-spider-549528.hostingersite.com**

Deberías ver tu aplicación funcionando.

---

## 🔧 ALTERNATIVA: USAR FILE MANAGER

Si no encuentras la terminal:

1. Ve a **"File Manager"** o **"Administrador de Archivos"**
2. Navega a: `/domains/yellow-spider-549528.hostingersite.com/public_html`
3. Busca el botón **"+ File"** o **"+ Archivo"**
4. Crea un archivo llamado `.env`
5. Pega este contenido:

```
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
```

6. Guarda el archivo

---

## 📊 VERIFICAR BASE DE DATOS

1. Ve a **"Bases de datos"** → **"MySQL remoto"**
2. Click en **"Ingresar a phpMyAdmin"**
3. Verifica que existen las tablas (User, Tournament, Match, etc.)
4. Si NO existen, necesitas ejecutar las migraciones desde la terminal web

---

## 🆘 SI NO ENCUENTRAS SETUP NODE.JS

Algunos planes de Hostinger no tienen Node.js. En ese caso:

1. Ve a **"Gestión"** o tu panel principal
2. Verifica que tu plan incluye **"Node.js hosting"**
3. Si no lo incluye, contacta a soporte para activarlo

O usa esta alternativa:
1. **Hostinger → Git**
2. Click en **"Implementación automática"**
3. Cada push a GitHub desplegará automáticamente
4. Pero necesitas Node.js activo para que funcione

---

## 🎯 RESUMEN RÁPIDO:

1. **Avanzado** → **Setup Node.js** → **CREATE APPLICATION**
2. Configurar: root path, startup file (server.js), version 18.x
3. Agregar variables de entorno
4. **Terminal web** → ejecutar: npm install, prisma, build
5. **Restart** la aplicación
6. Abrir URL

---

## 📸 LO QUE DEBERÍAS VER:

En "Setup Node.js":
- Status: **RUNNING** (verde)
- Application: SmashRank
- Version: Node 18.x
- Entry point: server.js

Si está en rojo (STOPPED), click en **RESTART**.

---

## ⚡ NOTA IMPORTANTE:

Hostinger suele usar **puerto interno diferente**. Si ves error de puerto:

1. En Variables de Entorno, cambia `PORT` a `8080` o `8000`
2. O déjalo vacío para que use el puerto por defecto

---

**¿Encuentras la opción "Setup Node.js" en tu panel?** Si no, envíame un screenshot del menú "Avanzado" para guiarte mejor.
