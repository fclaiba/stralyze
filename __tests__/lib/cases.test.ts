import { 
  getAllCases, 
  getCaseById, 
  createCase, 
  updateCase, 
  deleteCase, 
  getCasesByStatus,
  getCasesByClient,
  getCaseStats,
  type Case 
} from '@/lib/data/cases'

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

describe('Case Functions', () => {
  const mockCase: Omit<Case, 'id' | 'created_at' | 'updated_at'> = {
    title: 'Test Case',
    description: 'Test case description',
    status: 'open',
    priority: 'medium',
    assigned_to: 'test-user',
    budget: 10000,
    progress: 0
  }

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn() // Mock console.log para evitar ruido en tests
  })

  describe('getAllCases', () => {
    it('should return mock cases when Supabase fails', async () => {
      const cases = await getAllCases()
      
      expect(cases).toBeDefined()
      expect(Array.isArray(cases)).toBe(true)
      expect(cases.length).toBeGreaterThan(0)
      expect(cases[0]).toHaveProperty('id')
      expect(cases[0]).toHaveProperty('title')
    })
  })

  describe('getCaseById', () => {
    it('should return a case when found', async () => {
      const caseItem = await getCaseById('1')
      
      expect(caseItem).toBeDefined()
      expect(caseItem?.id).toBe('1')
      expect(caseItem?.title).toBe('Website Redesign')
    })

    it('should return null when case not found', async () => {
      const caseItem = await getCaseById('non-existent')
      
      expect(caseItem).toBeNull()
    })
  })

  describe('createCase', () => {
    it('should create a new case with mock data', async () => {
      const newCase = await createCase(mockCase)
      
      expect(newCase).toBeDefined()
      expect(newCase.id).toMatch(/^mock-\d+$/)
      expect(newCase.title).toBe(mockCase.title)
      expect(newCase.description).toBe(mockCase.description)
      expect(newCase.status).toBe(mockCase.status)
      expect(newCase.priority).toBe(mockCase.priority)
      expect(newCase.budget).toBe(mockCase.budget)
      expect(newCase.progress).toBe(mockCase.progress)
      expect(newCase.created_at).toBeDefined()
      expect(newCase.updated_at).toBeDefined()
    })

    it('should generate unique IDs for multiple cases', async () => {
      const case1 = await createCase(mockCase)
      const case2 = await createCase(mockCase)
      
      expect(case1.id).not.toBe(case2.id)
    })
  })

  describe('updateCase', () => {
    it('should update an existing case', async () => {
      // Primero crear un caso
      const newCase = await createCase(mockCase)
      
      // Luego actualizarlo
      const updates = {
        status: 'in_progress' as const,
        progress: 50,
        budget: 15000
      }
      
      const updatedCase = await updateCase(newCase.id, updates)
      
      expect(updatedCase).toBeDefined()
      expect(updatedCase.status).toBe('in_progress')
      expect(updatedCase.progress).toBe(50)
      expect(updatedCase.budget).toBe(15000)
      expect(updatedCase.updated_at).toBeDefined()
    })

    it('should throw error when case not found', async () => {
      const updates = { status: 'in_progress' as const }
      
      await expect(updateCase('non-existent', updates)).rejects.toThrow('Caso no encontrado')
    })
  })

  describe('deleteCase', () => {
    it('should delete an existing case', async () => {
      // Primero crear un caso
      const newCase = await createCase(mockCase)
      
      // Verificar que existe
      const existingCase = await getCaseById(newCase.id)
      expect(existingCase).toBeDefined()
      
      // Eliminarlo
      await deleteCase(newCase.id)
      
      // Verificar que ya no existe
      const deletedCase = await getCaseById(newCase.id)
      expect(deletedCase).toBeNull()
    })

    it('should throw error when case not found', async () => {
      await expect(deleteCase('non-existent')).rejects.toThrow('Caso no encontrado')
    })
  })

  describe('getCasesByStatus', () => {
    it('should return cases filtered by status', async () => {
      // Crear casos con diferentes status
      await createCase({ ...mockCase, status: 'open' })
      await createCase({ ...mockCase, status: 'in_progress' })
      await createCase({ ...mockCase, status: 'open' })
      
      const openCases = await getCasesByStatus('open')
      const inProgressCases = await getCasesByStatus('in_progress')
      
      expect(openCases.length).toBeGreaterThanOrEqual(2)
      expect(inProgressCases.length).toBeGreaterThanOrEqual(1)
      
      openCases.forEach(caseItem => {
        expect(caseItem.status).toBe('open')
      })
      
      inProgressCases.forEach(caseItem => {
        expect(caseItem.status).toBe('in_progress')
      })
    })
  })

  describe('getCasesByClient', () => {
    it('should return cases filtered by client', async () => {
      // Crear casos con diferentes clientes
      await createCase({ ...mockCase, client_id: 'client-1' })
      await createCase({ ...mockCase, client_id: 'client-2' })
      await createCase({ ...mockCase, client_id: 'client-1' })
      
      const client1Cases = await getCasesByClient('client-1')
      const client2Cases = await getCasesByClient('client-2')
      
      expect(client1Cases.length).toBeGreaterThanOrEqual(2)
      expect(client2Cases.length).toBeGreaterThanOrEqual(1)
      
      client1Cases.forEach(caseItem => {
        expect(caseItem.client_id).toBe('client-1')
      })
      
      client2Cases.forEach(caseItem => {
        expect(caseItem.client_id).toBe('client-2')
      })
    })
  })

  describe('getCaseStats', () => {
    it('should return correct statistics', async () => {
      // Crear casos con diferentes status y presupuestos
      await createCase({ ...mockCase, status: 'open', budget: 10000 })
      await createCase({ ...mockCase, status: 'in_progress', budget: 15000 })
      await createCase({ ...mockCase, status: 'completed', budget: 20000 })
      await createCase({ ...mockCase, status: 'on_hold', budget: 5000 })
      
      const stats = await getCaseStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBeGreaterThanOrEqual(4)
      expect(stats.open).toBeGreaterThanOrEqual(1)
      expect(stats.inProgress).toBeGreaterThanOrEqual(1)
      expect(stats.completed).toBeGreaterThanOrEqual(1)
      expect(stats.onHold).toBeGreaterThanOrEqual(1)
      expect(stats.totalBudget).toBeGreaterThanOrEqual(50000)
      expect(stats.averageProgress).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty case list', async () => {
      const stats = await getCaseStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.open).toBeGreaterThanOrEqual(0)
      expect(stats.inProgress).toBeGreaterThanOrEqual(0)
      expect(stats.completed).toBeGreaterThanOrEqual(0)
      expect(stats.onHold).toBeGreaterThanOrEqual(0)
      expect(stats.totalBudget).toBeGreaterThanOrEqual(0)
      expect(stats.averageProgress).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simular error de red
      const originalFetch = global.fetch
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
      
      const cases = await getAllCases()
      
      expect(cases).toBeDefined()
      expect(Array.isArray(cases)).toBe(true)
      
      // Restaurar fetch original
      global.fetch = originalFetch
    })
  })

  describe('Data Validation', () => {
    it('should handle required fields', async () => {
      const invalidCase = {
        ...mockCase,
        title: '', // Campo requerido vacío
        budget: -1000 // Presupuesto negativo
      }
      
      const newCase = await createCase(invalidCase)
      
      expect(newCase).toBeDefined()
      expect(newCase.title).toBe('')
      expect(newCase.budget).toBe(-1000)
    })
  })

  describe('Progress Validation', () => {
    it('should handle progress updates correctly', async () => {
      const newCase = await createCase(mockCase)
      
      // Actualizar progreso
      const updatedCase = await updateCase(newCase.id, { progress: 75 })
      
      expect(updatedCase.progress).toBe(75)
      expect(updatedCase.progress).toBeGreaterThanOrEqual(0)
      expect(updatedCase.progress).toBeLessThanOrEqual(100)
    })

    it('should handle extreme progress values', async () => {
      const newCase = await createCase(mockCase)
      
      // Probar valores extremos
      const updatedCase = await updateCase(newCase.id, { progress: 150 })
      
      expect(updatedCase.progress).toBe(150) // El sistema permite valores > 100
    })
  })

  describe('Priority Levels', () => {
    it('should handle all priority levels', async () => {
      const priorities: Case['priority'][] = ['low', 'medium', 'high', 'urgent']
      
      for (const priority of priorities) {
        const newCase = await createCase({ ...mockCase, priority })
        expect(newCase.priority).toBe(priority)
      }
    })
  })

  describe('Status Transitions', () => {
    it('should handle status transitions correctly', async () => {
      const newCase = await createCase(mockCase)
      
      // Transición: open -> in_progress -> completed
      const inProgressCase = await updateCase(newCase.id, { status: 'in_progress' })
      expect(inProgressCase.status).toBe('in_progress')
      
      const completedCase = await updateCase(newCase.id, { status: 'completed' })
      expect(completedCase.status).toBe('completed')
    })
  })
}) 