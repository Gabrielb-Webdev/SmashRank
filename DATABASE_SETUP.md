# 🚀 Configuración Rápida de Base de Datos

## Opción Recomendada: Neon (PostgreSQL Gratis)

### Paso 1: Crear cuenta en Neon
1. Ve a https://neon.tech
2. Click en "Sign Up" (puedes usar GitHub)
3. Crea un nuevo proyecto llamado "SmashRank"
4. Espera 30 segundos a que se cree

### Paso 2: Obtener Connection String
1. En tu proyecto Neon, ve a "Dashboard"
2. Busca la sección "Connection string"
3. Copia la URL que empieza con `postgresql://`
4. Se verá algo así:
   ```
   postgresql://usuario:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Paso 3: Actualizar .env
Abre el archivo `.env` y reemplaza la línea `DATABASE_URL` con tu connection string de Neon:

```env
DATABASE_URL="postgresql://usuario:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Paso 4: Ejecutar Migraciones
En la terminal de VS Code, ejecuta:

```bash
npx prisma migrate dev --name init
```

Esto creará todas las tablas en tu base de datos.

### Paso 5: Poblar con Datos de Prueba
```bash
npx prisma db seed
```

Esto creará:
- 1 Admin: admin@smashrank.com / admin123
- 2 Jugadores: player1@test.com / player123, player2@test.com / player123
- 8 Stages (Battlefield, FD, PS2, etc.)
- 1 Torneo de prueba

### Paso 6: Iniciar el Servidor
```bash
npm run dev
```

¡Listo! Tu aplicación estará en http://localhost:3000

---

## Alternativa: Supabase (PostgreSQL Gratis)

Si prefieres Supabase:

1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Ve a Settings > Database > Connection string
4. Copia la "URI" (modo connection pooling)
5. Actualiza `.env` con esa URL
6. Ejecuta los pasos 4, 5 y 6 de arriba

---

## ¿Tienes PostgreSQL local?

Si ya tienes PostgreSQL instalado:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/smashrank"
```

Luego ejecuta los pasos 4, 5 y 6.

---

**Nota**: Neon y Supabase tienen planes gratuitos generosos perfectos para desarrollo y proyectos pequeños.
