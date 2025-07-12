import { supabase } from '../supabase/client';

export async function getFormLeads() {
  const { data, error } = await supabase.from('form_leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getFormLeadsByType(type: string) {
  const { data, error } = await supabase
    .from('form_leads')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createFormLead(newLead: any) {
  const { data, error } = await supabase.from('form_leads').insert([newLead]).single();
  if (error) throw error;
  return data;
}

export async function updateFormLead(id: string, updates: any) {
  const { data, error } = await supabase.from('form_leads').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteFormLead(id: string) {
  const { error } = await supabase.from('form_leads').delete().eq('id', id);
  if (error) throw error;
} 