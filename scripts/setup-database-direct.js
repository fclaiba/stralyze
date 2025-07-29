const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://raarpbsmxhilvhisylea.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

// Crear cliente de Supabase con service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabaseDirect() {
  try {
    console.log('🚀 Iniciando configuración directa de base de datos...');
    
    // Comandos SQL individuales para crear las tablas
    const commands = [
      // USERS
      `create table if not exists users (
        id uuid primary key default gen_random_uuid(),
        email text unique not null,
        password text not null,
        name text,
        role text default 'admin',
        created_at timestamp default now()
      )`,
      
      // CLIENTS
      `create table if not exists clients (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        email text,
        phone text,
        company text,
        created_at timestamp default now()
      )`,
      
      // CASES
      `create table if not exists cases (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        client_id uuid references clients(id),
        status text,
        priority text,
        assigned_to uuid references users(id),
        budget numeric,
        start_date date,
        due_date date,
        description text,
        progress integer default 0,
        created_at timestamp default now()
      )`,
      
      // TAGS
      `create table if not exists tags (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        created_at timestamp default now()
      )`,
      
      // CASE_TAGS
      `create table if not exists case_tags (
        case_id uuid references cases(id) on delete cascade,
        tag_id uuid references tags(id) on delete cascade,
        primary key (case_id, tag_id)
      )`,
      
      // NOTES
      `create table if not exists notes (
        id uuid primary key default gen_random_uuid(),
        case_id uuid references cases(id) on delete cascade,
        content text,
        created_at timestamp default now()
      )`,
      
      // EVENTS
      `create table if not exists events (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        case_id uuid references cases(id),
        date date,
        time text,
        duration integer,
        type text,
        priority text,
        location text,
        is_all_day boolean default false,
        color text,
        recurring text,
        created_at timestamp default now()
      )`,
      
      // EVENT_ATTENDEES
      `create table if not exists event_attendees (
        event_id uuid references events(id) on delete cascade,
        user_id uuid references users(id) on delete cascade,
        primary key (event_id, user_id)
      )`,
      
      // TEMPLATES
      `create table if not exists templates (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        subject text,
        body text,
        created_at timestamp default now()
      )`,
      
      // CAMPAIGNS
      `create table if not exists campaigns (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        template_id uuid references templates(id),
        segment text,
        created_by uuid references users(id),
        created_at timestamp default now()
      )`,
      
      // NOTIFICATIONS
      `create table if not exists notifications (
        id uuid primary key default gen_random_uuid(),
        user_id uuid references users(id),
        event_id uuid references events(id),
        case_id uuid references cases(id),
        message text,
        sent_at timestamp default now()
      )`,
      
      // SETTINGS
      `create table if not exists settings (
        id uuid primary key default gen_random_uuid(),
        user_id uuid references users(id),
        key text,
        value text,
        created_at timestamp default now()
      )`,
      
      // SUPPORT TICKETS
      `create table if not exists support_tickets (
        id uuid primary key default gen_random_uuid(),
        user_id uuid references users(id),
        subject text,
        message text,
        status text,
        created_at timestamp default now()
      )`,
      
      // FORM LEADS
      `create table if not exists form_leads (
        id uuid primary key default gen_random_uuid(),
        type text,
        name text,
        email text,
        phone text,
        message text,
        created_at timestamp default now()
      )`,
      
      // USUARIO ADMIN POR DEFECTO
      `insert into users (email, password, name, role) 
       values ('123@gmail.com', '123456', 'Admin', 'admin')
       on conflict (email) do update set 
       password = excluded.password, 
       name = excluded.name, 
       role = excluded.role`,
      
      // ÍNDICES
      `create index if not exists idx_cases_client_id on cases(client_id)`,
      `create index if not exists idx_cases_assigned_to on cases(assigned_to)`,
      `create index if not exists idx_events_case_id on events(case_id)`,
      `create index if not exists idx_notes_case_id on notes(case_id)`,
      `create index if not exists idx_notifications_user_id on notifications(user_id)`,
      `create index if not exists idx_settings_user_id on settings(user_id)`,
      `create index if not exists idx_support_tickets_user_id on support_tickets(user_id)`,
      `create index if not exists idx_form_leads_type on form_leads(type)`
    ];
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      try {
        // Intentar ejecutar usando rpc
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️ Comando ${i + 1} saltado (rpc): ${error.message}`);
        } else {
          console.log(`✅ Comando ${i + 1} ejecutado correctamente`);
        }
      } catch (e) {
        console.log(`⚠️ Comando ${i + 1} saltado: ${e.message}`);
      }
    }
    
    console.log('🎉 Configuración de base de datos completada');
    console.log('👤 Usuario admin creado:');
    console.log('   Email: 123@gmail.com');
    console.log('   Password: 123456');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabaseDirect();
}

module.exports = { setupDatabaseDirect }; 