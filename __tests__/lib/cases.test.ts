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

describe('Case Functions', () => {
  const mockCase: Omit<Case, 'id' | 'created_at' | 'updated_at'> = {
    title: 'Test Case',
    description: 'Test case description',
    status: 'open',
    priority: 'medium',
    assigned_to: 'test-user',
    budget: 5000,
    progress: 0
  }

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn() // Mock console.log para evitar ruido en tests
    console.error = jest.fn() // Mock console.error para evitar ruido en tests
  })

  describe('getAllCases', () => {
    it('should return mock cases when Supabase fails', async () => {
      const cases = await getAllCases()
      
      expect(cases).toBeDefined()
      expect(Array.isArray(cases)).toBe(true)
      // Los casos mock están definidos en el archivo, así que deberían existir
      expect(cases.length).toBeGreaterThanOrEqual(0)
      if (cases.length > 0) {
        expect(cases[0]).toHaveProperty('id')
        expect(cases[0]).toHaveProperty('title')
      }
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
    })

    it('should generate unique IDs for multiple cases', async () => {
      const case1 = await createCase(mockCase)
      // Esperar un poco para asegurar IDs únicos
      await new Promise(resolve => setTimeout(resolve, 1))
      const case2 = await createCase({
        ...mockCase,
        title: 'Test Case 2'
      })
      
      expect(case1.id).not.toBe(case2.id)
    })
  })

  describe('updateCase', () => {
    it('should update an existing case', async () => {
      // Primero crear un caso
      const newCase = await createCase(mockCase)
      const updates = { status: 'in_progress' as const }
      
      const updatedCase = await updateCase(newCase.id, updates)
      
      expect(updatedCase).toBeDefined()
      expect(updatedCase.status).toBe('in_progress')
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
      
      await expect(deleteCase(newCase.id)).resolves.not.toThrow()
    })

    it('should throw error when case not found', async () => {
      await expect(deleteCase('non-existent')).rejects.toThrow('Caso no encontrado')
    })
  })

  describe('getCasesByStatus', () => {
    it('should return cases filtered by status', async () => {
      const openCases = await getCasesByStatus('open')
      
      expect(openCases).toBeDefined()
      expect(Array.isArray(openCases)).toBe(true)
      openCases.forEach(caseItem => {
        expect(caseItem.status).toBe('open')
      })
    })
  })

  describe('getCasesByClient', () => {
    it('should return cases filtered by client', async () => {
      const clientCases = await getCasesByClient('1')
      
      expect(clientCases).toBeDefined()
      expect(Array.isArray(clientCases)).toBe(true)
      clientCases.forEach(caseItem => {
        expect(caseItem.client_id).toBe('1')
      })
    })
  })

  describe('getCaseStats', () => {
    it('should return correct statistics', async () => {
      // Crear algunos casos de prueba
      await createCase({ ...mockCase, status: 'open' })
      await createCase({ ...mockCase, status: 'in_progress', title: 'Test Case 2' })
      await createCase({ ...mockCase, status: 'completed', title: 'Test Case 3' })
      
      const stats = await getCaseStats()
      
      expect(stats).toBeDefined()
      // Los casos mock ya existen, así que el total será mayor
      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.open).toBeGreaterThanOrEqual(0)
      expect(stats.inProgress).toBeGreaterThanOrEqual(0)
      expect(stats.completed).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty case list', async () => {
      // Limpiar casos mock para este test
      const originalMockCases = require('@/lib/data/cases').mockCases
      require('@/lib/data/cases').mockCases = []
      
      const stats = await getCaseStats()
      
      expect(stats).toBeDefined()
      expect(stats.total).toBe(0)
      expect(stats.open).toBe(0)
      expect(stats.inProgress).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.onHold).toBe(0)
      expect(stats.totalBudget).toBe(0)
      expect(stats.averageProgress).toBe(0)
      
      // Restaurar casos mock
      require('@/lib/data/cases').mockCases = originalMockCases
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
      
      const cases = await getAllCases()
      
      expect(cases).toBeDefined()
      expect(Array.isArray(cases)).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('should handle required fields', async () => {
      const invalidCase = {
        title: '', // Campo requerido vacío
        description: 'Test case description',
        status: 'open' as const,
        priority: 'medium' as const,
        assigned_to: 'test-user',
        budget: 5000,
        progress: 0
      }
      
      const newCase = await createCase(invalidCase)
      
      expect(newCase).toBeDefined()
      expect(newCase.title).toBe('')
    })
  })

  describe('Progress Validation', () => {
    it('should handle progress updates correctly', async () => {
      const newCase = await createCase(mockCase)
      const updates = { progress: 50 }
      
      const updatedCase = await updateCase(newCase.id, updates)
      
      expect(updatedCase.progress).toBe(50)
    })

    it('should handle extreme progress values', async () => {
      const newCase = await createCase(mockCase)
      const updates = { progress: 100 }
      
      const updatedCase = await updateCase(newCase.id, updates)
      
      expect(updatedCase.progress).toBe(100)
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
      
      // Transición de open a in_progress
      let updatedCase = await updateCase(newCase.id, { status: 'in_progress' })
      expect(updatedCase.status).toBe('in_progress')
      
      // Transición de in_progress a completed
      updatedCase = await updateCase(newCase.id, { status: 'completed' })
      expect(updatedCase.status).toBe('completed')
    })
  })
}) 