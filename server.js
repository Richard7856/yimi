// server.js
const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const app = express();

app.use(express.json({ limit: '10mb' }));

// ==========================================
// PLANTILLA HTML DEL PDF
// ==========================================
const generarHTML = (datos) => {
  const { datos_cliente, datos_cotizacion, fecha, ejecutivo, especificaciones, condiciones } = datos;
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización PYGSA</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: letter;
      margin: 1.5cm;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #333;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #e74c3c;
    }
    
    .logo-section h1 {
      font-size: 48pt;
      font-weight: bold;
      color: #e74c3c;
      margin: 0;
      line-height: 1;
    }
    
    .logo-section p {
      font-size: 9pt;
      color: #666;
      margin-top: 5px;
      letter-spacing: 2px;
    }
    
    .cotizacion-box {
      background: #f5f5f5;
      padding: 15px 20px;
      text-align: right;
      border-radius: 5px;
    }
    
    .cotizacion-box h2 {
      font-size: 18pt;
      color: #e74c3c;
      margin-bottom: 5px;
    }
    
    .cotizacion-box p {
      font-size: 9pt;
      color: #666;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 30px;
      font-size: 9pt;
    }
    
    .info-item {
      display: flex;
      padding: 8px;
      background: #fafafa;
      border-left: 3px solid #e74c3c;
    }
    
    .info-item strong {
      min-width: 120px;
      color: #555;
    }
    
    .info-item span {
      color: #333;
    }
    
    .producto-section {
      margin-bottom: 30px;
    }
    
    .producto-header {
      background: #e74c3c;
      color: white;
      padding: 12px 15px;
      font-size: 11pt;
      font-weight: bold;
      border-radius: 5px 5px 0 0;
    }
    
    .producto-content {
      border: 1px solid #ddd;
      border-top: none;
      padding: 20px;
      border-radius: 0 0 5px 5px;
    }
    
    .producto-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .imagen-placeholder {
      background: #f9f9f9;
      border: 2px dashed #ddd;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 9pt;
      border-radius: 5px;
    }
    
    .especificaciones {
      font-size: 9pt;
      line-height: 1.6;
    }
    
    .especificaciones p {
      margin-bottom: 8px;
    }
    
    .especificaciones strong {
      color: #e74c3c;
      display: inline-block;
      min-width: 100px;
    }
    
    .precios-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    .precios-table th,
    .precios-table td {
      padding: 10px;
      text-align: right;
      border-bottom: 1px solid #eee;
    }
    
    .precios-table th {
      background: #f5f5f5;
      color: #555;
      font-weight: bold;
      text-align: left;
    }
    
    .precios-table .total-row {
      background: #e74c3c;
      color: white;
      font-weight: bold;
      font-size: 12pt;
    }
    
    .condiciones-section {
      margin-top: 30px;
      padding: 20px;
      background: #fafafa;
      border-radius: 5px;
      font-size: 8.5pt;
      line-height: 1.5;
    }
    
    .condiciones-section h3 {
      color: #e74c3c;
      font-size: 10pt;
      margin-bottom: 10px;
    }
    
    .condiciones-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .condicion-item {
      padding: 10px;
      background: white;
      border-left: 3px solid #e74c3c;
      border-radius: 3px;
    }
    
    .condicion-item strong {
      display: block;
      color: #e74c3c;
      margin-bottom: 5px;
    }
    
    .texto-legal {
      text-align: justify;
      color: #666;
      line-height: 1.6;
      margin-top: 15px;
    }
    
    .footer {
      margin-top: 40px;
      text-align: center;
      padding-top: 20px;
      border-top: 2px solid #e74c3c;
    }
    
    .footer strong {
      display: block;
      color: #e74c3c;
      font-size: 11pt;
      margin-bottom: 5px;
    }
    
    .footer p {
      color: #666;
      font-size: 9pt;
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div class="header">
    <div class="logo-section">
      <h1>Pygsa</h1>
      <p>IMANES & PUBLICIDAD</p>
    </div>
    <div class="cotizacion-box">
      <h2>COTIZACIÓN</h2>
      <p>${ejecutivo || 'Sistema Automático'}</p>
    </div>
  </div>

  <!-- INFORMACIÓN DEL CLIENTE -->
  <div class="info-grid">
    <div class="info-item">
      <strong>FECHA:</strong>
      <span>${fecha}</span>
    </div>
    <div class="info-item">
      <strong>CLIENTE:</strong>
      <span>${datos_cliente.nombre}</span>
    </div>
    <div class="info-item">
      <strong>ATENCIÓN A:</strong>
      <span>${datos_cliente.atencion_a || datos_cliente.nombre}</span>
    </div>
    <div class="info-item">
      <strong>TELÉFONO:</strong>
      <span>${datos_cliente.telefono}</span>
    </div>
    <div class="info-item">
      <strong>CORREO:</strong>
      <span>${datos_cliente.correo}</span>
    </div>
    <div class="info-item">
      <strong>PROYECTO:</strong>
      <span>${datos_cliente.proyecto || `Imanes ${datos_cotizacion.medidas}CM`}</span>
    </div>
  </div>

  <!-- PRODUCTO -->
  <div class="producto-section">
    <div class="producto-header">
      PRODUCTO: ${especificaciones.tamaño}
    </div>
    <div class="producto-content">
      <div class="producto-grid">
        <div class="imagen-placeholder">
          [Imagen ilustrativa]
        </div>
        <div class="especificaciones">
          <p><strong>TAMAÑO:</strong><br>${especificaciones.tamaño}</p>
          <p><strong>SUSTRATO:</strong><br>${especificaciones.sustrato}</p>
          <p><strong>ACABADOS:</strong><br>${especificaciones.acabados}</p>
          <p><strong>EMPAQUE:</strong><br>${especificaciones.empaque}</p>
          ${datos_cotizacion.desglose_rangos ? 
            `<p><strong>NOTA:</strong> Precio calculado por suma de rangos (${datos_cotizacion.desglose_rangos.join(' + ')} cm²)</p>` 
            : ''}
        </div>
      </div>

      <!-- TABLA DE PRECIOS -->
      <table class="precios-table">
        <tr>
          <th>CANTIDAD</th>
          <th>PRECIO UNITARIO</th>
          <th>SUBTOTAL</th>
          <th>IVA (16%)</th>
          <th>TOTAL</th>
        </tr>
        <tr>
          <td style="text-align: left;">${datos_cotizacion.cantidad.toLocaleString('es-MX')} piezas</td>
          <td>$${datos_cotizacion.precio_unitario.toFixed(2)}</td>
          <td>$${datos_cotizacion.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>$${datos_cotizacion.iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="total-row">$${datos_cotizacion.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- CONDICIONES -->
  <div class="condiciones-section">
    <h3>CONDICIONES ESPECÍFICAS:</h3>
    <div class="condiciones-grid">
      <div class="condicion-item">
        <strong>DE PAGO</strong>
        ${condiciones.pago}
      </div>
      <div class="condicion-item">
        <strong>DE TIEMPO</strong>
        ${condiciones.tiempo_entrega}
      </div>
      <div class="condicion-item">
        <strong>LUGAR DE ENTREGA</strong>
        ${condiciones.lugar_entrega}
      </div>
    </div>
    <div class="condicion-item" style="width: 100%;">
      <strong>DE DISEÑO</strong>
      ${condiciones.diseño}
    </div>

    <h3 style="margin-top: 20px;">CONDICIONES GENERALES:</h3>
    <div class="texto-legal">
      La fecha de entrega es estimada y no implica ningún compromiso; La fecha de entrega se tomará a partir del envío de su orden de compra, autorización del 
      DISEÑO y el pago del anticipo correspondiente; La cantidad de piezas se sujetará a un margen de producción de más-menos 5%; Las órdenes de inserción, 
      correcciones y/o cancelaciones deberán hacerse por escrito; Una vez realizado el pedido, las cancelaciones generarán recargos de por lo menos 50% del valor de 
      la orden de compra. Esta cotización tiene validez de 15 días naturales. Las URGENCIAS generan un 50% adicional al precio estipulado. No se acepta efectivo. Los 
      pagos deben realizarse en BBVA a nombre de Pygsa Advertising S.A. de C.V. CUENTA CLABE 012180001696458371. © Pygsa Advertising S.A. de C.V. 2011, Todos los derechos 
      reservados.
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <strong>¡Siempre mejor que la última vez!</strong>
    <p>WWW.PYGSA.COM</p>
  </div>
</body>
</html>
  `;
};

// ==========================================
// FUNCIÓN PARA TRANSFORMAR DATOS DE N8N
// ==========================================
const transformarDatosN8N = (datosN8N) => {
  // Si ya viene en el formato esperado, retornarlo tal cual
  if (datosN8N.datos_cliente && datosN8N.datos_cotizacion) {
    return datosN8N;
  }
  
  // Transformar desde formato n8n
  if (datosN8N.action === 'quote' && datosN8N.lead_data && datosN8N.product_data) {
    const { lead_data, product_data } = datosN8N;
    
    // Calcular área en cm²
    const area_cm2 = product_data.width_cm * product_data.height_cm;
    const cantidad = product_data.quantity || 1500;
    
    // Tabla de precios por rango de área (precio por cm²)
    // Puedes ajustar estos valores según tu tabla de precios real
    const calcularPrecioUnitario = (area) => {
      if (area <= 25) return 0.15;      // 0-25 cm²
      if (area <= 50) return 0.12;      // 26-50 cm²
      if (area <= 100) return 0.10;     // 51-100 cm²
      if (area <= 200) return 0.08;     // 101-200 cm²
      return 0.06;                       // >200 cm²
    };
    
    const precioPorCm2 = calcularPrecioUnitario(area_cm2);
    const precio_unitario = precioPorCm2 * area_cm2;
    const subtotal = precio_unitario * cantidad;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    // Formato de medidas
    const medidas = `${product_data.width_cm}x${product_data.height_cm}`;
    
    return {
      datos_cliente: {
        nombre: lead_data.nombre || lead_data.empresa || 'Cliente',
        atencion_a: lead_data.nombre || lead_data.empresa || 'Cliente',
        telefono: lead_data.telefono || '',
        correo: lead_data.correo || '',
        proyecto: lead_data.proyecto || `Imanes ${medidas}CM`
      },
      datos_cotizacion: {
        cantidad: cantidad,
        precio_unitario: precio_unitario,
        subtotal: subtotal,
        iva: iva,
        total: total,
        medidas: medidas,
        desglose_rangos: null
      },
      fecha: new Date().toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      ejecutivo: datosN8N.ejecutivo || 'Sistema Automático',
      especificaciones: {
        tamaño: `${product_data.width_cm}x${product_data.height_cm} cm (${area_cm2} cm²)`,
        sustrato: 'Imán flexible de alta calidad',
        acabados: 'Laminado mate, esquinas redondeadas',
        empaque: 'Caja de cartón corrugado'
      },
      condiciones: {
        pago: datosN8N.condiciones?.pago || '50% anticipo al confirmar orden, 50% restante contra entrega',
        tiempo_entrega: datosN8N.condiciones?.tiempo_entrega || '10-12 días hábiles a partir de la aprobación del diseño',
        lugar_entrega: datosN8N.condiciones?.lugar_entrega || 'Instalaciones del cliente',
        diseño: datosN8N.condiciones?.diseño || 'Incluido sin costo adicional. Máximo 2 revisiones sin cargo'
      }
    };
  }
  
  // Si no coincide con ningún formato, retornar error
  throw new Error('Formato de datos no reconocido');
};

// ==========================================
// ENDPOINT PARA GENERAR PDF
// ==========================================
app.post('/api/generar-pdf', async (req, res) => {
  try {
    console.log('📥 Recibiendo solicitud de PDF...');
    
    const datosRaw = req.body;
    
    // Transformar datos si vienen de n8n
    let datos;
    try {
      datos = transformarDatosN8N(datosRaw);
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error.message || 'Formato de datos no válido'
      });
    }
    
    // Validar datos requeridos después de la transformación
    if (!datos.datos_cliente || !datos.datos_cotizacion) {
      return res.status(400).json({
        error: true,
        message: 'Faltan datos requeridos (datos_cliente o datos_cotizacion)'
      });
    }
    
    console.log('✅ Datos validados');
    
    // Generar HTML
    const html = generarHTML(datos);
    console.log('📄 HTML generado');
    
    // Generar PDF con Puppeteer
    console.log('🚀 Iniciando Puppeteer...');
    
    // Configurar Chromium para Render/serverless
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
    let browser;
    
    if (isProduction) {
      // Usar @sparticuz/chromium para Render/serverless
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--hide-scrollbars',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Desarrollo local - usar Puppeteer normal
      try {
        // Intentar usar puppeteer normal primero
        const puppeteerFull = require('puppeteer');
        browser = await puppeteerFull.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ]
        });
      } catch (error) {
        // Si falla, usar chromium
        browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            '--hide-scrollbars',
            '--disable-web-security'
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
      }
    }
    
    const page = await browser.newPage();
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('📝 Generando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });
    
    await browser.close();
    console.log('✅ PDF generado correctamente');
    
    // Nombre del archivo
    const timestamp = Date.now();
    const filename = `Cotizacion_PYGSA_${datos.datos_cliente.nombre.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    
    // Enviar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
    
    console.log(`📤 PDF enviado: ${filename}`);
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    res.status(500).json({
      error: true,
      message: 'Error al generar PDF',
      detalle: error.message
    });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PYGSA PDF Generator',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🎨 PYGSA PDF Generator Server       ║
║   📡 Puerto: ${PORT}                      ║
║   ✅ Estado: Activo                    ║
╚═══════════════════════════════════════╝
  `);
});
