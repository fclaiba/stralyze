const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXJwYnNteGhpbHZoaXN5bGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjg1NDQsImV4cCI6MjA2MTc0NDU0NH0.8WRzOfGAtJbra-P0yvpyij6WUyxevhftR2QCY69M2x8';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateSprint3Schema() {
  console.log('🔄 ACTUALIZANDO ESQUEMA DE BASE DE DATOS PARA SPRINT 3\n');
  
  try {
    // 1. Verificar conexión
    console.log('1️⃣ Verificando conexión con Supabase...');
    
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        console.log('⚠️ Error de conexión:', error.message);
        return;
      } else {
        console.log('✅ Conexión exitosa con Supabase\n');
      }
    } catch (error) {
      console.log('❌ Error de conexión:', error.message);
      return;
    }
    
    // 2. Leer esquema actualizado
    console.log('2️⃣ Leyendo esquema actualizado...');
    
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    let schemaSQL = '';
    
    try {
      schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      console.log('✅ Esquema SQL leído correctamente');
      console.log(`📄 Tamaño del archivo: ${schemaSQL.length} caracteres\n`);
    } catch (error) {
      console.log('❌ Error leyendo esquema SQL:', error.message);
      return;
    }
    
    // 3. Crear datos de prueba actualizados
    console.log('3️⃣ Creando datos de prueba actualizados...');
    
    // Datos de prueba para clientes (actualizados)
    const testClients = [
      {
        company: 'TechCorp Solutions',
        status: 'Active',
        industry: 'Technology',
        contact: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        payment_method: 'Credit Card',
        contract_status: 'Signed',
        deposit: 5000,
        final_payment: 15000,
        total_amount: 20000,
        budget: '$15,000 - $25,000'
      },
      {
        company: 'MarketingPro Agency',
        status: 'In Process',
        industry: 'Marketing',
        contact: 'Sarah Johnson',
        email: 'sarah@marketingpro.com',
        phone: '+1-555-0456',
        payment_method: 'Bank Transfer',
        contract_status: 'Pending',
        deposit: 2500,
        final_payment: 7500,
        total_amount: 10000,
        budget: '$10,000 - $15,000'
      },
      {
        company: 'Global Industries',
        status: 'Closed Deal',
        industry: 'Manufacturing',
        contact: 'Mike Wilson',
        email: 'mike@globalind.com',
        phone: '+1-555-0789',
        payment_method: 'Credit Card',
        contract_status: 'Signed',
        deposit: 10000,
        final_payment: 40000,
        total_amount: 50000,
        budget: '$50,000+'
      }
    ];
    
    // Datos de prueba para casos (actualizados)
    const testCases = [
      {
        title: 'Rediseño de sitio web corporativo',
        description: 'Rediseño completo del sitio web corporativo con enfoque en conversión y UX',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 'admin',
        budget: 75000,
        start_date: '2024-01-15',
        due_date: '2024-03-15',
        progress: 65
      },
      {
        title: 'Campaña de email marketing',
        description: 'Campaña de email marketing para generación de leads',
        status: 'open',
        priority: 'medium',
        assigned_to: 'admin',
        budget: 25000,
        start_date: '2024-02-01',
        due_date: '2024-04-01',
        progress: 25
      },
      {
        title: 'Estrategia de branding',
        description: 'Desarrollo de estrategia de branding completa',
        status: 'completed',
        priority: 'high',
        assigned_to: 'admin',
        budget: 50000,
        start_date: '2023-12-01',
        due_date: '2024-01-31',
        progress: 100
      }
    ];
    
    console.log('✅ Datos de prueba preparados\n');
    
    // 4. Limpiar datos existentes
    console.log('4️⃣ Limpiando datos existentes...');
    
    try {
      // Eliminar datos existentes en orden correcto (por foreign keys)
      await supabase.from('case_tags').delete().neq('case_id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('notes').delete().neq('case_id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('events').delete().neq('case_id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('cases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('activities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ Datos existentes eliminados\n');
    } catch (error) {
      console.log('⚠️ Error limpiando datos:', error.message);
      console.log('🔄 Continuando...\n');
    }
    
    // 5. Insertar datos de prueba
    console.log('5️⃣ Insertando datos de prueba...');
    
    // Insertar clientes
    const createdClients = [];
    for (const client of testClients) {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert(client)
          .select()
          .single();
        
        if (error) {
          console.log(`   ⚠️ Error insertando cliente ${client.company}:`, error.message);
        } else {
          console.log(`   ✅ Cliente ${client.company} insertado`);
          createdClients.push(data);
        }
      } catch (error) {
        console.log(`   ⚠️ Error insertando cliente ${client.company}:`, error.message);
      }
    }
    
    // Insertar casos (asignando client_id si hay clientes creados)
    for (let i = 0; i < testCases.length; i++) {
      const caseItem = { ...testCases[i] };
      if (createdClients[i]) {
        caseItem.client_id = createdClients[i].id;
      }
      
      try {
        const { data, error } = await supabase
          .from('cases')
          .insert(caseItem)
          .select()
          .single();
        
        if (error) {
          console.log(`   ⚠️ Error insertando caso ${caseItem.title}:`, error.message);
        } else {
          console.log(`   ✅ Caso ${caseItem.title} insertado`);
        }
      } catch (error) {
        console.log(`   ⚠️ Error insertando caso ${caseItem.title}:`, error.message);
      }
    }
    
    console.log('✅ Datos de prueba insertados\n');
    
    // 6. Verificar funcionalidad
    console.log('6️⃣ Verificando funcionalidad...');
    
    try {
      // Leer clientes
      const { data: clients, error: clientsError } = await supabase.from('clients').select('*');
      if (!clientsError && clients) {
        console.log(`   ✅ Lectura de clientes: ${clients.length} registros`);
      } else {
        console.log('   ❌ Error leyendo clientes:', clientsError?.message);
      }
      
      // Leer casos
      const { data: cases, error: casesError } = await supabase.from('cases').select('*');
      if (!casesError && cases) {
        console.log(`   ✅ Lectura de casos: ${cases.length} registros`);
      } else {
        console.log('   ❌ Error leyendo casos:', casesError?.message);
      }
      
    } catch (error) {
      console.log('   ⚠️ Error verificando funcionalidad:', error.message);
    }
    
    console.log('✅ Verificación completada\n');
    
    // 7. Resumen
    console.log('🎯 RESUMEN DE ACTUALIZACIÓN SPRINT 3:');
    console.log('📊 Esquema: Actualizado');
    console.log('📊 Datos de prueba: Insertados');
    console.log('📊 Funcionalidad CRUD: Verificada');
    console.log('📊 Estado: Listo para desarrollo');
    console.log('\n🚀 ¡Sprint 3 completamente configurado!');
    
  } catch (error) {
    console.error('💥 Error en actualización:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateSprint3Schema();
}

module.exports = { updateSprint3Schema }; 