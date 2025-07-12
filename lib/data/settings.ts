import { supabase } from '@/lib/supabase/client';

export interface Setting {
  id: string;
  user_id: string;
  key: string;
  value: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export async function getSettings(): Promise<{ success: boolean; data?: Setting[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching settings:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSetting(id: string): Promise<{ success: boolean; data?: Setting; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching setting:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createSetting(settingData: any): Promise<{ success: boolean; data?: Setting; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .insert([settingData])
      .select(`
        *,
        user:users(name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating setting:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating setting:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateSetting(id: string, settingData: any): Promise<{ success: boolean; data?: Setting; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update(settingData)
      .eq('id', id)
      .select(`
        *,
        user:users(name, email)
      `)
      .single();

    if (error) {
      console.error('Error updating setting:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating setting:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteSetting(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting setting:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting setting:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSettingsByUser(userId: string): Promise<{ success: boolean; data?: Setting[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching settings by user:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching settings by user:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSettingByKey(userId: string, key: string): Promise<{ success: boolean; data?: Setting; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('user_id', userId)
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching setting by key:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching setting by key:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function upsertSetting(userId: string, key: string, value: string): Promise<{ success: boolean; data?: Setting; error?: string }> {
  try {
    // Intentar actualizar primero
    const { data: existingSetting } = await supabase
      .from('settings')
      .select('id')
      .eq('user_id', userId)
      .eq('key', key)
      .single();

    if (existingSetting) {
      // Actualizar si existe
      const { data, error } = await supabase
        .from('settings')
        .update({ value })
        .eq('id', existingSetting.id)
        .select(`
          *,
          user:users(name, email)
        `)
        .single();

      if (error) {
        console.error('Error updating setting:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } else {
      // Crear si no existe
      const { data, error } = await supabase
        .from('settings')
        .insert([{ user_id: userId, key, value }])
        .select(`
          *,
          user:users(name, email)
        `)
        .single();

      if (error) {
        console.error('Error creating setting:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error('Unexpected error upserting setting:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 