# 🎯 GUÍA DEFINITIVA - PASO A PASO SIN ERRORES

## ⚠️ IMPORTANTE: HAY 2 TERMINALES DIFERENTES

1. **PowerShell de Windows** (donde estás ahora) ❌ NO usar comandos de Linux aquí
2. **SSH de Hostinger** (terminal de Linux) ✅ Aquí sí usas comandos de Linux

---

## 📝 PASO 1: CONECTARSE A HOSTINGER (PowerShell)

**En tu PowerShell actual**, ejecuta SOLO esto:

```powershell
ssh u851317150@yellow-spider-549528.hostingersite.com
```

Te pedirá contraseña (no se ve mientras escribes, es normal). Presiona Enter.

**Ahora estás dentro de Hostinger** (verás algo como `u851317150@server:~$`)

---

## 📝 PASO 2: IR AL DIRECTORIO (Ya dentro de SSH)

```bash
cd public_html
```

Si da error, prueba:
```bash
cd domains/yellow-spider-549528.hostingersite.com/public_html
```

---

## 📝 PASO 3: CREAR ARCHIVO .ENV (Ya dentro de SSH)

Copia todo esto **de una vez** (incluyendo las líneas con EOF):

```bash
cat > .env << 'EOF'
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
EOF
```

Verifica que se creó:
```bash
cat .env
```

---

## 📝 PASO 4: PULL DE GITHUB (Ya dentro de SSH)

```bash
git pull origin main
```

---

## 📝 PASO 5: INSTALAR TODO (Ya dentro de SSH)

Ejecuta estos comandos **UNO POR UNO** (presiona Enter después de cada uno):

```bash
npm install
```

Espera a que termine (puede tardar 1-2 minutos), luego:

```bash
npx prisma generate
```

Luego:

```bash
npx prisma migrate deploy
```

Luego:

```bash
npx prisma db seed
```

Luego:

```bash
npm run build
```

---

## 📝 PASO 6: INSTALAR PM2 (Ya dentro de SSH)

```bash
npm install -g pm2
```

---

## 📝 PASO 7: INICIAR APLICACIÓN (Ya dentro de SSH)

```bash
pm2 delete smashrank
```

(Puede dar error si no existe, es normal)

```bash
pm2 start server.js --name smashrank
```

```bash
pm2 save
```

---

## 📝 PASO 8: VERIFICAR (Ya dentro de SSH)

```bash
pm2 status
```

Debes ver "smashrank" con status "online" en verde.

```bash
pm2 logs smashrank
```

Debes ver: `> SmashRank ready on http://localhost:3000`

Presiona `Ctrl+C` para salir de los logs.

---

## 📝 PASO 9: PROBAR EN NAVEGADOR

Abre: **https://yellow-spider-549528.hostingersite.com**

¡Debería funcionar! 🎉

---

## 🔄 SI ALGO FALLA

### Ver logs de error:
```bash
pm2 logs smashrank --err --lines 50
```

### Reiniciar aplicación:
```bash
pm2 restart smashrank
```

### Empezar desde cero:
```bash
pm2 delete smashrank
npm run build
pm2 start server.js --name smashrank
pm2 save
```

---

## ✅ RESUMEN DE COMANDOS (COPIAR UNO POR UNO EN SSH)

```bash
cd public_html
cat > .env << 'EOF'
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="https://yellow-spider-549528.hostingersite.com"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="production"
PORT=3000
EOF
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
npm install -g pm2
pm2 delete smashrank
pm2 start server.js --name smashrank
pm2 save
pm2 logs smashrank
```

---

**⚠️ RECUERDA:** 
- Comandos de PowerShell (&&) NO funcionan en Windows
- Primero conecta SSH
- LUEGO ejecuta comandos de Linux
- PowerShell es diferente a Bash/Linux

**🎯 SOLO NECESITAS:**
1. `ssh` para conectar
2. Copiar comandos uno por uno DENTRO de SSH
3. Esperar a que cada uno termine antes del siguiente
