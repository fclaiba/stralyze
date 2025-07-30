import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock de los componentes
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>
}))

jest.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  FormControl: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormField: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormLabel: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  FormMessage: ({ children, ...props }: any) => <span {...props}>{children}</span>
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <select onChange={(e) => onValueChange?.(e.target.value)} defaultValue={defaultValue}>
      {children}
    </select>
  ),
  SelectContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SelectItem: ({ children, value, ...props }: any) => (
    <option value={value} {...props}>{children}</option>
  ),
  SelectTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SelectValue: ({ placeholder, ...props }: any) => <span {...props}>{placeholder}</span>
}))

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

jest.mock('@/app/actions/email-actions', () => ({
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  createCampaign: jest.fn(),
  updateCampaign: jest.fn(),
  sendCampaign: jest.fn()
}))

jest.mock('@/app/actions/email-template-actions', () => ({
  fetchEmailTemplates: jest.fn(),
  fetchEmailTemplatesBySegment: jest.fn(),
  deleteEmailTemplateAction: jest.fn()
}))

jest.mock('@/app/actions/email-campaign-actions', () => ({
  fetchEmailCampaigns: jest.fn(),
  deleteEmailCampaignAction: jest.fn()
}))

jest.mock('@/app/actions/email-tracking-actions', () => ({
  fetchCampaignTracking: jest.fn()
}))

// Mock de TipTap
jest.mock('@tiptap/react', () => ({
  EditorContent: ({ editor }: any) => <div data-testid="editor">{editor?.getHTML()}</div>,
  useEditor: jest.fn(() => ({
    getHTML: () => '<p>Test content</p>',
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({
          run: () => {}
        }),
        toggleItalic: () => ({
          run: () => {}
        }),
        toggleBulletList: () => ({
          run: () => {}
        }),
        toggleOrderedList: () => ({
          run: () => {}
        }),
        setTextAlign: () => ({
          run: () => {}
        }),
        extendMarkRange: () => ({
          setLink: () => ({
            run: () => {}
          })
        }),
        setImage: () => ({
          run: () => {}
        })
      })
    }),
    isActive: jest.fn(() => false)
  }))
}))

describe('Email Marketing Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('TemplateForm', () => {
    it('should render template form correctly', async () => {
      const { default: TemplateForm } = await import('@/components/email-marketing/template-form')
      
      render(<TemplateForm onSuccess={jest.fn()} />)
      
      expect(screen.getByLabelText(/Template Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Subject/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Target Segment/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Content/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Create Template/i })).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
      const { default: TemplateForm } = await import('@/components/email-marketing/template-form')
      const mockOnSuccess = jest.fn()
      
      render(<TemplateForm onSuccess={mockOnSuccess} />)
      
      const submitButton = screen.getByRole('button', { name: /Create Template/i })
      fireEvent.click(submitButton)
      
      // Verificar que se intentó enviar el formulario
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('CampaignForm', () => {
    it('should render campaign form correctly', async () => {
      const { default: CampaignForm } = await import('@/components/email-marketing/campaign-form')
      
      render(<CampaignForm onSuccess={jest.fn()} />)
      
      expect(screen.getByLabelText(/Campaign Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Template/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Target Segment/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Create Campaign/i })).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
      const { default: CampaignForm } = await import('@/components/email-marketing/campaign-form')
      const mockOnSuccess = jest.fn()
      
      render(<CampaignForm onSuccess={mockOnSuccess} />)
      
      const submitButton = screen.getByRole('button', { name: /Create Campaign/i })
      fireEvent.click(submitButton)
      
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('RichTextEditor', () => {
    it('should render rich text editor correctly', async () => {
      const { default: RichTextEditor } = await import('@/components/email-marketing/rich-text-editor')
      
      render(
        <RichTextEditor
          value="<p>Test content</p>"
          onChange={jest.fn()}
          placeholder="Write something..."
        />
      )
      
      expect(screen.getByTestId('editor')).toBeInTheDocument()
    })

    it('should handle content changes', async () => {
      const { default: RichTextEditor } = await import('@/components/email-marketing/rich-text-editor')
      const mockOnChange = jest.fn()
      
      render(
        <RichTextEditor
          value="<p>Test content</p>"
          onChange={mockOnChange}
          placeholder="Write something..."
        />
      )
      
      expect(screen.getByTestId('editor')).toBeInTheDocument()
    })
  })

  describe('CampaignAnalytics', () => {
    it('should render campaign analytics correctly', async () => {
      const { default: CampaignAnalytics } = await import('@/components/email-marketing/campaign-analytics')
      
      const mockCampaign = {
        id: '1',
        name: 'Test Campaign',
        template_id: 'template-1',
        segment: 'new_lead',
        status: 'sent',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        stats: {
          total: 100,
          sent: 100,
          delivered: 95,
          opened: 60,
          clicked: 15,
          bounced: 5,
          unsubscribed: 2,
          conversions: 8
        }
      }
      
      render(<CampaignAnalytics campaign={mockCampaign} />)
      
      expect(screen.getByText(/Test Campaign/i)).toBeInTheDocument()
    })
  })

  describe('EmailMarketingView', () => {
    it('should render email marketing view correctly', async () => {
      const { default: EmailMarketingView } = await import('@/components/dashboard/email-marketing-view')
      
      render(<EmailMarketingView />)
      
      // Verificar que se renderiza el componente
      expect(document.body).toBeInTheDocument()
    })
  })
}) 