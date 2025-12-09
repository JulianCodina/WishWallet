@echo off
title React Native Launcher
echo ============================================
echo     INICIANDO TODO EL ENTORNO ANDROID
echo ============================================

REM --- RUTA DEL SDK ---
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\cmdline-tools\latest\bin

echo.
echo Iniciando emulador Pixel_7 2...
start "" cmd /c "emulator -avd Pixel_7(2)"

echo.
echo Esperando 15 segundos a que el emulador arranque...
timeout /t 15 /nobreak >nul

echo.
echo Iniciando Metro Bundler en nueva ventana...
start "" cmd /k "npx react-native start"

echo.
echo Ejecutando app en Android...
npx react-native run-android

echo.
echo ✔ Todo iniciado correctamente.
pause
