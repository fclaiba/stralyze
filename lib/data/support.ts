import { supabase } from '@/lib/supabase/client';

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  assigned_to?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    name: string;
    email: string;
  };
  assigned_user?: {
    name: string;
    email: string;
  };
}

export async function getSupportTickets(): Promise<{ success: boolean; data?: SupportTicket[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching support tickets:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSupportTicket(id: string): Promise<{ success: boolean; data?: SupportTicket; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching support ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching support ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createSupportTicket(ticketData: any): Promise<{ success: boolean; data?: SupportTicket; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([ticketData])
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating support ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateSupportTicket(id: string, ticketData: any): Promise<{ success: boolean; data?: SupportTicket; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ ...ticketData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .single();

    if (error) {
      console.error('Error updating support ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating support ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteSupportTicket(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting support ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting support ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSupportTicketsByUser(userId: string): Promise<{ success: boolean; data?: SupportTicket[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets by user:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching support tickets by user:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSupportTicketsByStatus(status: string): Promise<{ success: boolean; data?: SupportTicket[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets by status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching support tickets by status:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getSupportTicketsByPriority(priority: string): Promise<{ success: boolean; data?: SupportTicket[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name, email)
      `)
      .eq('priority', priority)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets by priority:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching support tickets by priority:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function assignSupportTicket(ticketId: string, assignedTo: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ 
        assigned_to: assignedTo,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error assigning support ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error assigning support ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateTicketStatus(ticketId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating ticket status:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 