@echo off
title Servidor Local - Web Jonathan y Riham
echo ========================================================
echo   Iniciando servidor local en http://localhost:5555/
echo ========================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
