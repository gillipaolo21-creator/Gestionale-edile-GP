@echo off
title Gestionale Edile GP - Avvio
chcp 65001 >nul

set "PROJECT=%~dp0"
if "%PROJECT:~-1%"=="\" set "PROJECT=%PROJECT:~0,-1%"

cd /d "%PROJECT%"

echo ============================================
echo   Gestionale Edile GP  -  Avvio Sistema
echo ============================================

echo.
echo [1/3] Chiusura processi Node.js precedenti...
taskkill /f /im node.exe >nul 2>&1

echo.
echo [2/3] Avvio API NestJS (porta 3001)...
start /min "GP - API" cmd /k "cd /d "%PROJECT%" && pnpm --filter api start:dev"

echo.
echo [3/3] Avvio Frontend Next.js (porta 3000)...
start /min "GP - Web" cmd /k "cd /d "%PROJECT%" && pnpm --filter web dev"

echo.
echo Attendo avvio server (20 sec)...
timeout /t 20 /nobreak >nul
start http://localhost:3000

echo.
echo ============================================
echo   Sistema avviato!
echo   Frontend : http://localhost:3000
echo   API      : http://localhost:3001
echo   Swagger  : http://localhost:3001/api/docs
echo ============================================
echo.
echo Premi un tasto per chiudere questa finestra.
echo (I server continueranno a girare in background)
pause >nul
