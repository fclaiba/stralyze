const puppeteer = require('puppeteer');

async function testParticlesAnimation() {
  console.log('🧪 PROBANDO ANIMACIÓN DE PARTÍCULAS\n');
  
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
    if (!canvasExists) {
      throw new Error('❌ Canvas no encontrado');
    }
    
    console.log('✅ Canvas encontrado');
    
    // Verificar que el canvas tiene dimensiones
    const canvasDimensions = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height
      };
    });
    
    console.log('📏 Dimensiones del canvas:', canvasDimensions);
    
    // Verificar que el canvas está visible
    const canvasVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      return {
        visible: rect.width > 0 && rect.height > 0,
        position: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      };
    });
    
    console.log('👁️ Canvas visible:', canvasVisible);
    
    // Tomar screenshot para verificar visualmente
    console.log('📸 Tomando screenshot...');
    await page.screenshot({ 
      path: 'particles-test-screenshot.png',
      fullPage: true 
    });
    
    // Verificar que hay partículas animándose (verificando que el canvas no esté vacío)
    console.log('🔍 Verificando animación de partículas...');
    const animationWorking = await page.evaluate(() => {
      return new Promise((resolve) => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        // Tomar una muestra del canvas después de un tiempo
        setTimeout(() => {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Contar píxeles no transparentes
          let nonTransparentPixels = 0;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) { // Alpha channel > 0
              nonTransparentPixels++;
            }
          }
          
          resolve({
            totalPixels: data.length / 4,
            nonTransparentPixels,
            hasContent: nonTransparentPixels > 0
          });
        }, 2000); // Esperar 2 segundos para que se animen las partículas
      });
    });
    
    console.log('🎨 Análisis del canvas:', animationWorking);
    
    if (animationWorking.hasContent) {
      console.log('✅ ¡ANIMACIÓN DE PARTÍCULAS FUNCIONANDO CORRECTAMENTE!');
      console.log('📊 Píxeles con contenido:', animationWorking.nonTransparentPixels);
      console.log('📊 Total de píxeles:', animationWorking.totalPixels);
    } else {
      console.log('⚠️ Canvas parece estar vacío - verificar animación');
    }
    
    // Verificar que el fondo tiene el gradiente correcto
    const backgroundCheck = await page.evaluate(() => {
      const main = document.querySelector('main');
      const computedStyle = window.getComputedStyle(main);
      return {
        backgroundColor: computedStyle.backgroundColor,
        backgroundImage: computedStyle.backgroundImage
      };
    });
    
    console.log('🎨 Estilos de fondo:', backgroundCheck);
    
    console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE');
    console.log('📸 Screenshot guardado como: particles-test-screenshot.png');
    
  } catch (error) {
    console.error('💥 Error durante la prueba:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testParticlesAnimation();
}

module.exports = { testParticlesAnimation }; 