import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  // Elimina cualquier usuario admin anterior con ese email
  await supabase.from('users').delete().eq('email', '123@gmail.com');
  // Inserta el usuario admin por defecto
  const { error } = await supabase.from('users').insert({
    email: '123@gmail.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 