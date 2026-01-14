# 🎨 PYGSA PDF Generator

Servicio independiente para generar PDFs de cotizaciones PYGSA desde JSON. Este servicio puede desplegarse en cualquier plataforma de hosting separada de tu servidor principal.

## 🚀 Características

- ✅ Genera PDFs profesionales de cotizaciones
- ✅ Recibe datos JSON desde n8n u otros servicios
- ✅ Usa Puppeteer para renderizado de alta calidad
- ✅ Diseño responsivo y profesional
- ✅ Endpoint de health check incluido

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn

## 🛠️ Instalación Local

1. **Clonar o descargar el proyecto**
```bash
cd testscrip
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno (opcional)**
```bash
cp .env.example .env
# Editar .env si necesitas cambiar el puerto
```

4. **Iniciar el servidor**
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints

### `POST /api/generar-pdf`

Genera un PDF de cotización desde JSON.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "datos_cliente": {
    "nombre": "Nombre del Cliente",
    "atencion_a": "Persona de contacto",
    "telefono": "1234567890",
    "correo": "cliente@ejemplo.com",
    "proyecto": "Nombre del proyecto"
  },
  "datos_cotizacion": {
    "cantidad": 1000,
    "precio_unitario": 15.50,
    "subtotal": 15500.00,
    "iva": 2480.00,
    "total": 17980.00,
    "medidas": "10x15",
    "desglose_rangos": ["5x5", "3x5"]
  },
  "fecha": "15/01/2024",
  "ejecutivo": "Juan Pérez",
  "especificaciones": {
    "tamaño": "10x15 cm",
    "sustrato": "Imán flexible",
    "acabados": "Laminado mate",
    "empaque": "Caja de cartón"
  },
  "condiciones": {
    "pago": "50% anticipo, 50% contra entrega",
    "tiempo_entrega": "10-12 días hábiles",
    "lugar_entrega": "Instalaciones del cliente",
    "diseño": "Incluido sin costo adicional"
  }
}
```

**Respuesta:**
- **200 OK**: Archivo PDF descargable
- **400 Bad Request**: JSON con error si faltan datos requeridos
- **500 Internal Server Error**: JSON con error si hay un problema al generar el PDF

### `GET /health`

Verifica el estado del servicio.

**Respuesta:**
```json
{
  "status": "ok",
  "service": "PYGSA PDF Generator",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🐳 Despliegue con Docker

### Construir la imagen
```bash
docker build -t pygsa-pdf-generator .
```

### Ejecutar el contenedor
```bash
docker run -p 3000:3000 pygsa-pdf-generator
```

## ☁️ Opciones de Despliegue

### Render.com

1. Conecta tu repositorio Git a Render
2. Selecciona "Web Service"
3. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`
4. Render detectará automáticamente el Dockerfile si prefieres usar Docker

### Railway.app

1. Conecta tu repositorio Git a Railway
2. Railway detectará automáticamente Node.js
3. El servicio se desplegará automáticamente

### Fly.io

1. Instala Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Inicia sesión: `fly auth login`
3. Lanza la app: `fly launch`
4. Despliega: `fly deploy`

### Heroku

1. Instala Heroku CLI
2. Login: `heroku login`
3. Crear app: `heroku create tu-app-nombre`
4. Desplegar: `git push heroku main`

**Nota para Heroku**: Necesitarás el buildpack de Puppeteer:
```bash
heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
heroku buildpacks:add heroku/nodejs
```

## 🔗 Integración con n8n

En n8n, agrega un nodo HTTP Request:

1. **Method**: `POST`
2. **URL**: `https://tu-servidor.com/api/generar-pdf`
3. **Headers**:
   ```
   Content-Type: application/json
   ```
4. **Body**: Tu JSON con los datos de la cotización
5. **Response Format**: `File`
6. **Output Property**: `data` (o el nombre que prefieras)

El PDF se descargará automáticamente y podrás guardarlo o enviarlo por email.

## 📝 Estructura del Proyecto

```
testscrip/
├── server.js          # Servidor Express principal
├── package.json       # Dependencias y scripts
├── Dockerfile         # Configuración Docker
├── .env.example       # Ejemplo de variables de entorno
├── .gitignore         # Archivos a ignorar en Git
└── README.md          # Esta documentación
```

## 🔒 Seguridad (Opcional)

Para agregar autenticación básica, puedes modificar `server.js` para incluir un middleware de validación de API key:

```javascript
// Middleware de autenticación (opcional)
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

// Usar en el endpoint
app.post('/api/generar-pdf', authenticate, async (req, res) => {
  // ... código existente
});
```

Luego en n8n, agrega el header:
```
X-API-Key: tu_token_secreto
```

## 🐛 Troubleshooting

### Error: "Failed to launch the browser process"

Asegúrate de que el servidor tenga instaladas las dependencias de Chrome/Chromium. El Dockerfile incluye todas las dependencias necesarias.

### PDF se genera pero está vacío

Verifica que todos los datos requeridos estén presentes en el JSON enviado.

### Timeout al generar PDF

Aumenta el timeout en la línea 280 de `server.js`:
```javascript
timeout: 60000  // 60 segundos
```

## 📄 Licencia

ISC

---

**¿Necesitas ayuda?** Revisa los logs del servidor para más detalles sobre errores.
