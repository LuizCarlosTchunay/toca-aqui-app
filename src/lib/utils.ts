
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Add a utility function to ensure text is properly formatted with the right colors
export function getTextColorClass(type: 'heading' | 'subheading' | 'body' | 'muted' = 'body'): string {
  switch (type) {
    case 'heading':
      return 'text-white font-semibold';
    case 'subheading':
      return 'text-white font-medium';
    case 'body':
      return 'text-toca-text-primary'; // White color
    case 'muted':
      return 'text-toca-text-secondary'; // Gray color
    default:
      return 'text-toca-text-primary';
  }
}
