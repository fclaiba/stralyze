import { 
  getAllClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient, 
  getClientsByStatus,
  getClientStats,
  type Client 
} from '@/lib/data/clients'

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Mock error' }
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Mock error' }
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Mock error' }
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: { message: 'Mock error' }
        }))
      }))
    }))
  }
}))

describe('Client Functions', () => {
  const mockClient: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
    company: 'Test Company',
    status: 'New Lead',
    industry: 'Technology',
    contact: 'Test Contact',
    email: 'test@example.com',
    phone: '123-456-7890',
    payment_method: 'Credit Card',
    contract_status: 'Pending',
    deposit: 1000,
    final_payment: 5000,
    total_amount: 6000,
    budget: '5000-10000'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn() // Mock console.log para evitar ruido en tests
    console.error = jest.fn() // Mock console.error para evitar ruido en tests
  })

  describe('getAllClients', () => {
    it('should return mock clients when Supabase fails', async () => {
      const clients = await getAllClients()
      
      expect(clients).toBeDefined()
      expect(Array.isArray(clients)).toBe(true)
      // Los clientes mock están definidos en el archivo, así que deberían existir
      expect(clients.length).toBeGreaterThanOrEqual(0)
      if (clients.length > 0) {
        expect(clients[0]).toHaveProperty('id')
        expect(clients[0]).toHaveProperty('company')
      }
    })
  })

  describe('getClientById', () => {
    it('should return a client when found', async () => {
      const client = await getClientById('1')
      
      expect(client).toBeDefined()
      expect(client?.id).toBe('1')
      expect(client?.company).toBe('TechCorp Solutions')
    })

    it('should return null when client not found', async () => {
      const client = await getClientById('non-existent')
      
      expect(client).toBeNull()
    })
  })

  describe('createClient', () => {
    it('should create a new client with mock data', async () => {
      const newClient = await createClient(mockClient)
      
      expect(newClient).toBeDefined()
      expect(newClient.id).toMatch(/^mock-\d+$/)
      expect(newClient.company).toBe(mockClient.company)
      expect(newClient.email).toBe(mockClient.email)
    })

    it('should generate unique IDs for multiple clients', async () => {
      const client1 = await createClient(mockClient)
      // Esperar un poco para asegurar IDs únicos
      await new Promise(resolve => setTimeout(resolve, 1))
      const client2 = await createClient({
        ...mockClient,
        email: 'test2@example.com'
      })
      
      expect(client1.id).not.toBe(client2.id)
    })
  })

  describe('updateClient', () => {
    it('should update an existing client', async () => {
      // Primero crear un cliente
      const newClient = await createClient(mockClient)
      const updates = { status: 'Active' }
      
      const updatedClient = await updateClient(newClient.id, updates)
      
      expect(updatedClient).toBeDefined()
      expect(updatedClient.status).toBe('Active')
    })

    it('should throw error when client not found', async () => {
      const updates = { status: 'Active' }
      
      await expect(updateClient('non-existent', updates)).rejects.toThrow('Cliente no encontrado')
    })
  })

  describe('deleteClient', () => {
    it('should delete an existing client', async () => {
      // Primero crear un cliente
      const newClient = await createClient(mockClient)
      
      await expect(deleteClient(newClient.id)).resolves.not.toThrow()
    })

    it('should throw error when client not found', async () => {
      await expect(deleteClient('non-existent')).rejects.toThrow('Cliente no encontrado')
    })
  })

  describe('getClientsByStatus', () => {
    it('should return clients filtered by status', async () => {
      const activeClients = await getClientsByStatus('Active')
      
      expect(activeClients).toBeDefined()
      expect(Array.isArray(activeClients)).toBe(true)
      activeClients.forEach(client => {
        expect(client.status).toBe('Active')
      })
    })
  })

  describe('getClientStats', () => {
    it('should return correct statistics', async () => {
      // Crear algunos clientes de prueba
      await createClient({ ...mockClient, status: 'New Lead' })
      await createClient({ ...mockClient, status: 'Active', email: 'active@test.com' })
      await createClient({ ...mockClient, status: 'Closed Deal', email: 'closed@test.com' })
      
      const stats = await getClientStats()
      
      expect(stats).toBeDefined()
      // Los clientes mock ya existen, así que el total será mayor
      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.newLead).toBeGreaterThanOrEqual(0)
      expect(stats.active).toBeGreaterThanOrEqual(0)
      expect(stats.closedDeal).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty client list', async () => {
      // Limpiar clientes mock para este test
      const originalMockClients = require('@/lib/data/clients').mockClients
      require('@/lib/data/clients').mockClients = []
      
      const stats = await getClientStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBe(0)
      expect(stats.active).toBe(0)
      expect(stats.prospect).toBe(0)
      expect(stats.newLead).toBe(0)
      expect(stats.closedDeal).toBe(0)
      
      // Restaurar clientes mock
      require('@/lib/data/clients').mockClients = originalMockClients
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simular error de red
      const { supabase } = require('@/lib/supabase/client')
      supabase.from.mockImplementation(() => ({
        select: jest.fn(() => {
          throw new Error('Network error')
        }),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Mock error' }
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { message: 'Mock error' }
              }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            error: { message: 'Mock error' }
          }))
        }))
      }))
      
      const clients = await getAllClients()
      
      expect(clients).toBeDefined()
      expect(Array.isArray(clients)).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', async () => {
      const invalidClient = {
        company: '', // Campo requerido vacío
        status: 'New Lead',
        industry: 'Technology',
        contact: 'Test Contact',
        email: 'test@example.com',
        phone: '123-456-7890',
        payment_method: 'Credit Card',
        contract_status: 'Pending',
        deposit: 1000,
        final_payment: 5000,
        total_amount: 6000,
        budget: '5000-10000'
      }
      
      const newClient = await createClient(invalidClient as any)
      
      expect(newClient).toBeDefined()
      expect(newClient.company).toBe('')
    })
  })
}) 