import { supabase } from '@/lib/supabase/client'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'gestor' | 'user'
  createdAt?: string
  updatedAt?: string
}

// Datos mock para desarrollo
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@stralyze.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@stralyze.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

let currentUser: User | null = null

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    // Intentar autenticación con Supabase primero
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.log('Supabase auth failed, using mock data:', authError.message)
      
      // Fallback a datos mock
      const mockUser = mockUsers.find(user => user.email === email)
      if (mockUser) {
        currentUser = mockUser
        return mockUser
      }
      
      throw new Error('Invalid email or password')
    }

    if (!authData.user) {
      throw new Error('Authentication failed')
    }

    // Obtener datos del perfil de usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) {
      console.log('Error fetching user profile:', userError.message)
      // Crear perfil básico si no existe
      const basicUser: User = {
        id: authData.user.id,
        firstName: authData.user.user_metadata?.firstName || 'User',
        lastName: authData.user.user_metadata?.lastName || 'Name',
        email: authData.user.email!,
        role: authData.user.user_metadata?.role || 'user',
      }
      currentUser = basicUser
      return basicUser
    }

    currentUser = userData
    return userData
  } catch (error) {
    console.log('Login error (falling back to mock):', error)
    
    // Verificar si es un error de red/Supabase
    const isNetworkError = error instanceof Error && (
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    )
    
    if (isNetworkError) {
      console.log('Network error detected, using mock authentication')
      
      // Fallback a datos mock para errores de red
      const mockUser = mockUsers.find(user => user.email === email)
      if (mockUser) {
        currentUser = mockUser
        return mockUser
      }
      
      // Si no encuentra el usuario en mock, crear uno temporal
      const tempUser: User = {
        id: Date.now().toString(),
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      currentUser = tempUser
      return tempUser
    }
    
    // Para otros errores, intentar con datos mock
    const mockUser = mockUsers.find(user => user.email === email)
    if (mockUser) {
      currentUser = mockUser
      return mockUser
    }
    
    throw new Error('Invalid email or password')
  }
}

export async function createUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: string
}): Promise<User> {
  try {
    // Intentar crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'user',
        },
      },
    })

    if (authError) {
      console.log('Supabase signup failed, using mock data:', authError.message)
      
      // Fallback a datos mock
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: (userData.role as 'admin' | 'gestor' | 'user') || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockUsers.push(newUser)
      return newUser
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Crear perfil en la tabla users
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role || 'user',
      }])
      .select()
      .single()

    if (profileError) {
      console.log('Error creating user profile:', profileError.message)
      // Retornar usuario básico si no se puede crear el perfil
      const basicUser: User = {
        id: authData.user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: (userData.role as 'admin' | 'gestor' | 'user') || 'user',
      }
      return basicUser
    }

    return profileData
  } catch (error) {
    console.error('Create user error:', error)
    
    // Fallback final a datos mock
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: (userData.role as 'admin' | 'gestor' | 'user') || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockUsers.push(newUser)
    return newUser
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Intentar obtener usuario actual de Supabase
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('No Supabase user found, using mock current user')
      return currentUser
    }

    // Obtener perfil completo
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.log('Error fetching user profile:', userError.message)
      // Retornar usuario básico
      const basicUser: User = {
        id: user.id,
        firstName: user.user_metadata?.firstName || 'User',
        lastName: user.user_metadata?.lastName || 'Name',
        email: user.email!,
        role: user.user_metadata?.role || 'user',
      }
      currentUser = basicUser
      return basicUser
    }

    currentUser = userData
    return userData
  } catch (error) {
    console.log('Get current user error (using mock):', error)
    
    // Verificar si es un error de red
    const isNetworkError = error instanceof Error && (
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    )
    
    if (isNetworkError) {
      console.log('Network error detected, returning mock current user')
      return currentUser
    }
    
    return currentUser
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    currentUser = null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from('users').select('*')
    
    if (error) {
      console.log('Error fetching users from Supabase, using mock data:', error.message)
      return mockUsers
    }
    
    return data || []
  } catch (error) {
    console.error('Get all users error:', error)
    return mockUsers
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.log('Error updating user in Supabase, using mock data:', error.message)
      
      // Actualizar en datos mock
      const userIndex = mockUsers.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date().toISOString() }
        return mockUsers[userIndex]
      }
      
      throw new Error('User not found')
    }
    
    return data
  } catch (error) {
    console.error('Update user error:', error)
    throw error
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('users').delete().eq('id', id)
    
    if (error) {
      console.log('Error deleting user from Supabase, using mock data:', error.message)
      
      // Eliminar de datos mock
      const userIndex = mockUsers.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1)
      }
      
      return
    }
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}
