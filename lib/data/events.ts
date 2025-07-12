import { supabase } from '@/lib/supabase/client';
import { eventSchema, eventUpdateSchema } from '@/lib/validations/event-schema';

export interface Event {
  id: string;
  title: string;
  case_id?: string;
  date: string;
  time?: string;
  duration?: number;
  type: 'meeting' | 'call' | 'deadline' | 'reminder' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  is_all_day: boolean;
  color?: string;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string;
  case?: {
    title: string;
  };
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export async function getEvents(): Promise<{ success: boolean; data?: Event[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        case:cases(title)
      `)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching events:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getEvent(id: string): Promise<{ success: boolean; data?: Event; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        case:cases(title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function createEvent(eventData: any): Promise<{ success: boolean; data?: Event; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = eventSchema.parse(eventData);

    const { data, error } = await supabase
      .from('events')
      .insert([validatedData])
      .select(`
        *,
        case:cases(title)
      `)
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or creation error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateEvent(id: string, eventData: any): Promise<{ success: boolean; data?: Event; error?: string }> {
  try {
    // Validar datos de entrada
    const validatedData = eventUpdateSchema.parse(eventData);

    const { data, error } = await supabase
      .from('events')
      .update(validatedData)
      .eq('id', id)
      .select(`
        *,
        case:cases(title)
      `)
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or update error:', error);
      return { success: false, error: error.message };
    }
    console.error('Unexpected error updating event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting event:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getEventsByDate(date: string): Promise<{ success: boolean; data?: Event[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        case:cases(title)
      `)
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching events by date:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching events by date:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getEventsByCase(caseId: string): Promise<{ success: boolean; data?: Event[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        case:cases(title)
      `)
      .eq('case_id', caseId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events by case:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching events by case:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getEventAttendees(eventId: string) {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('user_id, users(*)')
    .eq('event_id', eventId);
  if (error) throw error;
  return data;
}

export async function addEventAttendee(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_attendees')
    .insert([{ event_id: eventId, user_id: userId }]);
  if (error) throw error;
}

export async function removeEventAttendee(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  if (error) throw error;
} 