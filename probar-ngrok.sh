#!/bin/bash

# Script para probar el endpoint con ngrok
# Uso: ./probar-ngrok.sh https://tu-url-ngrok.ngrok-free.app

NGROK_URL=$1

if [ -z "$NGROK_URL" ]; then
    echo "❌ Necesitas proporcionar la URL de ngrok"
    echo ""
    echo "📋 Para obtener la URL:"
    echo "   1. Ve a http://localhost:4040 en tu navegador"
    echo "   2. O ejecuta: curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*' | head -1"
    echo ""
    echo "💡 Uso: ./probar-ngrok.sh https://abc123.ngrok-free.app"
    exit 1
fi

echo "🧪 Probando endpoint: $NGROK_URL/api/generar-pdf"
echo ""

# Health check primero
echo "📡 Verificando health check..."
curl -s "$NGROK_URL/health" | jq '.' || echo "⚠️  jq no instalado, mostrando respuesta raw"
echo ""

# Generar PDF
echo "📄 Generando PDF..."
curl -X POST "$NGROK_URL/api/generar-pdf" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d @ejemplo-datos.json \
  --output cotizacion-ngrok-test.pdf \
  -w "\n📊 Status: %{http_code}\n⏱️  Tiempo: %{time_total}s\n"

if [ $? -eq 0 ] && [ -f "cotizacion-ngrok-test.pdf" ]; then
    echo ""
    echo "✅ PDF generado exitosamente: cotizacion-ngrok-test.pdf"
    echo "📊 Tamaño del archivo:"
    ls -lh cotizacion-ngrok-test.pdf
    echo ""
    echo "💡 Para usar en n8n, configura:"
    echo "   URL: $NGROK_URL/api/generar-pdf"
    echo "   Method: POST"
    echo "   Headers: Content-Type: application/json"
    echo "   Body: Tu JSON con los datos"
else
    echo "❌ Error al generar PDF"
fi
