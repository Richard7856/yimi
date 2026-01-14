#!/bin/bash

# Script para probar el endpoint en Render
# Uso: ./probar-render.sh

RENDER_URL="https://yimi-99u9.onrender.com"

echo "🧪 Probando endpoint en Render: $RENDER_URL"
echo ""

# Health check primero
echo "📡 Verificando health check..."
curl -s "$RENDER_URL/health" | jq '.' || curl -s "$RENDER_URL/health"
echo ""

# Generar PDF con formato n8n
echo "📄 Generando PDF con formato n8n..."
curl -X POST "$RENDER_URL/api/generar-pdf" \
  -H "Content-Type: application/json" \
  -d @ejemplo-n8n-minimo.json \
  --output cotizacion-render-test.pdf \
  -w "\n📊 Status: %{http_code}\n⏱️  Tiempo: %{time_total}s\n"

if [ $? -eq 0 ] && [ -f "cotizacion-render-test.pdf" ]; then
    echo ""
    echo "✅ PDF generado exitosamente: cotizacion-render-test.pdf"
    echo "📊 Tamaño del archivo:"
    ls -lh cotizacion-render-test.pdf
    echo ""
    echo "💡 Para usar en n8n, configura:"
    echo "   URL: $RENDER_URL/api/generar-pdf"
    echo "   Method: POST"
    echo "   Headers: Content-Type: application/json"
    echo "   Body: Tu JSON con los datos"
else
    echo "❌ Error al generar PDF"
fi
