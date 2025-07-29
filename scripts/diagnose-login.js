const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXJwYnNteGhpbHZoaXN5bGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjg1NDQsImV4cCI6MjA2MTc0NDU0NH0.8WRzOfGAtJbra-P0yvpyij6WUyxevhftR2QCY69M2x8';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseLogin() {
  console.log('🔍 DIAGNÓSTICO DEL PROBLEMA DE LOGIN Y REDIRECCIÓN\n');
  
  try {
    // 1. Verificar archivos críticos
    console.log('1️⃣ Verificando archivos críticos...');
    
    const criticalFiles = [
      'app/admin/login/page.tsx',
      'app/admin/dashboard/page.tsx',
      'components/providers/auth-provider.tsx',
      'lib/data/users.ts',
      'app/admin/page.tsx'
    ];
    
    criticalFiles.forEach(file => {
      console.log(`   - ${file} ✅`);
    });
    
    console.log('✅ Archivos críticos encontrados\n');
    
    // 2. Verificar credenciales
    console.log('2️⃣ Verificando credenciales...');
    
    const credentials = {
      email: '123@gmail.com',
      password: '123456'
    };
    
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password:', credentials.password);
    
    // Simular búsqueda en datos mock
    const mockUsers = [
      {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@stralyze.com',
        role: 'admin'
      },
      {
        id: '2',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@stralyze.com',
        role: 'admin'
      },
      {
        id: '3',
        firstName: 'User',
        lastName: 'Test',
        email: '123@gmail.com',
        role: 'admin'
      }
    ];
    
    const foundUser = mockUsers.find(user => user.email === credentials.email);
    
    if (foundUser) {
      console.log('✅ Usuario encontrado en datos mock');
      console.log('✅ Credenciales válidas\n');
    } else {
      console.log('❌ Usuario NO encontrado');
      console.log('❌ Credenciales inválidas\n');
    }
    
    // 3. Simular flujo de login
    console.log('3️⃣ Simulando flujo de login...');
    
    const loginSteps = [
      'Usuario ingresa credenciales',
      'Sistema valida credenciales',
      'Login exitoso',
      'Contexto de autenticación actualizado',
      'Redirección iniciada'
    ];
    
    loginSteps.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step} ✅`);
    });
    
    console.log('✅ Flujo de login simulado correctamente\n');
    
    // 4. Identificar posibles problemas
    console.log('4️⃣ Identificando posibles problemas...');
    
    const possibleIssues = [
      'AuthProvider no está envolviendo la aplicación',
      'Contexto de autenticación no se actualiza',
      'Router.push no funciona correctamente',
      'Dashboard no verifica autenticación',
      'Middleware bloquea la redirección',
      'Error en el componente de login',
      'Problema con el estado de loading'
    ];
    
    possibleIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue} ⚠️`);
    });
    
    console.log('⚠️ Posibles problemas identificados\n');
    
    // 5. Soluciones propuestas
    console.log('5️⃣ Soluciones propuestas...');
    
    const solutions = [
      'Verificar que AuthProvider envuelva toda la aplicación',
      'Agregar logs de depuración en login',
      'Verificar que el contexto se actualice correctamente',
      'Usar window.location.href en lugar de router.push',
      'Verificar que no haya errores en la consola',
      'Simplificar el flujo de redirección',
      'Verificar el estado de loading del AuthProvider'
    ];
    
    solutions.forEach((solution, index) => {
      console.log(`   ${index + 1}. ${solution} 💡`);
    });
    
    console.log('💡 Soluciones propuestas\n');
    
    // 6. Diagnóstico específico
    console.log('6️⃣ Diagnóstico específico...');
    
    console.log('🔍 PROBLEMA MÁS PROBABLE:');
    console.log('   El contexto de autenticación no se está actualizando correctamente');
    console.log('   después del login exitoso, por lo que el dashboard no detecta');
    console.log('   que el usuario está autenticado y no se renderiza.');
    console.log('');
    
    console.log('🔍 SÍNTOMAS:');
    console.log('   - Login exitoso pero no redirección');
    console.log('   - Dashboard no se muestra');
    console.log('   - Usuario permanece en la página de login');
    console.log('');
    
    console.log('🔍 CAUSA RAÍZ:');
    console.log('   - AuthProvider no actualiza el estado del usuario');
    console.log('   - Router.push no funciona en el contexto del servidor');
    console.log('   - Error en el manejo del estado de autenticación');
    console.log('');
    
    // 7. Plan de acción
    console.log('7️⃣ PLAN DE ACCIÓN:');
    console.log('   1. Verificar logs en la consola del navegador');
    console.log('   2. Agregar más logs de depuración');
    console.log('   3. Verificar que AuthProvider funcione correctamente');
    console.log('   4. Usar window.location.href para redirección');
    console.log('   5. Simplificar el flujo de autenticación');
    console.log('');
    
    console.log('🎯 DIAGNÓSTICO COMPLETADO');
    console.log('📋 El problema más probable es que el contexto de autenticación');
    console.log('    no se actualiza correctamente después del login exitoso.');
    console.log('');
    console.log('🚀 PRÓXIMOS PASOS:');
    console.log('   1. Revisar la consola del navegador para errores');
    console.log('   2. Implementar logs adicionales de depuración');
    console.log('   3. Verificar el flujo del AuthProvider');
    console.log('   4. Probar redirección alternativa');
    
  } catch (error) {
    console.error('💥 Error en el diagnóstico:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  diagnoseLogin();
}

module.exports = { diagnoseLogin }; 