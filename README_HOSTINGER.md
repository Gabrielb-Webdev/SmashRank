# 📦 SmashRank - Listo para Hostinger

## ✅ Configuración Completada

Tu proyecto **SmashRank** está completamente configurado para funcionar con **Hostinger MySQL**.

### 🎯 Información de tu Base de Datos Hostinger

```
Base de datos: u851317150_smashrank
Usuario: u851317150_smashrank
Contraseña: Lg030920.
Puerto: 3306
```

**Host:**
- **En Hostinger (producción):** `127.0.0.1`
- **Desde tu PC (desarrollo):** `???` ← **NECESITAS OBTENER ESTO**

**URL del sitio:** https://yellow-spider-549528.hostingersite.com

---

## ⚠️ PASO CRÍTICO: Obtener Hostname Remoto

Para poder trabajar desde tu PC local, necesitas el **hostname remoto** de tu base de datos MySQL.

### 🔍 Cómo Encontrarlo:

#### 1. Panel de Hostinger - MySQL Remoto
1. Ve a https://hpanel.hostinger.com
2. Click en **"Bases de datos"** (menú lateral izquierdo)
3. Busca la sección **"MySQL remoto"** o **"Remote MySQL"**
4. Habilita el acceso remoto
5. Agrega tu IP actual (busca "cual es mi ip" en Google)
6. **Copia el hostname** - ejemplo:
   - `srv1234.hostinger.com`
   - `mysql-###.hostinger.com`
   - O similar

#### 2. Contactar Soporte
Si no encuentras la opción:
1. Chat de soporte de Hostinger
2. Pregunta: "¿Cuál es el hostname remoto para conectarme a mi MySQL desde fuera del servidor?"
3. Base de datos: `u851317150_smashrank`

#### 3. Ver en phpMyAdmin
1. Hostinger > Bases de datos > phpMyAdmin
2. En la parte superior puede mostrar el servidor

---

## 🚀 Una Vez que Tengas el Hostname

### 1. Actualiza `.env`

Abre `.env` y cambia la línea 2:

```env
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@TU_HOSTNAME_AQUI:3306/u851317150_smashrank"
```

**Ejemplo:**
```env
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@srv1234.hostinger.com:3306/u851317150_smashrank"
```

### 2. Ejecuta las Migraciones

```bash
# Terminal en VS Code
cd "F:\Users\gabri\Documentos\Gabriel Dev\SmashRank"

# Crear tablas en Hostinger
npx prisma migrate deploy

# O si es primera vez:
npx prisma migrate dev --name init
```

### 3. Pobla los Datos de Prueba

```bash
npx prisma db seed
```

Esto creará:
- ✅ 1 Admin (admin@smashrank.com / admin123)
- ✅ 2 Jugadores (player1@test.com, player2@test.com / player123)
- ✅ 8 Stages (Battlefield, FD, PS2, etc.)
- ✅ 1 Torneo de ejemplo

### 4. Verifica con Prisma Studio

```bash
npx prisma studio
```

Abre http://localhost:5555 y revisa que todo esté en Hostinger.

### 5. Build y Deploy

```bash
# Compilar
npm run build

# Subir a Hostinger (Git o FTP)
```

Ver guía completa: **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

---

## 📚 Documentación Creada

| Archivo | Qué Contiene |
|---------|--------------|
| **NEXT_STEPS.md** | Resumen completo y próximos pasos |
| **DEPLOY_GUIDE.md** | Guía detallada de deploy en Hostinger |
| **HOSTINGER_SETUP.md** | Configuración y troubleshooting Hostinger |
| **PROJECT_STATUS.md** | Estado del proyecto y features completadas |
| **.env.production** | Variables para producción (en Hostinger) |
| **.env.local** | Variables para desarrollo local |

---

## 🎮 Después del Deploy

### Prueba el Sitio:
1. Ve a: https://yellow-spider-549528.hostingersite.com
2. Haz login con: admin@smashrank.com / admin123
3. Navega por las páginas

### Próximas Features a Implementar:
- [ ] Lista de torneos con filtros
- [ ] Crear torneo (admin panel)
- [ ] Sistema de inscripción
- [ ] Tabla de ranking interactiva
- [ ] Visualización de brackets
- [ ] Socket.io para tiempo real

---

## 📞 Si Necesitas Ayuda

### No puedes obtener hostname remoto?

**Plan B: Ejecutar todo desde Hostinger**
1. Sube el código a Hostinger (Git/FTP)
2. Conéctate por SSH al servidor
3. Ejecuta las migraciones desde allí:
   ```bash
   cd /ruta/al/proyecto
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Error de conexión?
- Verifica que tu IP esté en la lista blanca de MySQL remoto
- Confirma que el puerto 3306 no esté bloqueado por tu firewall
- Prueba con: `npx prisma db push` (más directo que migrate)

---

## ✅ Checklist Rápido

- [x] Prisma schema adaptado a MySQL
- [x] Seed actualizado (sin arrays)
- [x] `.env` configurado con credenciales
- [x] `.env.production` creado
- [x] Cliente Prisma regenerado
- [ ] **Hostname remoto obtenido** ← TÚ ESTÁS AQUÍ
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Build compilado
- [ ] Deploy realizado
- [ ] Sitio funcionando en Hostinger

---

## 🎯 Tu Próxima Acción

**VE A:** https://hpanel.hostinger.com  
**BUSCA:** "MySQL remoto" o "Remote MySQL"  
**OBTÉN:** El hostname remoto  
**ACTUALIZA:** `.env` línea 2 con ese hostname  
**EJECUTA:** `npx prisma migrate deploy`

¡Eso es todo! Una vez hecho esto, tu base de datos estará lista y podrás continuar con el desarrollo. 🚀

---

**Configurado por:** GitHub Copilot  
**Fecha:** 27 de Noviembre, 2025  
**Base de datos:** u851317150_smashrank @ Hostinger MySQL  
**Sitio:** https://yellow-spider-549528.hostingersite.com
