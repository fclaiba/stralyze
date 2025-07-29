import { supabase } from '@/lib/supabase/client'

export interface Client {
  id: string
  company: string
  status: string
  industry: string
  contact: string
  email: string
  phone?: string
  payment_method: string
  contract_status: string
  deposit: number
  final_payment: number
  total_amount: number
  budget: string
  created_at?: string
  updated_at?: string
}

// Datos mock para desarrollo
let mockClients: Client[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    status: 'Active',
    industry: 'Technology',
    contact: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    payment_method: 'Credit Card',
    contract_status: 'Signed',
    deposit: 5000,
    final_payment: 15000,
    total_amount: 20000,
    budget: '$15,000 - $25,000',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    company: 'Global Marketing Inc',
    status: 'Prospect',
    industry: 'Marketing',
    contact: 'Sarah Johnson',
    email: 'sarah@globalmarketing.com',
    phone: '+1-555-0456',
    payment_method: 'Bank Transfer',
    contract_status: 'Pending',
    deposit: 0,
    final_payment: 0,
    total_amount: 0,
    budget: '$10,000 - $15,000',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export async function getAllClients(): Promise<Client[]> {
  try {
    console.log('🔄 Intentando obtener clientes de Supabase...')
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('⚠️ Error obteniendo clientes de Supabase, usando datos mock:', error.message)
      return mockClients
    }
    
    console.log(`✅ ${data?.length || 0} clientes obtenidos de Supabase`)
    return data || []
  } catch (error) {
    console.error('❌ Error obteniendo clientes:', error)
    return mockClients
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    console.log(`🔄 Intentando obtener cliente ${id} de Supabase...`)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.log('⚠️ Error obteniendo cliente de Supabase, usando datos mock:', error.message)
      return mockClients.find(client => client.id === id) || null
    }
    
    console.log('✅ Cliente obtenido de Supabase')
    return data
  } catch (error) {
    console.error('❌ Error obteniendo cliente por ID:', error)
    return mockClients.find(client => client.id === id) || null
  }
}

export async function createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
  try {
    console.log('🔄 Intentando crear cliente en Supabase...')
    
    // Preparar datos para Supabase
    const supabaseData = {
      ...clientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert(supabaseData)
      .select()
      .single()
    
    if (error) {
      console.log('⚠️ Error creando cliente en Supabase, usando datos mock:', error.message)
      
      // Crear cliente mock
      const mockClient: Client = {
        id: `mock-${Date.now()}`,
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      mockClients.push(mockClient)
      console.log('✅ Cliente creado en datos mock')
      return mockClient
    }
    
    console.log('✅ Cliente creado en Supabase')
    return data
  } catch (error) {
    console.error('❌ Error creando cliente:', error)
    
    // Crear cliente mock como fallback
    const mockClient: Client = {
      id: `mock-${Date.now()}`,
      ...clientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    mockClients.push(mockClient)
    return mockClient
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client> {
  try {
    console.log(`🔄 Intentando actualizar cliente ${id} en Supabase...`)
    
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.log('⚠️ Error actualizando cliente en Supabase, usando datos mock:', error.message)
      
      // Actualizar cliente mock
      const mockIndex = mockClients.findIndex(client => client.id === id)
      if (mockIndex !== -1) {
        mockClients[mockIndex] = {
          ...mockClients[mockIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        console.log('✅ Cliente actualizado en datos mock')
        return mockClients[mockIndex]
      }
      
      throw new Error('Cliente no encontrado')
    }
    
    console.log('✅ Cliente actualizado en Supabase')
    return data
  } catch (error) {
    console.error('❌ Error actualizando cliente:', error)
    
    // Actualizar cliente mock como fallback
    const mockIndex = mockClients.findIndex(client => client.id === id)
    if (mockIndex !== -1) {
      mockClients[mockIndex] = {
        ...mockClients[mockIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockClients[mockIndex]
    }
    
    throw error
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    console.log(`🔄 Intentando eliminar cliente ${id} de Supabase...`)
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.log('⚠️ Error eliminando cliente de Supabase, usando datos mock:', error.message)
      
      // Eliminar cliente mock
      const mockIndex = mockClients.findIndex(client => client.id === id)
      if (mockIndex !== -1) {
        mockClients.splice(mockIndex, 1)
        console.log('✅ Cliente eliminado de datos mock')
        return
      }
      
      throw new Error('Cliente no encontrado')
    }
    
    console.log('✅ Cliente eliminado de Supabase')
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error)
    
    // Eliminar cliente mock como fallback
    const mockIndex = mockClients.findIndex(client => client.id === id)
    if (mockIndex !== -1) {
      mockClients.splice(mockIndex, 1)
    }
    
    throw error
  }
}

export async function getClientsByStatus(status: string): Promise<Client[]> {
  try {
    console.log(`🔄 Intentando obtener clientes con status ${status} de Supabase...`)
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('⚠️ Error obteniendo clientes por status de Supabase, usando datos mock:', error.message)
      return mockClients.filter(client => client.status === status)
    }
    
    console.log(`✅ ${data?.length || 0} clientes con status ${status} obtenidos de Supabase`)
    return data || []
  } catch (error) {
    console.error('❌ Error obteniendo clientes por status:', error)
    return mockClients.filter(client => client.status === status)
  }
}

// Función para obtener estadísticas de clientes
export async function getClientStats(): Promise<{
  total: number
  active: number
  prospect: number
  newLead: number
  closedDeal: number
}> {
  try {
    const clients = await getAllClients()
    
    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'Active').length,
      prospect: clients.filter(c => c.status === 'Prospect').length,
      newLead: clients.filter(c => c.status === 'New Lead').length,
      closedDeal: clients.filter(c => c.status === 'Closed Deal').length,
    }
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas de clientes:', error)
    return {
      total: 0,
      active: 0,
      prospect: 0,
      newLead: 0,
      closedDeal: 0,
    }
  }
}
