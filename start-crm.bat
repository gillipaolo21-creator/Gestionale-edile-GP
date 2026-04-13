@echo off
title BrescianiCRM - Avvio Sistema

set PATH=C:\Users\Utente\AppData\Roaming\npm;C:\Program Files\Docker\Docker\resources\bin;C:\Program Files\nodejs;%SystemRoot%\system32;%SystemRoot%;%PATH%
set PNPM=C:\Users\Utente\AppData\Roaming\npm\pnpm.cmd
set PROJECT=C:\Users\Utente\BrescianiCRM

cd /d %PROJECT%

echo ========================================
echo  Avvio BrescianiCRM...
echo ========================================

echo.
echo [0/4] Chiusura processi precedenti...
taskkill /f /im node.exe >nul 2>&1

echo.
echo [1/4] Avvio Docker (PostgreSQL + Redis)...
docker compose up -d
if errorlevel 1 (
    echo ERRORE: Docker non avviato! Assicurati che Docker Desktop sia aperto.
    pause
    exit /b 1
)

echo.
echo [2/4] Avvio API (NestJS - porta 3001)...
start /min "BrescianiCRM API" cmd /k "set PATH=C:\Users\Utente\AppData\Roaming\npm;C:\Program Files\nodejs;%SystemRoot%\system32;%PATH% && cd /d %PROJECT% && %PNPM% --filter api start:dev"

echo.
echo [3/4] Avvio Frontend (Next.js - porta 3000)...
start /min "BrescianiCRM Web" cmd /k "set PATH=C:\Users\Utente\AppData\Roaming\npm;C:\Program Files\nodejs;%SystemRoot%\system32;%PATH% && cd /d %PROJECT% && %PNPM% --filter web dev"

echo.
echo [4/4] Attendo avvio server...
timeout /t 10 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo  Sistema avviato!
echo  Frontend: http://localhost:3000
echo  API:      http://localhost:3001
echo ========================================
echo Chiudi questa finestra quando vuoi.
pause
