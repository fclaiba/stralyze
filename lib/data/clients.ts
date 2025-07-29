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
  createdAt?: string
  updatedAt?: string
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export async function getAllClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.log('Error fetching clients from Supabase, using mock data:', error.message)
      return mockClients
    }
    
    return data || []
  } catch (error) {
    console.error('Get all clients error:', error)
    return mockClients
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.log('Error fetching client from Supabase, using mock data:', error.message)
      return mockClients.find(client => client.id === id) || null
    }
    
    return data
  } catch (error) {
    console.error('Get client by ID error:', error)
    return mockClients.find(client => client.id === id) || null
  }
}

export async function createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single()
    
    if (error) {
      console.log('Error creating client in Supabase, using mock data:', error.message)
      
      // Crear en datos mock
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockClients.push(newClient)
      return newClient
    }
    
    return data
  } catch (error) {
    console.error('Create client error:', error)
    
    // Fallback a datos mock
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockClients.push(newClient)
    return newClient
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.log('Error updating client in Supabase, using mock data:', error.message)
      
      // Actualizar en datos mock
      const clientIndex = mockClients.findIndex(client => client.id === id)
      if (clientIndex !== -1) {
        mockClients[clientIndex] = { 
          ...mockClients[clientIndex], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        }
        return mockClients[clientIndex]
      }
      
      throw new Error('Client not found')
    }
    
    return data
  } catch (error) {
    console.error('Update client error:', error)
    throw error
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    
    if (error) {
      console.log('Error deleting client from Supabase, using mock data:', error.message)
      
      // Eliminar de datos mock
      const clientIndex = mockClients.findIndex(client => client.id === id)
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1)
      }
      
      return
    }
  } catch (error) {
    console.error('Delete client error:', error)
    throw error
  }
}

export async function getClientsByStatus(status: string): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.log('Error fetching clients by status from Supabase, using mock data:', error.message)
      return mockClients.filter(client => client.status === status)
    }
    
    return data || []
  } catch (error) {
    console.error('Get clients by status error:', error)
    return mockClients.filter(client => client.status === status)
  }
}
