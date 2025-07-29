const puppeteer = require('puppeteer');

async function verifyParticles() {
  console.log('🔍 VERIFICANDO ANIMACIÓN DE PARTÍCULAS\n');
  
  let browser;
  try {
    // Iniciar navegador
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navegar a la página
    console.log('📱 Navegando a http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    // Esperar a que se cargue el canvas
    console.log('⏳ Esperando a que se cargue el canvas...');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Verificar que el canvas existe
    const canvasExists = await page.$('canvas');
    if (canvasExists) {
      console.log('✅ Canvas encontrado en la página');
      
      // Verificar las dimensiones del canvas
      const canvasDimensions = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        return {
          width: canvas.width,
          height: canvas.height,
          styleWidth: canvas.style.width,
          styleHeight: canvas.style.height
        };
      });
      
      console.log('📐 Dimensiones del canvas:', canvasDimensions);
      
      // Verificar que el canvas está visible
      const isVisible = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const rect = canvas.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      if (isVisible) {
        console.log('✅ Canvas está visible y tiene dimensiones');
      } else {
        console.log('⚠️ Canvas no está visible');
      }
      
      // Verificar que hay contenido en el canvas
      const hasContent = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data.some(pixel => pixel !== 0);
      });
      
      if (hasContent) {
        console.log('✅ Canvas tiene contenido (partículas visibles)');
      } else {
        console.log('⚠️ Canvas no tiene contenido visible');
      }
      
    } else {
      console.log('❌ Canvas no encontrado en la página');
    }
    
    // Tomar una captura de pantalla
    await page.screenshot({ 
      path: 'particles-verification.png',
      fullPage: true 
    });
    console.log('📸 Captura de pantalla guardada como particles-verification.png');
    
  } catch (error) {
    console.error('💥 Error durante la verificación:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

if (require.main === module) {
  verifyParticles();
}

module.exports = { verifyParticles }; 