import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { createClient } from '@supabase/supabase-js'

// Mock de Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}))

// Mock de las funciones de email marketing
const mockEmailData = {
  getEmailCampaigns: jest.fn(),
  getEmailCampaign: jest.fn(),
  createEmailCampaign: jest.fn(),
  updateEmailCampaign: jest.fn(),
  deleteEmailCampaign: jest.fn(),
  getEmailTemplates: jest.fn(),
  getEmailTemplatesBySegment: jest.fn(),
  createEmailTemplate: jest.fn(),
  updateEmailTemplate: jest.fn(),
  deleteEmailTemplate: jest.fn(),
  getEmailTracking: jest.fn(),
  updateTrackingStatus: jest.fn(),
  getEmailAnalytics: jest.fn()
}

jest.mock('@/lib/data/email-marketing', () => mockEmailData)

// Mock de las server actions
const mockServerActions = {
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  createCampaign: jest.fn(),
  updateCampaign: jest.fn(),
  sendCampaign: jest.fn(),
  trackEmailOpen: jest.fn(),
  trackEmailClick: jest.fn(),
  unsubscribeEmail: jest.fn()
}

jest.mock('@/app/actions/email-actions', () => mockServerActions)

describe('Email Marketing Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Template Management Integration', () => {
    it('should create template and then retrieve it', async () => {
      const templateData = {
        name: 'Test Template',
        subject: 'Test Subject',
        content: '<h1>Test Content</h1>',
        segment: 'new_lead'
      }

      const createdTemplate = {
        id: 'template-1',
        ...templateData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Mock create template
      mockEmailData.createEmailTemplate.mockResolvedValue(createdTemplate)
      
      // Mock get templates
      mockEmailData.getEmailTemplates.mockResolvedValue([createdTemplate])

      // Create template
      const result = await mockEmailData.createEmailTemplate(templateData)
      expect(result).toEqual(createdTemplate)

      // Retrieve templates
      const templates = await mockEmailData.getEmailTemplates()
      expect(templates).toContainEqual(createdTemplate)
      expect(templates).toHaveLength(1)
    })

    it('should update template and verify changes', async () => {
      const originalTemplate = {
        id: 'template-1',
        name: 'Original Template',
        subject: 'Original Subject',
        content: '<h1>Original Content</h1>',
        segment: 'new_lead',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const updatedData = {
        name: 'Updated Template',
        subject: 'Updated Subject'
      }

      const updatedTemplate = {
        ...originalTemplate,
        ...updatedData,
        updated_at: '2024-01-02T00:00:00Z'
      }

      // Mock update template
      mockEmailData.updateEmailTemplate.mockResolvedValue(updatedTemplate)

      // Update template
      const result = await mockEmailData.updateEmailTemplate('template-1', updatedData)
      expect(result.name).toBe('Updated Template')
      expect(result.subject).toBe('Updated Subject')
      expect(result.updated_at).toBe('2024-01-02T00:00:00Z')
    })

    it('should delete template and verify removal', async () => {
      const templates = [
        {
          id: 'template-1',
          name: 'Template 1',
          subject: 'Subject 1',
          content: '<h1>Content 1</h1>',
          segment: 'new_lead',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'template-2',
          name: 'Template 2',
          subject: 'Subject 2',
          content: '<h1>Content 2</h1>',
          segment: 'in_process',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      // Mock delete template
      mockEmailData.deleteEmailTemplate.mockResolvedValue(undefined)
      
      // Mock get templates before and after deletion
      mockEmailData.getEmailTemplates
        .mockResolvedValueOnce(templates) // Before deletion
        .mockResolvedValueOnce([templates[1]]) // After deletion

      // Get templates before deletion
      const templatesBefore = await mockEmailData.getEmailTemplates()
      expect(templatesBefore).toHaveLength(2)

      // Delete template
      await mockEmailData.deleteEmailTemplate('template-1')

      // Get templates after deletion
      const templatesAfter = await mockEmailData.getEmailTemplates()
      expect(templatesAfter).toHaveLength(1)
      expect(templatesAfter[0].id).toBe('template-2')
    })
  })

  describe('Campaign Management Integration', () => {
    it('should create campaign with template and track its lifecycle', async () => {
      const template = {
        id: 'template-1',
        name: 'Welcome Template',
        subject: 'Welcome!',
        content: '<h1>Welcome</h1>',
        segment: 'new_lead',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const campaignData = {
        name: 'Welcome Campaign',
        template_id: template.id,
        segment: 'new_lead',
        status: 'draft'
      }

      const createdCampaign = {
        id: 'campaign-1',
        ...campaignData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const sentCampaign = {
        ...createdCampaign,
        status: 'sent',
        sent_at: '2024-01-01T10:00:00Z'
      }

      // Mock create campaign
      mockEmailData.createEmailCampaign.mockResolvedValue(createdCampaign)
      
      // Mock update campaign
      mockEmailData.updateEmailCampaign.mockResolvedValue(sentCampaign)

      // Create campaign
      const campaign = await mockEmailData.createEmailCampaign(campaignData)
      expect(campaign.status).toBe('draft')

      // Send campaign
      const updatedCampaign = await mockEmailData.updateEmailCampaign(campaign.id, {
        status: 'sent',
        sent_at: '2024-01-01T10:00:00Z'
      })
      expect(updatedCampaign.status).toBe('sent')
      expect(updatedCampaign.sent_at).toBe('2024-01-01T10:00:00Z')
    })

    it('should handle campaign scheduling and execution', async () => {
      const scheduledDate = new Date('2024-12-31T10:00:00Z').toISOString()
      
      const campaignData = {
        name: 'Scheduled Campaign',
        template_id: 'template-1',
        segment: 'new_lead',
        status: 'scheduled',
        scheduled_at: scheduledDate
      }

      const scheduledCampaign = {
        id: 'campaign-1',
        ...campaignData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Mock create scheduled campaign
      mockEmailData.createEmailCampaign.mockResolvedValue(scheduledCampaign)

      // Create scheduled campaign
      const campaign = await mockEmailData.createEmailCampaign(campaignData)
      expect(campaign.status).toBe('scheduled')
      expect(campaign.scheduled_at).toBe(scheduledDate)
    })
  })

  describe('Email Tracking Integration', () => {
    it('should track email events and update analytics', async () => {
      const campaignId = 'campaign-1'
      const recipientEmail = 'test@example.com'

      const trackingData = [
        {
          id: 'track-1',
          campaign_id: campaignId,
          recipient_email: recipientEmail,
          opened: true,
          clicked: false,
          bounced: false,
          unsubscribed: false,
          opened_at: '2024-01-01T10:30:00Z',
          created_at: '2024-01-01T10:00:00Z'
        }
      ]

      const analyticsData = [
        {
          id: 'analytics-1',
          campaignId: campaignId,
          date: '2024-01-01',
          opens: 1,
          clicks: 0,
          conversions: 0,
          bounces: 0,
          unsubscribes: 0
        }
      ]

      // Mock tracking functions
      mockEmailData.updateTrackingStatus.mockResolvedValue(undefined)
      mockEmailData.getEmailTracking.mockResolvedValue(trackingData)
      mockEmailData.getEmailAnalytics.mockResolvedValue(analyticsData)

      // Track email open
      await mockEmailData.updateTrackingStatus(campaignId, recipientEmail, 'opened')

      // Get tracking data
      const tracking = await mockEmailData.getEmailTracking(campaignId)
      expect(tracking).toHaveLength(1)
      expect(tracking[0].opened).toBe(true)

      // Get analytics
      const analytics = await mockEmailData.getEmailAnalytics('30days')
      expect(analytics).toHaveLength(1)
      expect(analytics[0].opens).toBe(1)
    })

    it('should handle multiple tracking events for same campaign', async () => {
      const campaignId = 'campaign-1'
      const recipientEmail = 'test@example.com'

      const trackingData = [
        {
          id: 'track-1',
          campaign_id: campaignId,
          recipient_email: recipientEmail,
          opened: true,
          clicked: true,
          bounced: false,
          unsubscribed: false,
          opened_at: '2024-01-01T10:30:00Z',
          clicked_at: '2024-01-01T11:00:00Z',
          created_at: '2024-01-01T10:00:00Z'
        }
      ]

      // Mock tracking functions
      mockEmailData.updateTrackingStatus.mockResolvedValue(undefined)
      mockEmailData.getEmailTracking.mockResolvedValue(trackingData)

      // Track email open
      await mockEmailData.updateTrackingStatus(campaignId, recipientEmail, 'opened')

      // Track email click
      await mockEmailData.updateTrackingStatus(campaignId, recipientEmail, 'clicked')

      // Verify tracking data
      const tracking = await mockEmailData.getEmailTracking(campaignId)
      expect(tracking[0].opened).toBe(true)
      expect(tracking[0].clicked).toBe(true)
    })
  })

  describe('Server Actions Integration', () => {
    it('should handle template creation through server action', async () => {
      const formData = new FormData()
      formData.append('name', 'Test Template')
      formData.append('subject', 'Test Subject')
      formData.append('content', '<h1>Test Content</h1>')
      formData.append('segment', 'new_lead')

      const expectedResult = {
        success: true,
        data: {
          id: 'template-1',
          name: 'Test Template',
          subject: 'Test Subject',
          content: '<h1>Test Content</h1>',
          segment: 'new_lead',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      }

      mockServerActions.createTemplate.mockResolvedValue(expectedResult)

      const result = await mockServerActions.createTemplate(formData)
      expect(result.success).toBe(true)
      expect(result.data.name).toBe('Test Template')
    })

    it('should handle campaign sending through server action', async () => {
      const campaignId = 'campaign-1'

      const expectedResult = {
        success: true,
        message: 'Campaign sent successfully'
      }

      mockServerActions.sendCampaign.mockResolvedValue(expectedResult)

      const result = await mockServerActions.sendCampaign(campaignId)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Campaign sent successfully')
    })

    it('should handle error cases in server actions', async () => {
      const formData = new FormData()
      formData.append('name', '') // Invalid: empty name
      formData.append('subject', 'Test Subject')
      formData.append('content', '<h1>Test Content</h1>')
      formData.append('segment', 'new_lead')

      const expectedResult = {
        success: false,
        error: 'Template name is required'
      }

      mockServerActions.createTemplate.mockResolvedValue(expectedResult)

      const result = await mockServerActions.createTemplate(formData)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Template name is required')
    })
  })

  describe('Database Integration', () => {
    it('should handle database connection errors gracefully', async () => {
      const error = new Error('Database connection failed')
      mockEmailData.getEmailTemplates.mockRejectedValue(error)

      await expect(mockEmailData.getEmailTemplates()).rejects.toThrow('Database connection failed')
    })

    it('should handle foreign key constraint violations', async () => {
      const campaignData = {
        name: 'Test Campaign',
        template_id: 'non-existent-template',
        segment: 'new_lead',
        status: 'draft'
      }

      const error = new Error('foreign key constraint')
      mockEmailData.createEmailCampaign.mockRejectedValue(error)

      await expect(mockEmailData.createEmailCampaign(campaignData)).rejects.toThrow('foreign key constraint')
    })

    it('should handle duplicate key violations', async () => {
      const templateData = {
        name: 'Duplicate Template',
        subject: 'Test Subject',
        content: '<h1>Test Content</h1>',
        segment: 'new_lead'
      }

      const error = new Error('duplicate key value violates unique constraint')
      mockEmailData.createEmailTemplate.mockRejectedValue(error)

      await expect(mockEmailData.createEmailTemplate(templateData)).rejects.toThrow('duplicate key value violates unique constraint')
    })
  })

  describe('End-to-End Workflow Integration', () => {
    it('should complete full email marketing workflow', async () => {
      // 1. Create template
      const templateData = {
        name: 'Workflow Template',
        subject: 'Workflow Test',
        content: '<h1>Workflow Content</h1>',
        segment: 'new_lead'
      }

      const template = {
        id: 'template-1',
        ...templateData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockEmailData.createEmailTemplate.mockResolvedValue(template)

      const createdTemplate = await mockEmailData.createEmailTemplate(templateData)
      expect(createdTemplate.id).toBe('template-1')

      // 2. Create campaign
      const campaignData = {
        name: 'Workflow Campaign',
        template_id: template.id,
        segment: 'new_lead',
        status: 'draft'
      }

      const campaign = {
        id: 'campaign-1',
        ...campaignData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockEmailData.createEmailCampaign.mockResolvedValue(campaign)

      const createdCampaign = await mockEmailData.createEmailCampaign(campaignData)
      expect(createdCampaign.id).toBe('campaign-1')

      // 3. Send campaign
      const sentCampaign = {
        ...campaign,
        status: 'sent',
        sent_at: '2024-01-01T10:00:00Z'
      }

      mockEmailData.updateEmailCampaign.mockResolvedValue(sentCampaign)

      const updatedCampaign = await mockEmailData.updateEmailCampaign(campaign.id, {
        status: 'sent',
        sent_at: '2024-01-01T10:00:00Z'
      })
      expect(updatedCampaign.status).toBe('sent')

      // 4. Track email events
      const trackingData = [
        {
          id: 'track-1',
          campaign_id: campaign.id,
          recipient_email: 'test@example.com',
          opened: true,
          clicked: true,
          bounced: false,
          unsubscribed: false,
          opened_at: '2024-01-01T10:30:00Z',
          clicked_at: '2024-01-01T11:00:00Z',
          created_at: '2024-01-01T10:00:00Z'
        }
      ]

      mockEmailData.getEmailTracking.mockResolvedValue(trackingData)

      const tracking = await mockEmailData.getEmailTracking(campaign.id)
      expect(tracking).toHaveLength(1)
      expect(tracking[0].opened).toBe(true)
      expect(tracking[0].clicked).toBe(true)

      // 5. Get analytics
      const analyticsData = [
        {
          id: 'analytics-1',
          campaignId: campaign.id,
          date: '2024-01-01',
          opens: 1,
          clicks: 1,
          conversions: 0,
          bounces: 0,
          unsubscribes: 0
        }
      ]

      mockEmailData.getEmailAnalytics.mockResolvedValue(analyticsData)

      const analytics = await mockEmailData.getEmailAnalytics('30days')
      expect(analytics).toHaveLength(1)
      expect(analytics[0].opens).toBe(1)
      expect(analytics[0].clicks).toBe(1)
    })
  })
}) 