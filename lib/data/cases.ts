import { supabase } from '@/lib/supabase/client';
import { caseSchema, caseUpdateSchema } from '@/lib/validations/case-schema';
import type { Case } from '@/types/case';

export async function getCases(): Promise<{ success: boolean; data?: Case[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching cases:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getCase(id: string): Promise<{ success: boolean; data?: Case; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching case:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching case:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createCase(caseData: any): Promise<{ success: boolean; data?: Case; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = caseSchema.parse(caseData);

    const { data, error } = await supabase
      .from('cases')
      .insert([validatedData])
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating case:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or creation error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating case:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateCase(id: string, caseData: any): Promise<{ success: boolean; data?: Case; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = caseUpdateSchema.parse(caseData);

    const { data, error } = await supabase
      .from('cases')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .single();

    if (error) {
      console.error('Error updating case:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or update error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error updating case:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteCase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting case:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting case:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getCasesByStatus(status: string): Promise<{ success: boolean; data?: Case[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases by status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching cases by status:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getCasesByClient(clientId: string): Promise<{ success: boolean; data?: Case[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(name, email, company),
        assigned_user:users(name, email)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases by client:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching cases by client:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 