import { supabase } from '@/lib/supabase/client'

export interface Case {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  client_id?: string
  assigned_to?: string
  budget: number
  start_date?: string
  due_date?: string
  progress: number
  created_at?: string
  updated_at?: string
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
    due_date: '2024-03-15',
    progress: 65,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Digital marketing campaign for Q1 product launch',
    status: 'open',
    priority: 'medium',
    client_id: '2',
    assigned_to: 'gestor',
    budget: 8000,
    start_date: '2024-02-01',
    due_date: '2024-04-01',
    progress: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function getAllCases(): Promise<Case[]> {
  try {
    console.log('🔄 Intentando obtener casos de Supabase...')
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('⚠️ Error obteniendo casos de Supabase, usando datos mock:', error.message)
      return mockCases
    }
    
    console.log(`✅ ${data?.length || 0} casos obtenidos de Supabase`)
    return data || []
  } catch (error) {
    console.error('❌ Error obteniendo casos:', error)
    return mockCases
  }
}

export async function getCaseById(id: string): Promise<Case | null> {
  try {
    console.log(`🔄 Intentando obtener caso ${id} de Supabase...`)
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.log('⚠️ Error obteniendo caso de Supabase, usando datos mock:', error.message)
      return mockCases.find(caseItem => caseItem.id === id) || null
    }
    
    console.log('✅ Caso obtenido de Supabase')
    return data
  } catch (error) {
    console.error('❌ Error obteniendo caso por ID:', error)
    return mockCases.find(caseItem => caseItem.id === id) || null
  }
}

export async function createCase(caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>): Promise<Case> {
  try {
    console.log('🔄 Intentando crear caso en Supabase...')
    
    // Preparar datos para Supabase
    const supabaseData = {
      ...caseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('cases')
      .insert(supabaseData)
      .select()
      .single()
    
    if (error) {
      console.log('⚠️ Error creando caso en Supabase, usando datos mock:', error.message)
      
      // Crear caso mock
      const mockCase: Case = {
        id: `mock-${Date.now()}`,
        ...caseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      mockCases.push(mockCase)
      console.log('✅ Caso creado en datos mock')
      return mockCase
    }
    
    console.log('✅ Caso creado en Supabase')
    return data
  } catch (error) {
    console.error('❌ Error creando caso:', error)
    
    // Crear caso mock como fallback
    const mockCase: Case = {
      id: `mock-${Date.now()}`,
      ...caseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    mockCases.push(mockCase)
    return mockCase
  }
}

export async function updateCase(id: string, updates: Partial<Case>): Promise<Case> {
  try {
    console.log(`🔄 Intentando actualizar caso ${id} en Supabase...`)
    
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.log('⚠️ Error actualizando caso en Supabase, usando datos mock:', error.message)
      
      // Actualizar caso mock
      const mockIndex = mockCases.findIndex(caseItem => caseItem.id === id)
      if (mockIndex !== -1) {
        mockCases[mockIndex] = {
          ...mockCases[mockIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        console.log('✅ Caso actualizado en datos mock')
        return mockCases[mockIndex]
      }
      
      throw new Error('Caso no encontrado')
    }
    
    console.log('✅ Caso actualizado en Supabase')
    return data
  } catch (error) {
    console.error('❌ Error actualizando caso:', error)
    
    // Actualizar caso mock como fallback
    const mockIndex = mockCases.findIndex(caseItem => caseItem.id === id)
    if (mockIndex !== -1) {
      mockCases[mockIndex] = {
        ...mockCases[mockIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockCases[mockIndex]
    }
    
    throw error
  }
}

export async function deleteCase(id: string): Promise<void> {
  try {
    console.log(`🔄 Intentando eliminar caso ${id} de Supabase...`)
    
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.log('⚠️ Error eliminando caso de Supabase, usando datos mock:', error.message)
      
      // Eliminar caso mock
      const mockIndex = mockCases.findIndex(caseItem => caseItem.id === id)
      if (mockIndex !== -1) {
        mockCases.splice(mockIndex, 1)
        console.log('✅ Caso eliminado de datos mock')
        return
      }
      
      throw new Error('Caso no encontrado')
    }
    
    console.log('✅ Caso eliminado de Supabase')
  } catch (error) {
    console.error('❌ Error eliminando caso:', error)
    
    // Eliminar caso mock como fallback
    const mockIndex = mockCases.findIndex(caseItem => caseItem.id === id)
    if (mockIndex !== -1) {
      mockCases.splice(mockIndex, 1)
    }
    
    throw error
  }
}

export async function getCasesByStatus(status: Case['status']): Promise<Case[]> {
  try {
    console.log(`🔄 Intentando obtener casos con status ${status} de Supabase...`)
    
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('⚠️ Error obteniendo casos por status de Supabase, usando datos mock:', error.message)
      return mockCases.filter(caseItem => caseItem.status === status)
    }
    
    console.log(`✅ ${data?.length || 0} casos con status ${status} obtenidos de Supabase`)
    return data || []
  } catch (error) {
    console.error('❌ Error obteniendo casos por status:', error)
    return mockCases.filter(caseItem => caseItem.status === status)
  }
}

export async function getCasesByClient(clientId: string): Promise<Case[]> {
  try {
    console.log(`🔄 Intentando obtener casos del cliente ${clientId} de Supabase...`)
    
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('⚠️ Error obteniendo casos por cliente de Supabase, usando datos mock:', error.message)
      return mockCases.filter(caseItem => caseItem.client_id === clientId)
    }
    
    console.log(`✅ ${data?.length || 0} casos del cliente ${clientId} obtenidos de Supabase`)
    return data || []
  } catch (error) {
    console.error('❌ Error obteniendo casos por cliente:', error)
    return mockCases.filter(caseItem => caseItem.client_id === clientId)
  }
}

// Función para obtener estadísticas de casos
export async function getCaseStats(): Promise<{
  total: number
  open: number
  inProgress: number
  completed: number
  onHold: number
  totalBudget: number
  averageProgress: number
}> {
  try {
    const cases = await getAllCases()
    
    const totalBudget = cases.reduce((sum, c) => sum + c.budget, 0)
    const averageProgress = cases.length > 0 ? cases.reduce((sum, c) => sum + c.progress, 0) / cases.length : 0
    
    return {
      total: cases.length,
      open: cases.filter(c => c.status === 'open').length,
      inProgress: cases.filter(c => c.status === 'in_progress').length,
      completed: cases.filter(c => c.status === 'completed').length,
      onHold: cases.filter(c => c.status === 'on_hold').length,
      totalBudget,
      averageProgress: Math.round(averageProgress)
    }
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas de casos:', error)
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      totalBudget: 0,
      averageProgress: 0
    }
  }
} 