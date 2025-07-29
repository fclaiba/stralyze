import { supabase } from '@/lib/supabase/client'

export interface Case {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  client_id: string
  assigned_to?: string
  budget: number
  start_date?: string
  end_date?: string
  createdAt?: string
  updatedAt?: string
}

// Datos mock para desarrollo
let mockCases: Case[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    status: 'in_progress',
    priority: 'high',
    client_id: '1',
    assigned_to: 'admin',
    budget: 15000,
    start_date: '2024-01-15',
    end_date: '2024-03-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Digital marketing campaign for Q1 product launch',
    status: 'pending',
    priority: 'medium',
    client_id: '2',
    assigned_to: 'gestor',
    budget: 8000,
    start_date: '2024-02-01',
    end_date: '2024-04-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export async function getAllCases(): Promise<Case[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.log('Error fetching cases from Supabase, using mock data:', error.message)
      return mockCases
    }
    
    return data || []
  } catch (error) {
    console.error('Get all cases error:', error)
    return mockCases
  }
}

export async function getCaseById(id: string): Promise<Case | null> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.log('Error fetching case from Supabase, using mock data:', error.message)
      return mockCases.find(caseItem => caseItem.id === id) || null
    }
    
    return data
  } catch (error) {
    console.error('Get case by ID error:', error)
    return mockCases.find(caseItem => caseItem.id === id) || null
  }
}

export async function createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .insert([{
        ...caseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single()
    
    if (error) {
      console.log('Error creating case in Supabase, using mock data:', error.message)
      
      // Crear en datos mock
      const newCase: Case = {
        id: Date.now().toString(),
        ...caseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockCases.push(newCase)
      return newCase
    }
    
    return data
  } catch (error) {
    console.error('Create case error:', error)
    
    // Fallback a datos mock
    const newCase: Case = {
      id: Date.now().toString(),
      ...caseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockCases.push(newCase)
    return newCase
  }
}

export async function updateCase(id: string, updates: Partial<Case>): Promise<Case> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.log('Error updating case in Supabase, using mock data:', error.message)
      
      // Actualizar en datos mock
      const caseIndex = mockCases.findIndex(caseItem => caseItem.id === id)
      if (caseIndex !== -1) {
        mockCases[caseIndex] = { 
          ...mockCases[caseIndex], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        }
        return mockCases[caseIndex]
      }
      
      throw new Error('Case not found')
    }
    
    return data
  } catch (error) {
    console.error('Update case error:', error)
    throw error
  }
}

export async function deleteCase(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('cases').delete().eq('id', id)
    
    if (error) {
      console.log('Error deleting case from Supabase, using mock data:', error.message)
      
      // Eliminar de datos mock
      const caseIndex = mockCases.findIndex(caseItem => caseItem.id === id)
      if (caseIndex !== -1) {
        mockCases.splice(caseIndex, 1)
      }
      
      return
    }
  } catch (error) {
    console.error('Delete case error:', error)
    throw error
  }
}

export async function getCasesByStatus(status: Case['status']): Promise<Case[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.log('Error fetching cases by status from Supabase, using mock data:', error.message)
      return mockCases.filter(caseItem => caseItem.status === status)
    }
    
    return data || []
  } catch (error) {
    console.error('Get cases by status error:', error)
    return mockCases.filter(caseItem => caseItem.status === status)
  }
}

export async function getCasesByClient(clientId: string): Promise<Case[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('client_id', clientId)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.log('Error fetching cases by client from Supabase, using mock data:', error.message)
      return mockCases.filter(caseItem => caseItem.client_id === clientId)
    }
    
    return data || []
  } catch (error) {
    console.error('Get cases by client error:', error)
    return mockCases.filter(caseItem => caseItem.client_id === clientId)
  }
} 