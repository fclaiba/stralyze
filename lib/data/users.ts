import { supabase } from '../supabase/client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'gestor' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'gestor' | 'user';
}

export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
}

export async function createUser(userData: CreateUserData): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        role: userData.role,
      }])
      .select()
      .single();

    if (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'Failed to create user' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Get user error:', error);
      throw new Error('User not found');
    }
    
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw new Error('User not found');
  }
}

export async function updateUser(id: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user');
    }
    
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Failed to update user');
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Failed to delete user' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Get all users error:', error);
      throw new Error('Failed to fetch users');
    }

    return data || [];
  } catch (error) {
    console.error('Get all users error:', error);
    throw new Error('Failed to fetch users');
  }
}
