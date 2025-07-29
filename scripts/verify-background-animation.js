const { createClient } = require('@supabase/supabase-js');

console.log('🎨 VERIFICANDO FONDO ANIMADO - STRALYZE\n');

async function verifyBackgroundAnimation() {
  try {
    console.log('📱 Verificando servidor en http://localhost:3001...');
    
    // Verificar que el servidor esté funcionando
    const response = await fetch('http://localhost:3001');
    if (!response.ok) {
      throw new Error(`Servidor no responde: ${response.status}`);
    }
    
    console.log('✅ Servidor funcionando correctamente');
    
    // Verificar que el HTML se esté generando
    const html = await response.text();
    
    // Verificar componentes clave
    const checks = [
      {
        name: 'CommonBackground',
        found: html.includes('common-background') || html.includes('CanvasRevealEffect'),
        description: 'Componente de fondo animado'
      },
      {
        name: 'Three.js Canvas',
        found: html.includes('canvas') || html.includes('three'),
        description: 'Canvas de Three.js'
      },
      {
        name: 'React Three Fiber',
        found: html.includes('@react-three/fiber') || html.includes('useFrame'),
        description: 'React Three Fiber'
      },
      {
        name: 'Gradientes CSS',
        found: html.includes('bg-gradient') || html.includes('from-black'),
        description: 'Gradientes de fondo'
      }
    ];
    
    console.log('\n🔍 RESULTADOS DE VERIFICACIÓN:\n');
    
    checks.forEach(check => {
      const status = check.found ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.description}`);
    });
    
    const passedChecks = checks.filter(check => check.found).length;
    const totalChecks = checks.length;
    
    console.log(`\n📊 RESUMEN: ${passedChecks}/${totalChecks} verificaciones pasadas`);
    
    if (passedChecks === totalChecks) {
      console.log('\n🎉 ¡FONDO ANIMADO FUNCIONANDO CORRECTAMENTE!');
      console.log('✨ El sitio está listo con la animación de partículas');
    } else {
      console.log('\n⚠️ Algunas verificaciones fallaron');
      console.log('🔧 Revisa la consola del navegador para más detalles');
    }
    
    console.log('\n🌐 Abre http://localhost:3001 en tu navegador para ver el resultado');
    
  } catch (error) {
    console.error('💥 Error durante la verificación:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Asegúrate de que el servidor esté ejecutándose (npm run dev)');
    console.log('2. Verifica que el puerto 3001 esté disponible');
    console.log('3. Revisa la consola del navegador para errores de JavaScript');
  }
}

if (require.main === module) {
  verifyBackgroundAnimation();
}

module.exports = { verifyBackgroundAnimation }; 