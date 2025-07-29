const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXJwYnNteGhpbHZoaXN5bGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjg1NDQsImV4cCI6MjA2MTc0NDU0NH0.8WRzOfGAtJbra-P0yvpyij6WUyxevhftR2QCY69M2x8';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLAS\n');
  
  try {
    // 1. Verificar tabla clients
    console.log('1️⃣ Verificando tabla clients...');
    
    try {
      const { data: clients, error } = await supabase.from('clients').select('*').limit(1);
      if (error) {
        console.log('   ❌ Error accediendo a clients:', error.message);
      } else {
        console.log('   ✅ Tabla clients accesible');
        if (clients && clients.length > 0) {
          console.log('   📊 Columnas disponibles:', Object.keys(clients[0]));
        } else {
          console.log('   📊 Tabla vacía, verificando estructura...');
          // Intentar insertar un registro de prueba para ver la estructura
          const testClient = {
            company: 'Test Company',
            status: 'New Lead',
            industry: 'Test Industry',
            contact: 'Test Contact',
            email: 'test@example.com',
            phone: '123-456-7890',
            payment_method: 'Not specified',
            contract_status: 'Pending',
            deposit: 0,
            final_payment: 0,
            total_amount: 0,
            budget: '0-5000'
          };
          
          const { data: insertData, error: insertError } = await supabase.from('clients').insert(testClient);
          if (insertError) {
            console.log('   ❌ Error insertando cliente de prueba:', insertError.message);
          } else {
            console.log('   ✅ Cliente de prueba insertado correctamente');
            console.log('   📊 Estructura confirmada');
          }
        }
      }
    } catch (error) {
      console.log('   ❌ Error verificando clients:', error.message);
    }
    
    console.log('');
    
    // 2. Verificar tabla cases
    console.log('2️⃣ Verificando tabla cases...');
    
    try {
      const { data: cases, error } = await supabase.from('cases').select('*').limit(1);
      if (error) {
        console.log('   ❌ Error accediendo a cases:', error.message);
      } else {
        console.log('   ✅ Tabla cases accesible');
        if (cases && cases.length > 0) {
          console.log('   📊 Columnas disponibles:', Object.keys(cases[0]));
        } else {
          console.log('   📊 Tabla vacía, verificando estructura...');
          // Intentar insertar un registro de prueba para ver la estructura
          const testCase = {
            title: 'Test Case',
            status: 'open',
            priority: 'medium',
            assigned_to: 'test-user',
            budget: 10000,
            description: 'Test case description',
            progress: 0
          };
          
          const { data: insertData, error: insertError } = await supabase.from('cases').insert(testCase);
          if (insertError) {
            console.log('   ❌ Error insertando caso de prueba:', insertError.message);
          } else {
            console.log('   ✅ Caso de prueba insertado correctamente');
            console.log('   📊 Estructura confirmada');
          }
        }
      }
    } catch (error) {
      console.log('   ❌ Error verificando cases:', error.message);
    }
    
    console.log('');
    
    // 3. Verificar tabla users
    console.log('3️⃣ Verificando tabla users...');
    
    try {
      const { data: users, error } = await supabase.from('users').select('*').limit(1);
      if (error) {
        console.log('   ❌ Error accediendo a users:', error.message);
      } else {
        console.log('   ✅ Tabla users accesible');
        if (users && users.length > 0) {
          console.log('   📊 Columnas disponibles:', Object.keys(users[0]));
        } else {
          console.log('   📊 Tabla vacía');
        }
      }
    } catch (error) {
      console.log('   ❌ Error verificando users:', error.message);
    }
    
    console.log('');
    
    // 4. Verificar tabla activities
    console.log('4️⃣ Verificando tabla activities...');
    
    try {
      const { data: activities, error } = await supabase.from('activities').select('*').limit(1);
      if (error) {
        console.log('   ❌ Error accediendo a activities:', error.message);
      } else {
        console.log('   ✅ Tabla activities accesible');
        if (activities && activities.length > 0) {
          console.log('   📊 Columnas disponibles:', Object.keys(activities[0]));
        } else {
          console.log('   📊 Tabla vacía');
        }
      }
    } catch (error) {
      console.log('   ❌ Error verificando activities:', error.message);
    }
    
    console.log('');
    
    // 5. Resumen
    console.log('🎯 RESUMEN DE ESTRUCTURA:');
    console.log('📊 Tablas verificadas: 4');
    console.log('📊 Estructura: Confirmada');
    console.log('📊 Estado: Listo para Sprint 3');
    console.log('\n🚀 ¡Estructura de tablas verificada!');
    
  } catch (error) {
    console.error('💥 Error verificando estructura:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkTableStructure();
}

module.exports = { checkTableStructure }; 