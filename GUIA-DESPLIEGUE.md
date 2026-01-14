# 🚀 Guía de Despliegue - PYGSA PDF Generator

## Opción 1: Prueba Rápida con ngrok ⚡

### Paso 1: Instalar ngrok

**macOS (Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**O descarga desde:**
https://ngrok.com/download

### Paso 2: Autenticar ngrok

1. Regístrate en https://ngrok.com (gratis)
2. Obtén tu authtoken desde el dashboard
3. Ejecuta:
```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

### Paso 3: Iniciar servidor y ngrok

**Opción A - Script automático:**
```bash
./iniciar-ngrok.sh
```

**Opción B - Manual:**
```bash
# Terminal 1: Iniciar servidor
npm start

# Terminal 2: Iniciar ngrok
ngrok http 3000
```

### Paso 4: Usar la URL de ngrok

ngrok te dará una URL como: `https://abc123.ngrok-free.app`

**En n8n, usa esta URL:**
```
POST https://abc123.ngrok-free.app/api/generar-pdf
```

⚠️ **Nota:** La URL de ngrok cambia cada vez que lo reinicias (en plan gratuito). Para URL fija, necesitas plan de pago.

---

## Opción 2: Despliegue en Render.com ☁️ (Recomendado)

### Paso 1: Preparar repositorio Git

```bash
git init
git add .
git commit -m "Servicio PDF Generator"
```

### Paso 2: Subir a GitHub/GitLab

```bash
# Crear repositorio en GitHub, luego:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Paso 3: Desplegar en Render

1. **Ir a:** https://render.com
2. **Crear cuenta** (gratis con tarjeta o sin tarjeta con limitaciones)
3. **Nuevo → Web Service**
4. **Conectar tu repositorio** de GitHub/GitLab
5. **Configuración:**
   - **Name:** `pygsa-pdf-generator`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (o Starter para mejor rendimiento)

6. **Variables de entorno (opcional):**
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render lo asigna automáticamente, pero puedes dejarlo)

7. **Click en "Create Web Service"**

### Paso 4: Esperar despliegue

Render tardará 2-5 minutos en:
- Instalar dependencias
- Compilar
- Iniciar el servicio

### Paso 5: Obtener URL

Render te dará una URL como: `https://pygsa-pdf-generator.onrender.com`

**En n8n, usa:**
```
POST https://pygsa-pdf-generator.onrender.com/api/generar-pdf
```

### ✅ Ventajas de Render:
- ✅ URL permanente
- ✅ Despliegue automático con cada push
- ✅ Logs en tiempo real
- ✅ Plan gratuito disponible
- ✅ HTTPS automático

---

## Opción 3: Despliegue en Vercel ⚠️

**Nota:** Vercel requiere configuración especial para Puppeteer. Puede ser más complejo.

### Paso 1: Instalar Vercel CLI

```bash
npm i -g vercel
```

### Paso 2: Configurar proyecto

El archivo `vercel.json` ya está creado. Vercel necesita usar un servicio externo para Puppeteer o configurar funciones serverless especiales.

### Paso 3: Desplegar

```bash
vercel
```

### ⚠️ Limitaciones de Vercel:
- Puppeteer requiere configuración adicional
- Puede necesitar usar `@sparticuz/chromium` en lugar de Puppeteer estándar
- Timeout limitado en plan gratuito (10 segundos)
- Mejor para servicios sin Puppeteer

**Recomendación:** Usa Render.com o Railway para este servicio.

---

## Opción 4: Despliegue en Railway.app 🚂

### Paso 1: Instalar Railway CLI

```bash
npm i -g @railway/cli
```

### Paso 2: Login

```bash
railway login
```

### Paso 3: Inicializar proyecto

```bash
railway init
```

### Paso 4: Desplegar

```bash
railway up
```

Railway detectará automáticamente Node.js y desplegará tu servicio.

### Paso 5: Obtener URL

```bash
railway domain
```

O desde el dashboard de Railway.

---

## 🧪 Probar el servicio

Una vez desplegado, prueba con:

```bash
# Health check
curl https://tu-url.com/health

# Generar PDF
curl -X POST https://tu-url.com/api/generar-pdf \
  -H "Content-Type: application/json" \
  -d @ejemplo-datos.json \
  --output cotizacion-test.pdf
```

---

## 📊 Comparación de Opciones

| Característica | ngrok | Render | Vercel | Railway |
|---------------|-------|--------|--------|---------|
| **URL Permanente** | ❌ (gratis) | ✅ | ✅ | ✅ |
| **Fácil Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Puppeteer** | ✅ | ✅ | ⚠️ | ✅ |
| **Plan Gratuito** | ✅ | ✅ | ✅ | ✅ |
| **Auto Deploy** | ❌ | ✅ | ✅ | ✅ |
| **Mejor para** | Pruebas | Producción | Frontend | Full-stack |

---

## 🎯 Recomendación Final

1. **Para pruebas rápidas:** ngrok
2. **Para producción:** Render.com (más fácil y confiable)
3. **Alternativa:** Railway.app

¿Necesitas ayuda con algún paso específico?
