import { supabase } from '@/lib/supabase/client';
import { clientSchema, clientUpdateSchema } from '@/lib/validations/client-schema';
import type { Client } from '@/types/client';

export async function getClients(): Promise<{ success: boolean; data?: Client[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching clients:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getClient(id: string): Promise<{ success: boolean; data?: Client; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching client:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createClient(clientData: any): Promise<{ success: boolean; data?: Client; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = clientSchema.parse(clientData);

    const { data, error } = await supabase
      .from('clients')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or creation error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating client:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateClient(id: string, clientData: any): Promise<{ success: boolean; data?: Client; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = clientUpdateSchema.parse(clientData);

    const { data, error } = await supabase
      .from('clients')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or update error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error updating client:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting client:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function searchClients(query: string): Promise<{ success: boolean; data?: Client[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching clients:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error searching clients:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
