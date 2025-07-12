import { supabase } from '@/lib/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  event_id?: string;
  case_id?: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  sent_at: string;
  user?: {
    name: string;
    email: string;
  };
  event?: {
    title: string;
  };
  case?: {
    title: string;
  };
}

export async function getNotifications(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching notifications:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getNotification(id: string): Promise<{ success: boolean; data?: Notification; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching notification:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createNotification(notificationData: any): Promise<{ success: boolean; data?: Notification; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateNotification(id: string, notificationData: any): Promise<{ success: boolean; data?: Notification; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update(notificationData)
      .eq('id', id)
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .single();

    if (error) {
      console.error('Error updating notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating notification:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteNotification(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting notification:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function markNotificationAsRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error marking notification as read:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getUnreadNotifications(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .eq('is_read', false)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching unread notifications:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching unread notifications:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getNotificationsByUser(userId: string): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users(name, email),
        event:events(title),
        case:cases(title)
      `)
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications by user:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching notifications by user:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 