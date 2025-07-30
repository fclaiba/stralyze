import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock de Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              insert: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn()
                }))
              })),
              update: jest.fn(() => ({
                eq: jest.fn(() => ({
                  select: jest.fn(() => ({
                    single: jest.fn()
                  }))
                }))
              })),
              delete: jest.fn(() => ({
                eq: jest.fn()
              }))
            }))
          }))
        }))
      }))
    }))
  }))
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

describe('Email Marketing Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Campaign Functions', () => {
    it('should get email campaigns successfully', async () => {
      const mockCampaigns = [
        {
          id: '1',
          name: 'Test Campaign',
          template_id: 'template-1',
          segment: 'new_lead',
          status: 'draft',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      mockEmailData.getEmailCampaigns.mockResolvedValue(mockCampaigns)

      const campaigns = await mockEmailData.getEmailCampaigns()
      
      expect(campaigns).toEqual(mockCampaigns)
      expect(mockEmailData.getEmailCampaigns).toHaveBeenCalledTimes(1)
    })

    it('should create email campaign successfully', async () => {
      const campaignData = {
        name: 'New Campaign',
        template_id: 'template-1',
        segment: 'new_lead',
        status: 'draft'
      }

      const mockCreatedCampaign = {
        id: '2',
        ...campaignData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockEmailData.createEmailCampaign.mockResolvedValue(mockCreatedCampaign)

      const result = await mockEmailData.createEmailCampaign(campaignData)
      
      expect(result).toEqual(mockCreatedCampaign)
      expect(mockEmailData.createEmailCampaign).toHaveBeenCalledWith(campaignData)
    })

    it('should update email campaign successfully', async () => {
      const campaignId = '1'
      const updateData = {
        name: 'Updated Campaign',
        status: 'scheduled'
      }

      const mockUpdatedCampaign = {
        id: campaignId,
        ...updateData,
        template_id: 'template-1',
        segment: 'new_lead',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }

      mockEmailData.updateEmailCampaign.mockResolvedValue(mockUpdatedCampaign)

      const result = await mockEmailData.updateEmailCampaign(campaignId, updateData)
      
      expect(result).toEqual(mockUpdatedCampaign)
      expect(mockEmailData.updateEmailCampaign).toHaveBeenCalledWith(campaignId, updateData)
    })
  })

  describe('Template Functions', () => {
    it('should get email templates successfully', async () => {
      const mockTemplates = [
        {
          id: '1',
          name: 'Welcome Template',
          subject: 'Welcome!',
          content: '<h1>Welcome</h1>',
          segment: 'new_lead',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      mockEmailData.getEmailTemplates.mockResolvedValue(mockTemplates)

      const templates = await mockEmailData.getEmailTemplates()
      
      expect(templates).toEqual(mockTemplates)
      expect(mockEmailData.getEmailTemplates).toHaveBeenCalledTimes(1)
    })

    it('should create email template successfully', async () => {
      const templateData = {
        name: 'New Template',
        subject: 'New Subject',
        content: '<h1>New Content</h1>',
        segment: 'new_lead'
      }

      const mockCreatedTemplate = {
        id: '2',
        ...templateData,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockEmailData.createEmailTemplate.mockResolvedValue(mockCreatedTemplate)

      const result = await mockEmailData.createEmailTemplate(templateData)
      
      expect(result).toEqual(mockCreatedTemplate)
      expect(mockEmailData.createEmailTemplate).toHaveBeenCalledWith(templateData)
    })
  })

  describe('Tracking Functions', () => {
    it('should get email tracking successfully', async () => {
      const campaignId = '1'
      const mockTracking = [
        {
          id: '1',
          campaign_id: campaignId,
          recipient_email: 'test@example.com',
          opened: true,
          clicked: false,
          bounced: false,
          unsubscribed: false,
          created_at: '2024-01-01T00:00:00Z'
        }
      ]

      mockEmailData.getEmailTracking.mockResolvedValue(mockTracking)

      const tracking = await mockEmailData.getEmailTracking(campaignId)
      
      expect(tracking).toEqual(mockTracking)
      expect(mockEmailData.getEmailTracking).toHaveBeenCalledWith(campaignId)
    })

    it('should update tracking status successfully', async () => {
      const campaignId = '1'
      const recipientEmail = 'test@example.com'
      const status = 'opened'

      mockEmailData.updateTrackingStatus.mockResolvedValue(undefined)

      await mockEmailData.updateTrackingStatus(campaignId, recipientEmail, status)
      
      expect(mockEmailData.updateTrackingStatus).toHaveBeenCalledWith(campaignId, recipientEmail, status)
    })
  })

  describe('Analytics Functions', () => {
    it('should get email analytics successfully', async () => {
      const timeRange = '30days'
      const mockAnalytics = [
        {
          id: '1',
          campaignId: '1',
          date: '2024-01-01',
          opens: 100,
          clicks: 20,
          conversions: 5,
          bounces: 2,
          unsubscribes: 1
        }
      ]

      mockEmailData.getEmailAnalytics.mockResolvedValue(mockAnalytics)

      const analytics = await mockEmailData.getEmailAnalytics(timeRange)
      
      expect(analytics).toEqual(mockAnalytics)
      expect(mockEmailData.getEmailAnalytics).toHaveBeenCalledWith(timeRange)
    })
  })

  describe('Error Handling', () => {
    it('should handle errors in getEmailCampaigns', async () => {
      const errorMessage = 'Database connection failed'
      mockEmailData.getEmailCampaigns.mockRejectedValue(new Error(errorMessage))

      await expect(mockEmailData.getEmailCampaigns()).rejects.toThrow(errorMessage)
    })

    it('should handle errors in createEmailCampaign', async () => {
      const errorMessage = 'Invalid campaign data'
      mockEmailData.createEmailCampaign.mockRejectedValue(new Error(errorMessage))

      await expect(mockEmailData.createEmailCampaign({})).rejects.toThrow(errorMessage)
    })
  })
}) 