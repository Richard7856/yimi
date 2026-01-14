# 🔧 Instrucciones para Desplegar en Render

## Problema Resuelto: Chrome/Chromium en Render

Render no incluye Chrome por defecto. Hemos configurado el código para usar `@sparticuz/chromium` que es compatible con entornos serverless.

## Pasos para Actualizar el Despliegue

### 1. Actualizar el código en tu repositorio

```bash
git add .
git commit -m "Fix: Usar @sparticuz/chromium para Render"
git push
```

### 2. Render detectará automáticamente los cambios

Render redeployará automáticamente cuando hagas push a tu repositorio.

### 3. Si necesitas redeployar manualmente

1. Ve a tu dashboard de Render
2. Click en tu servicio `yimi-99u9`
3. Click en "Manual Deploy" → "Deploy latest commit"

## Cambios Realizados

- ✅ Agregado `@sparticuz/chromium` para entornos serverless
- ✅ Cambiado a `puppeteer-core` en lugar de `puppeteer`
- ✅ Detección automática de entorno (producción vs desarrollo)
- ✅ Configuración optimizada para Render

## Verificar que Funciona

Después del redeploy, prueba con:

```bash
curl -X POST https://yimi-99u9.onrender.com/api/generar-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "action": "quote",
    "lead_data": {
      "nombre": "Richard",
      "telefono": "5555555555",
      "correo": "prueba@gmail.com",
      "empresa": null,
      "proyecto": null
    },
    "product_data": {
      "width_cm": 10,
      "height_cm": 10,
      "quantity": 1500
    }
  }' \
  --output test.pdf
```

## Notas Importantes

- El primer deploy puede tardar más tiempo (descarga de Chromium)
- Los PDFs generados funcionan igual que antes
- El código funciona tanto en local como en Render
