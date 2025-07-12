import { supabase } from '@/lib/supabase/client';
import { templateSchema, templateUpdateSchema } from '@/lib/validations/template-schema';

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'follow_up' | 'promotional' | 'newsletter' | 'notification' | 'other';
  is_active: boolean;
  created_at: string;
}

export async function getTemplates(): Promise<{ success: boolean; data?: Template[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching templates:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getTemplate(id: string): Promise<{ success: boolean; data?: Template; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching template:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createTemplate(templateData: any): Promise<{ success: boolean; data?: Template; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = templateSchema.parse(templateData);

    const { data, error } = await supabase
      .from('templates')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or creation error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating template:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateTemplate(id: string, templateData: any): Promise<{ success: boolean; data?: Template; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = templateUpdateSchema.parse(templateData);

    const { data, error } = await supabase
      .from('templates')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or update error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error updating template:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar si el template está siendo usado por alguna campaña
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('template_id', id);

    if (campaignsError) {
      console.error('Error checking template usage:', campaignsError);
      return { success: false, error: campaignsError.message };
    }

    if (campaigns && campaigns.length > 0) {
      const campaignNames = campaigns.map(c => c.name).join(', ');
      return { 
        success: false, 
        error: `Cannot delete template. It is being used by the following campaigns: ${campaignNames}` 
      };
    }

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting template:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getTemplatesByCategory(category: string): Promise<{ success: boolean; data?: Template[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates by category:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching templates by category:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 