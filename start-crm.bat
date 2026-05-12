@echo off
title BrescianiCRM - Avvio Sistema
chcp 65001 >nul

set PROJECT=C:\Gestionale-edile-GP-master

cd /d %PROJECT%

echo ========================================
echo  Avvio BrescianiCRM (locale nativo)
echo ========================================

echo.
echo [0/4] Chiusura processi node.exe precedenti...
taskkill /f /im node.exe >nul 2>&1

echo.
echo [1/4] Verifica servizi locali...
echo Verifico PostgreSQL...
"C:\Program Files\PostgreSQL\16\bin\pg_isready.exe" -U postgres >nul 2>&1
if errorlevel 1 (
    echo ERRORE: PostgreSQL non raggiungibile su porta 5432!
    echo Assicurati che il servizio PostgreSQL sia avviato.
    echo Vai in: Pannello di controllo > Strumenti di amministrazione > Servizi > postgresql-x64-16
    pause
    exit /b 1
)
echo PostgreSQL OK.

echo.
echo Verifico Redis/Memurai su porta 6379...
netstat -an | find "6379" | find "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo ATTENZIONE: Redis/Memurai non sembra attivo sulla porta 6379.
    echo Avvia Memurai dal menu Start oppure installa da https://www.memurai.com
    pause
    exit /b 1
)
echo Redis OK.

echo.
echo [2/4] Applico le migration del database...
cd /d %PROJECT%\packages\db
call npx prisma migrate deploy
call npx prisma generate
cd /d %PROJECT%

echo.
echo [3/4] Avvio API NestJS (porta 3001)...
start /min "BrescianiCRM API" cmd /k "cd /d %PROJECT% && pnpm --filter api start:dev"

echo.
echo [4/4] Avvio Frontend Next.js (porta 3000)...
start /min "BrescianiCRM Web" cmd /k "cd /d %PROJECT% && pnpm --filter web dev"

echo.
echo Attendo avvio server (15 sec)...
timeout /t 15 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo  Sistema avviato!
echo  Frontend: http://localhost:3000
echo  API:      http://localhost:3001
echo  Swagger:  http://localhost:3001/api/docs
echo ========================================
pause
