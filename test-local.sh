#!/bin/bash

# Script para probar el servicio localmente
# Uso: ./test-local.sh

echo "🧪 Probando el servicio PYGSA PDF Generator..."
echo ""

# Verificar que el servidor esté corriendo
echo "📡 Verificando health check..."
curl -s http://localhost:3000/health | jq '.'

echo ""
echo "📄 Generando PDF de prueba..."
curl -X POST http://localhost:3000/api/generar-pdf \
  -H "Content-Type: application/json" \
  -d @ejemplo-datos.json \
  --output cotizacion-prueba.pdf

if [ $? -eq 0 ]; then
  echo "✅ PDF generado exitosamente: cotizacion-prueba.pdf"
  echo "📊 Tamaño del archivo:"
  ls -lh cotizacion-prueba.pdf
else
  echo "❌ Error al generar PDF"
fi
