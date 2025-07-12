import { supabase } from '@/lib/supabase/client';
import { campaignSchema, campaignUpdateSchema } from '@/lib/validations/campaign-schema';

export interface Campaign {
  id: string;
  name: string;
  template_id: string;
  segment: 'new_lead' | 'in_process' | 'closed_deal' | 'abandoned' | 'all';
  subject: string;
  content: string;
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  created_at: string;
  template?: {
    name: string;
  };
  stats?: {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

export async function getCampaigns(): Promise<{ success: boolean; data?: Campaign[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        template:templates(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching campaigns:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getCampaign(id: string): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        template:templates(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching campaign:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching campaign:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createCampaign(campaignData: any): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = campaignSchema.parse(campaignData);

    const { data, error } = await supabase
      .from('campaigns')
      .insert([validatedData])
      .select(`
        *,
        template:templates(name)
      `)
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or creation error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating campaign:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateCampaign(id: string, campaignData: any): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = campaignUpdateSchema.parse(campaignData);

    const { data, error } = await supabase
      .from('campaigns')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        template:templates(name)
      `)
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or update error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error updating campaign:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting campaign:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting campaign:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function sendCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Actualizar estado a 'sending'
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'sending' })
      .eq('id', id);

    if (error) {
      console.error('Error updating campaign status:', error);
      return { success: false, error: error.message };
    }

    // Aquí iría la lógica real de envío de emails
    // Por ahora simulamos el envío
    setTimeout(async () => {
      await supabase
        .from('campaigns')
        .update({ status: 'sent' })
        .eq('id', id);
    }, 2000);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error sending campaign:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 