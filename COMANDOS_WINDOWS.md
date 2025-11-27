# ========================================
# COMANDOS PARA WINDOWS POWERSHELL
# ========================================

# 1. Crear archivo .env local (para desarrollo)
@"
DATABASE_URL="mysql://u851317150_smashrank:Lg030920.@127.0.0.1:3306/u851317150_smashrank"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="pgklo3EFyor2dzK/fCqhsiQg3F/lCHQWXQYH4c/nHPY="
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding utf8

# 2. Conectar a SSH de Hostinger (abre una nueva sesión SSH)
# DESPUÉS de ejecutar este comando, usarás comandos de Linux/Bash
ssh u851317150@yellow-spider-549528.hostingersite.com

# ========================================
# ⚠️ IMPORTANTE: Los comandos de abajo 
# se ejecutan DENTRO de SSH (terminal de Linux)
# NO en PowerShell de Windows
# ========================================
