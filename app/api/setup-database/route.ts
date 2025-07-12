import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://raarpbsmxhilvhisylea.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Service role key not configured' 
      }, { status: 500 });
    }

    // Crear las tablas usando la API REST de Supabase
    const tables = [
      {
        name: 'users',
        sql: `
          create table if not exists users (
            id uuid primary key default gen_random_uuid(),
            email text unique not null,
            password text not null,
            name text,
            role text default 'admin',
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'clients',
        sql: `
          create table if not exists clients (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            email text,
            phone text,
            company text,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'cases',
        sql: `
          create table if not exists cases (
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
          );
        `
      },
      {
        name: 'tags',
        sql: `
          create table if not exists tags (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'case_tags',
        sql: `
          create table if not exists case_tags (
            case_id uuid references cases(id) on delete cascade,
            tag_id uuid references tags(id) on delete cascade,
            primary key (case_id, tag_id)
          );
        `
      },
      {
        name: 'notes',
        sql: `
          create table if not exists notes (
            id uuid primary key default gen_random_uuid(),
            case_id uuid references cases(id) on delete cascade,
            content text,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'events',
        sql: `
          create table if not exists events (
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
          );
        `
      },
      {
        name: 'event_attendees',
        sql: `
          create table if not exists event_attendees (
            event_id uuid references events(id) on delete cascade,
            user_id uuid references users(id) on delete cascade,
            primary key (event_id, user_id)
          );
        `
      },
      {
        name: 'templates',
        sql: `
          create table if not exists templates (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            subject text,
            body text,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'campaigns',
        sql: `
          create table if not exists campaigns (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            template_id uuid references templates(id),
            segment text,
            created_by uuid references users(id),
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'notifications',
        sql: `
          create table if not exists notifications (
            id uuid primary key default gen_random_uuid(),
            user_id uuid references users(id),
            event_id uuid references events(id),
            case_id uuid references cases(id),
            message text,
            sent_at timestamp default now()
          );
        `
      },
      {
        name: 'settings',
        sql: `
          create table if not exists settings (
            id uuid primary key default gen_random_uuid(),
            user_id uuid references users(id),
            key text,
            value text,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'support_tickets',
        sql: `
          create table if not exists support_tickets (
            id uuid primary key default gen_random_uuid(),
            user_id uuid references users(id),
            subject text,
            message text,
            status text,
            created_at timestamp default now()
          );
        `
      },
      {
        name: 'form_leads',
        sql: `
          create table if not exists form_leads (
            id uuid primary key default gen_random_uuid(),
            type text,
            name text,
            email text,
            phone text,
            message text,
            created_at timestamp default now()
          );
        `
      }
    ];

    // Ejecutar cada tabla usando la API REST
    for (const table of tables) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY
        },
        body: JSON.stringify({ sql: table.sql })
      });

      if (!response.ok) {
        console.error(`Error creating table ${table.name}:`, await response.text());
      }
    }

    // Crear el usuario admin
    const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        email: '123@gmail.com',
        password: '123456',
        name: 'Admin',
        role: 'admin'
      })
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully' 
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup database' 
    }, { status: 500 });
  }
} 