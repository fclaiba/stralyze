import { render, screen } from '@testing-library/react'
import ServicesSection from '@/components/services-section'

describe('ServicesSection', () => {
  it('should render the services section with correct title', () => {
    render(<ServicesSection />)
    
    expect(screen.getByText('Our Comprehensive Services')).toBeInTheDocument()
  })

  it('should render all three service cards', () => {
    render(<ServicesSection />)
    
    // Check for all service titles
    expect(screen.getByText('Strategic Brand Orchestration')).toBeInTheDocument()
    expect(screen.getByText('Precision Campaign Optimization')).toBeInTheDocument()
    expect(screen.getByText('Tactical Execution Excellence')).toBeInTheDocument()
  })

  it('should render service descriptions', () => {
    render(<ServicesSection />)
    
    expect(screen.getByText(/Craft a compelling brand narrative/)).toBeInTheDocument()
    expect(screen.getByText(/Fine-tune your marketing efforts/)).toBeInTheDocument()
    expect(screen.getByText(/Transform strategies into flawlessly/)).toBeInTheDocument()
  })

  it('should render service features', () => {
    render(<ServicesSection />)
    
    // Check for some key features
    expect(screen.getByText('Comprehensive brand audits')).toBeInTheDocument()
    expect(screen.getByText('Data-driven campaign analysis')).toBeInTheDocument()
    expect(screen.getByText('End-to-end campaign management')).toBeInTheDocument()
  })

  it('should have proper grid layout classes', () => {
    render(<ServicesSection />)
    
    const gridContainer = document.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should have proper section structure', () => {
    render(<ServicesSection />)
    
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('id', 'services')
    expect(section).toHaveClass('relative', 'py-24', 'overflow-hidden')
  })

  it('should render Learn More buttons for each service', () => {
    render(<ServicesSection />)
    
    const learnMoreButtons = screen.getAllByText('Learn More')
    expect(learnMoreButtons).toHaveLength(3)
  })
}) 