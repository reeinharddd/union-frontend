#!/bin/bash
# Script de limpieza y reinstalación limpia para resolver problemas de Node 22.x y Tailwind

echo "🧹 Limpiando caché y dependencias..."

# Limpiar caché de Angular
echo "Limpiando caché de Angular..."
npx ng cache clean

# Limpiar caché de npm
echo "Limpiando caché de npm..."
npm cache clean --force

# Eliminar node_modules y locks
echo "Eliminando node_modules y lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f yarn.lock

# Limpiar archivos de build
echo "Limpiando archivos de build..."
rm -rf dist
rm -rf .angular

echo "📦 Reinstalando dependencias con versiones compatibles..."

# Reinstalar dependencias
npm install

echo "🎯 Verificando instalación..."
npm ls tailwindcss postcss autoprefixer

echo "✅ Limpieza completada. Ahora puedes ejecutar 'ng serve' desde una terminal estándar (no Console Ninja)."

echo ""
echo "📋 RECORDATORIOS IMPORTANTES:"
echo "1. Usa Node.js 20.x LTS (no 22.x)"
echo "2. Ejecuta 'ng serve' desde terminal estándar, no Console Ninja"
echo "3. Si persisten errores, revisa que no haya @apply anidados en styles.css"
