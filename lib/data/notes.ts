import { supabase } from '../supabase/client';

export async function getNotes() {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) throw error;
  return data;
}

export async function getNotesByCase(caseId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createNote(newNote: any) {
  const { data, error } = await supabase.from('notes').insert([newNote]).single();
  if (error) throw error;
  return data;
}

export async function updateNote(id: string, updates: any) {
  const { data, error } = await supabase.from('notes').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
} 