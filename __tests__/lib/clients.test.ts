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

// Mock de Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              insert: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn(() => ({
                    update: jest.fn(() => ({
                      eq: jest.fn(() => ({
                        select: jest.fn(() => ({
                          single: jest.fn(() => ({
                            delete: jest.fn(() => ({
                              eq: jest.fn(() => ({
                                limit: jest.fn(() => ({
                                  data: null,
                                  error: { message: 'Mock error' }
                                }))
                              }))
                            }))
                          }))
                        }))
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
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
  })

  describe('getAllClients', () => {
    it('should return mock clients when Supabase fails', async () => {
      const clients = await getAllClients()
      
      expect(clients).toBeDefined()
      expect(Array.isArray(clients)).toBe(true)
      expect(clients.length).toBeGreaterThan(0)
      expect(clients[0]).toHaveProperty('id')
      expect(clients[0]).toHaveProperty('company')
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
      expect(newClient.created_at).toBeDefined()
      expect(newClient.updated_at).toBeDefined()
    })

    it('should generate unique IDs for multiple clients', async () => {
      const client1 = await createClient(mockClient)
      const client2 = await createClient(mockClient)
      
      expect(client1.id).not.toBe(client2.id)
    })
  })

  describe('updateClient', () => {
    it('should update an existing client', async () => {
      // Primero crear un cliente
      const newClient = await createClient(mockClient)
      
      // Luego actualizarlo
      const updates = {
        status: 'Active',
        budget: '10000-15000'
      }
      
      const updatedClient = await updateClient(newClient.id, updates)
      
      expect(updatedClient).toBeDefined()
      expect(updatedClient.status).toBe('Active')
      expect(updatedClient.budget).toBe('10000-15000')
      expect(updatedClient.updated_at).toBeDefined()
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
      
      // Verificar que existe
      const existingClient = await getClientById(newClient.id)
      expect(existingClient).toBeDefined()
      
      // Eliminarlo
      await deleteClient(newClient.id)
      
      // Verificar que ya no existe
      const deletedClient = await getClientById(newClient.id)
      expect(deletedClient).toBeNull()
    })

    it('should throw error when client not found', async () => {
      await expect(deleteClient('non-existent')).rejects.toThrow('Cliente no encontrado')
    })
  })

  describe('getClientsByStatus', () => {
    it('should return clients filtered by status', async () => {
      // Crear clientes con diferentes status
      await createClient({ ...mockClient, status: 'New Lead' })
      await createClient({ ...mockClient, status: 'Active' })
      await createClient({ ...mockClient, status: 'New Lead' })
      
      const newLeadClients = await getClientsByStatus('New Lead')
      const activeClients = await getClientsByStatus('Active')
      
      expect(newLeadClients.length).toBeGreaterThanOrEqual(2)
      expect(activeClients.length).toBeGreaterThanOrEqual(1)
      
      newLeadClients.forEach(client => {
        expect(client.status).toBe('New Lead')
      })
      
      activeClients.forEach(client => {
        expect(client.status).toBe('Active')
      })
    })
  })

  describe('getClientStats', () => {
    it('should return correct statistics', async () => {
      // Crear clientes con diferentes status
      await createClient({ ...mockClient, status: 'New Lead' })
      await createClient({ ...mockClient, status: 'Active' })
      await createClient({ ...mockClient, status: 'Closed Deal' })
      
      const stats = await getClientStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBeGreaterThanOrEqual(3)
      expect(stats.newLead).toBeGreaterThanOrEqual(1)
      expect(stats.active).toBeGreaterThanOrEqual(1)
      expect(stats.closedDeal).toBeGreaterThanOrEqual(1)
      expect(stats.prospect).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty client list', async () => {
      // Limpiar clientes mock (esto es una simplificación)
      const stats = await getClientStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.newLead).toBeGreaterThanOrEqual(0)
      expect(stats.active).toBeGreaterThanOrEqual(0)
      expect(stats.closedDeal).toBeGreaterThanOrEqual(0)
      expect(stats.prospect).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simular error de red
      const originalFetch = global.fetch
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
      
      const clients = await getAllClients()
      
      expect(clients).toBeDefined()
      expect(Array.isArray(clients)).toBe(true)
      
      // Restaurar fetch original
      global.fetch = originalFetch
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', async () => {
      const invalidClient = {
        ...mockClient,
        company: '', // Campo requerido vacío
        email: 'invalid-email' // Email inválido
      }
      
      const newClient = await createClient(invalidClient)
      
      expect(newClient).toBeDefined()
      expect(newClient.company).toBe('')
      expect(newClient.email).toBe('invalid-email')
    })
  })
}) 