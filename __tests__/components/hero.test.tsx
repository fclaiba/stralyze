import { render, screen, fireEvent } from '@testing-library/react'
import HeroWithCanvasReveal from '@/components/hero-with-canvas-reveal'

// Mock smoothScroll function
jest.mock('@/lib/smoothScroll', () => ({
  smoothScroll: jest.fn(),
}))

describe('HeroWithCanvasReveal', () => {
  beforeEach(() => {
    // Mock getElementById
    const mockElement = {
      scrollIntoView: jest.fn(),
    }
    document.getElementById = jest.fn(() => mockElement as any)
  })

  it('should render the hero section with correct content', () => {
    render(<HeroWithCanvasReveal />)
    
    // Check main heading
    expect(screen.getByText('Strategic Marketing Solutions')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/Elevate your brand with data-driven strategies/)).toBeInTheDocument()
    
    // Check CTA button
    expect(screen.getByText('Discover Our Approach')).toBeInTheDocument()
  })

  it('should have correct structure and classes', () => {
    render(<HeroWithCanvasReveal />)
    
    const heroSection = screen.getByRole('banner') || document.querySelector('#home')
    expect(heroSection).toHaveClass('relative', 'min-h-screen', 'flex', 'items-center', 'justify-center')
  })

  it('should handle discover button click', () => {
    render(<HeroWithCanvasReveal />)
    
    const discoverButton = screen.getByText('Discover Our Approach')
    fireEvent.click(discoverButton)
    
    // Verify that getElementById was called with 'features'
    expect(document.getElementById).toHaveBeenCalledWith('features')
  })

  it('should be accessible with proper ARIA labels', () => {
    render(<HeroWithCanvasReveal />)
    
    // Check if the main heading is properly structured
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Strategic Marketing Solutions')
  })

  it('should have responsive design classes', () => {
    render(<HeroWithCanvasReveal />)
    
    const container = document.querySelector('.text-center')
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
  })

  it('should render with proper text hierarchy', () => {
    render(<HeroWithCanvasReveal />)
    
    // Check heading size classes
    const heading = screen.getByText('Strategic Marketing Solutions')
    expect(heading).toHaveClass('text-4xl', 'sm:text-5xl', 'lg:text-6xl')
    
    // Check description size classes
    const description = screen.getByText(/Elevate your brand/)
    expect(description).toHaveClass('text-xl', 'sm:text-2xl')
  })
}) 