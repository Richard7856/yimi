#!/bin/bash

# Script para iniciar el servidor y ngrok
# Uso: ./iniciar-ngrok.sh

echo "🚀 Iniciando servidor PYGSA PDF Generator..."

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado"
    echo ""
    echo "📥 Instala ngrok con uno de estos métodos:"
    echo "   - Homebrew: brew install ngrok/ngrok/ngrok"
    echo "   - Descarga: https://ngrok.com/download"
    echo ""
    echo "Luego autentica con: ngrok config add-authtoken TU_TOKEN"
    exit 1
fi

# Verificar si el servidor ya está corriendo
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Servidor ya está corriendo en puerto 3000"
else
    echo "📡 Iniciando servidor en background..."
    node server.js > server.log 2>&1 &
    SERVER_PID=$!
    echo "   PID: $SERVER_PID"
    
    # Esperar a que el servidor esté listo
    echo "⏳ Esperando a que el servidor esté listo..."
    for i in {1..10}; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            echo "✅ Servidor listo!"
            break
        fi
        sleep 1
    done
fi

echo ""
echo "🌐 Iniciando túnel ngrok..."
echo "   Presiona Ctrl+C para detener"
echo ""

# Iniciar ngrok
ngrok http 3000
