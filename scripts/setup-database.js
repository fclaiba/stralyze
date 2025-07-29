const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

// Crear cliente de Supabase con service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuración de base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Esquema SQL cargado correctamente');
    
    // Ejecutar el SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      
      // Si no existe la función exec_sql, intentar ejecutar directamente
      console.log('🔄 Intentando método alternativo...');
      
      // Dividir el SQL en comandos individuales
      const commands = sqlContent.split(';').filter(cmd => cmd.trim());
      
      for (const command of commands) {
        if (command.trim()) {
          try {
            const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command });
            if (cmdError) {
              console.log(`⚠️ Comando saltado: ${command.substring(0, 50)}...`);
            }
          } catch (e) {
            console.log(`⚠️ Error en comando: ${e.message}`);
          }
        }
      }
    } else {
      console.log('✅ Esquema de base de datos ejecutado correctamente');
    }
    
    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...');
    
    const tables = [
      'users', 'clients', 'cases', 'tags', 'case_tags', 'notes', 
      'events', 'event_attendees', 'templates', 'campaigns', 
      'notifications', 'settings', 'support_tickets', 'form_leads'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabla ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabla ${table}: OK`);
        }
      } catch (e) {
        console.log(`❌ Tabla ${table}: ${e.message}`);
      }
    }
    
    console.log('🎉 Configuración de base de datos completada');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 