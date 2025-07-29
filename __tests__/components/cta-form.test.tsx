import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CTASection from '@/components/cta-section'

// Mock the form actions
jest.mock('@/app/actions/form-actions', () => ({
  submitConsultationForm: jest.fn(() => Promise.resolve({ success: true })),
}))

// Mock useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('CTASection', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should render the CTA section with correct title', () => {
    render(<CTASection />)
    
    expect(screen.getByText('Ready to Transform Your Marketing Strategy?')).toBeInTheDocument()
  })

  it('should render the form with all required fields', () => {
    render(<CTASection />)
    
    // Check for form fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument()
  })

  it('should render service checkboxes', () => {
    render(<CTASection />)
    
    expect(screen.getByLabelText('Branding')).toBeInTheDocument()
    expect(screen.getByLabelText('Web Design')).toBeInTheDocument()
    expect(screen.getByLabelText('Marketing')).toBeInTheDocument()
    expect(screen.getByLabelText('Consulting')).toBeInTheDocument()
  })

  it('should render budget options', () => {
    render(<CTASection />)
    
    expect(screen.getByText('$0 - $5,000')).toBeInTheDocument()
    expect(screen.getByText('$5,001 - $10,000')).toBeInTheDocument()
    expect(screen.getByText('$10,001 - $25,000')).toBeInTheDocument()
    expect(screen.getByText('$25,001 - $50,000')).toBeInTheDocument()
    expect(screen.getByText('$50,001+')).toBeInTheDocument()
  })

  it('should render submit button', () => {
    render(<CTASection />)
    
    expect(screen.getByRole('button', { name: /Get Free Consultation/i })).toBeInTheDocument()
  })

  it('should have proper form validation', async () => {
    render(<CTASection />)
    
    const submitButton = screen.getByRole('button', { name: /Get Free Consultation/i })
    fireEvent.click(submitButton)
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
    })
  })

  it('should have proper section structure', () => {
    render(<CTASection />)
    
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('id', 'cta')
    expect(section).toHaveClass('relative', 'py-24', 'overflow-hidden')
  })

  it('should have responsive design classes', () => {
    render(<CTASection />)
    
    const container = document.querySelector('.max-w-3xl')
    expect(container).toHaveClass('max-w-3xl', 'mx-auto')
  })
}) 