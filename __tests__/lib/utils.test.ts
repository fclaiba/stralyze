import { formatCurrency, calculateConversionRate } from '@/lib/utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(123.4)).toBe('$123.40')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
      expect(formatCurrency(-0)).toBe('-$0.00')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99')
    })
  })

  describe('calculateConversionRate', () => {
    it('should calculate conversion rate correctly', () => {
      expect(calculateConversionRate(10, 100)).toBe(10)
      expect(calculateConversionRate(0, 100)).toBe(0)
      expect(calculateConversionRate(50, 50)).toBe(100)
      expect(calculateConversionRate(25, 200)).toBe(12.5)
    })

    it('should handle zero denominator', () => {
      expect(calculateConversionRate(10, 0)).toBe(0)
      expect(calculateConversionRate(0, 0)).toBe(0)
    })

    it('should handle decimal results', () => {
      expect(calculateConversionRate(1, 3)).toBe(33.33)
      expect(calculateConversionRate(7, 9)).toBe(77.78)
    })
  })
}) 