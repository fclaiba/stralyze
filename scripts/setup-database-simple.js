const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase usando el cliente anónimo
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXJwYnNteGhpbHZoaXN5bGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjg1NDQsImV4cCI6MjA2MTc0NDU0NH0.8WRzOfGAtJbra-P0yvpyij6WUyxevhftR2QCY69M2x8';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabaseSimple() {
  console.log('🚀 Iniciando configuración simple de base de datos...');
  
  try {
    // Verificar conexión
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('📋 La tabla users no existe, creando esquema...');
      await createTables();
    } else {
      console.log('✅ La tabla users ya existe');
    }
    
    // Crear usuario de prueba
    await createTestUser();
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

async function createTables() {
  console.log('🔨 Creando tablas...');
  
  // Crear tabla users
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (error) {
      console.log('⚠️ Error creando tabla users:', error.message);
    } else {
      console.log('✅ Tabla users creada');
    }
  } catch (e) {
    console.log('⚠️ No se pudo crear tabla users:', e.message);
  }
  
  // Crear tabla clients
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          company VARCHAR(255),
          status VARCHAR(50) DEFAULT 'prospect',
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (error) {
      console.log('⚠️ Error creando tabla clients:', error.message);
    } else {
      console.log('✅ Tabla clients creada');
    }
  } catch (e) {
    console.log('⚠️ No se pudo crear tabla clients:', e.message);
  }
}

async function createTestUser() {
  console.log('👤 Creando usuario de prueba...');
  
  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@stralyze.com')
      .single();
    
    if (existingUser) {
      console.log('✅ Usuario de prueba ya existe');
      return;
    }
    
    // Crear usuario de prueba
    const { data, error } = await supabase
      .from('users')
      .insert([{
        firstName: 'Test',
        lastName: 'User',
        email: 'test@stralyze.com',
        role: 'admin',
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creando usuario de prueba:', error);
    } else {
      console.log('✅ Usuario de prueba creado:', data);
    }
    
  } catch (error) {
    console.error('💥 Error creando usuario de prueba:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabaseSimple();
}

module.exports = { setupDatabaseSimple }; 