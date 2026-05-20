@echo off
title Strade & Servizi - Setup iniziale (Nativo)
chcp 65001 >nul

set "PROJECT=%~dp0"
if "%PROJECT:~-1%"=="\" set "PROJECT=%PROJECT:~0,-1%"

echo ========================================
echo  Strade & Servizi - Setup Prima Installazione
echo  (Modalita' nativa: PostgreSQL + Memurai)
echo ========================================
echo.

echo Verifica Node.js...
node --version
if errorlevel 1 (
    echo ERRORE: Node.js non trovato. Installa Node.js 24+ da https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Verifica pnpm...
pnpm --version
if errorlevel 1 (
    echo Installo pnpm...
    npm install -g pnpm@10
)

echo.
echo [1/4] Installazione dipendenze npm...
cd /d %PROJECT%
pnpm install
if errorlevel 1 (
    echo ERRORE durante pnpm install
    pause
    exit /b 1
)

echo.
echo [2/4] Creo la cartella di storage documenti...
if not exist "%PROJECT%\storage\commesse" (
    mkdir "%PROJECT%\storage\commesse"
    echo Cartella creata: %PROJECT%\storage\commesse
) else (
    echo Cartella storage gia' esistente.
)

echo.
echo [3/4] Creo il database su PostgreSQL locale...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE stradeservizi;" 2>nul
echo (se vedi "already exists" va bene lo stesso)

echo.
echo [4/4] Applico migration database e genero client Prisma...
cd /d %PROJECT%\packages\db
call npx prisma migrate deploy
call npx prisma generate
cd /d %PROJECT%

echo.
echo ========================================
echo  Setup completato!
echo  Ora puoi avviare il sistema con:
echo  start-crm.bat
echo ========================================
pause
