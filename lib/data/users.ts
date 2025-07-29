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
    // Usar Supabase Auth para autenticación real
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid credentials');
    }
    
    if (!data.user) {
      throw new Error('No user data returned');
    }
    
    // Obtener datos adicionales del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('User data error:', userError);
      // Si no existe en la tabla users, crear un usuario básico
      return {
        id: data.user.id,
        firstName: data.user.user_metadata?.firstName || 'User',
        lastName: data.user.user_metadata?.lastName || '',
        email: data.user.email || '',
        role: data.user.user_metadata?.role || 'user',
        createdAt: data.user.created_at || new Date().toISOString(),
        updatedAt: data.user.updated_at || new Date().toISOString(),
      };
    }
    
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
}

export async function createUser(userData: CreateUserData): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
        }
      }
    });

    if (authError) {
      console.error('Auth create error:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Crear registro en la tabla users
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
      }])
      .select()
      .single();

    if (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'Failed to create user profile' };
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

// Función para verificar si el usuario está autenticado
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Obtener datos adicionales del usuario
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return userData || {
      id: user.id,
      firstName: user.user_metadata?.firstName || 'User',
      lastName: user.user_metadata?.lastName || '',
      email: user.email || '',
      role: user.user_metadata?.role || 'user',
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: user.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Función para cerrar sesión
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}
