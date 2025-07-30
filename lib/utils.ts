import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0
  return Math.round((converted / total) * 100 * 100) / 100
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Funciones de exportación de datos
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: any[], filename: string, title: string) => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Prepare table data
    const headers = Object.keys(data[0]);
    const tableData = data.map(row => 
      headers.map(header => row[header])
    );
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
    });
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to CSV if PDF generation fails
    exportToCSV(data, filename);
  }
};

// Función para paginación
export const paginateData = <T>(
  data: T[], 
  page: number, 
  pageSize: number
): { data: T[], totalPages: number, currentPage: number, totalItems: number } => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    totalPages: Math.ceil(data.length / pageSize),
    currentPage: page,
    totalItems: data.length,
  };
};

// Función para búsqueda avanzada
export const advancedSearch = <T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  filters?: Record<string, any>
): T[] => {
  let filteredData = [...data];

  // Búsqueda por término
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredData = filteredData.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }

  // Aplicar filtros adicionales
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key as keyof T];
          if (typeof value === 'string' && value.includes('range:')) {
            // Filtro por rango
            const [min, max] = value.replace('range:', '').split('-').map(Number);
            return itemValue >= min && itemValue <= max;
          }
          return itemValue === value;
        });
      }
    });
  }

  return filteredData;
};

// Función para validaciones avanzadas
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateAmount = (amount: number): boolean => {
  return amount >= 0 && amount <= 999999999.99;
};


