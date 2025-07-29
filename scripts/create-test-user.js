const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

// Crear cliente de Supabase con service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    console.log('🚀 Creando usuario de prueba...');
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@stralyze.com',
      password: 'test123456',
      email_confirm: true,
      user_metadata: {
        firstName: 'Test',
        lastName: 'User',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      return;
    }

    if (!authData.user) {
      console.error('❌ No se pudo crear el usuario');
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);

    // Crear registro en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@stralyze.com',
        role: 'admin',
      }])
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creando perfil de usuario:', userError);
      return;
    }

    console.log('✅ Perfil de usuario creado:', userData);
    console.log('🎉 Usuario de prueba creado exitosamente!');
    console.log('📧 Email: test@stralyze.com');
    console.log('🔑 Password: test123456');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser }; 