@echo off
setlocal enabledelayedexpansion

set "basePath=C:\Gestionale-edile-GP-master\apps\api\src"

echo Creating directories in: %basePath%
echo.

mkdir "%basePath%\personale" && echo [SUCCESS] Created: %basePath%\personale || echo [FAILED] Could not create: %basePath%\personale
mkdir "%basePath%\mezzi" && echo [SUCCESS] Created: %basePath%\mezzi || echo [FAILED] Could not create: %basePath%\mezzi
mkdir "%basePath%\materiali" && echo [SUCCESS] Created: %basePath%\materiali || echo [FAILED] Could not create: %basePath%\materiali
mkdir "%basePath%\subappaltatori" && echo [SUCCESS] Created: %basePath%\subappaltatori || echo [FAILED] Could not create: %basePath%\subappaltatori
mkdir "%basePath%\sal" && echo [SUCCESS] Created: %basePath%\sal || echo [FAILED] Could not create: %basePath%\sal
mkdir "%basePath%\fatture" && echo [SUCCESS] Created: %basePath%\fatture || echo [FAILED] Could not create: %basePath%\fatture
mkdir "%basePath%\sicurezza" && echo [SUCCESS] Created: %basePath%\sicurezza || echo [FAILED] Could not create: %basePath%\sicurezza

echo.
echo === Final Verification ===
for /d %%D in ("%basePath%\personale" "%basePath%\mezzi" "%basePath%\materiali" "%basePath%\subappaltatori" "%basePath%\sal" "%basePath%\fatture" "%basePath%\sicurezza") do (
    if exist "%%D\" (
        echo ✓ %%D
    ) else (
        echo ✗ NOT FOUND: %%D
    )
)

pause
