const fetch = require('node-fetch');

// Configuración de Supabase
const SUPABASE_URL = 'https://raarpbsmxhilvhisylea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYXJwYnNteGhpbHZoaXN5bGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjg1NDQsImV4cCI6MjA2MTc0NDU0NH0.8WRzOfGAtJbra-P0yvpyij6WUyxevhftR2QCY69M2x8';

async function createTable(tableName, columns) {
  try {
    console.log(`Creating table: ${tableName}`);
    
    // Crear la tabla usando la API REST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(columns)
    });

    if (response.ok) {
      console.log(`✅ Table ${tableName} created successfully`);
    } else {
      console.log(`⚠️  Table ${tableName} might already exist or failed to create`);
    }
  } catch (error) {
    console.error(`❌ Error creating table ${tableName}:`, error.message);
  }
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...');

  // Crear tablas una por una
  await createTable('users', {
    id: 'uuid',
    email: 'text',
    password: 'text',
    name: 'text',
    role: 'text',
    created_at: 'timestamp'
  });

  await createTable('clients', {
    id: 'uuid',
    name: 'text',
    email: 'text',
    phone: 'text',
    company: 'text',
    created_at: 'timestamp'
  });

  await createTable('cases', {
    id: 'uuid',
    title: 'text',
    client_id: 'uuid',
    status: 'text',
    priority: 'text',
    assigned_to: 'uuid',
    budget: 'numeric',
    start_date: 'date',
    due_date: 'date',
    description: 'text',
    progress: 'integer',
    created_at: 'timestamp'
  });

  await createTable('tags', {
    id: 'uuid',
    name: 'text',
    created_at: 'timestamp'
  });

  await createTable('case_tags', {
    case_id: 'uuid',
    tag_id: 'uuid'
  });

  await createTable('notes', {
    id: 'uuid',
    case_id: 'uuid',
    content: 'text',
    created_at: 'timestamp'
  });

  await createTable('events', {
    id: 'uuid',
    title: 'text',
    case_id: 'uuid',
    date: 'date',
    time: 'text',
    duration: 'integer',
    type: 'text',
    priority: 'text',
    location: 'text',
    is_all_day: 'boolean',
    color: 'text',
    recurring: 'text',
    created_at: 'timestamp'
  });

  await createTable('event_attendees', {
    event_id: 'uuid',
    user_id: 'uuid'
  });

  await createTable('templates', {
    id: 'uuid',
    name: 'text',
    subject: 'text',
    body: 'text',
    created_at: 'timestamp'
  });

  await createTable('campaigns', {
    id: 'uuid',
    name: 'text',
    template_id: 'uuid',
    segment: 'text',
    created_by: 'uuid',
    created_at: 'timestamp'
  });

  await createTable('notifications', {
    id: 'uuid',
    user_id: 'uuid',
    event_id: 'uuid',
    case_id: 'uuid',
    message: 'text',
    sent_at: 'timestamp'
  });

  await createTable('settings', {
    id: 'uuid',
    user_id: 'uuid',
    key: 'text',
    value: 'text',
    created_at: 'timestamp'
  });

  await createTable('support_tickets', {
    id: 'uuid',
    user_id: 'uuid',
    subject: 'text',
    message: 'text',
    status: 'text',
    created_at: 'timestamp'
  });

  await createTable('form_leads', {
    id: 'uuid',
    type: 'text',
    name: 'text',
    email: 'text',
    phone: 'text',
    message: 'text',
    created_at: 'timestamp'
  });

  // Crear el usuario admin
  try {
    const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: '123@gmail.com',
        password: '123456',
        name: 'Admin',
        role: 'admin'
      })
    });

    if (adminResponse.ok) {
      console.log('✅ Admin user created successfully');
    } else {
      console.log('⚠️  Admin user might already exist');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }

  console.log('🎉 Database setup completed!');
  console.log('👤 Admin credentials:');
  console.log('   Email: 123@gmail.com');
  console.log('   Password: 123456');
}

setupDatabase().catch(console.error); 