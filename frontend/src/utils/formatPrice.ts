/**
 * Format a price number with thousand separators (points)
 * Example: 10000 -> "10.000", 1234.56 -> "1.234,56"
 */
export function formatPrice(price: number): string {
  // Handle integer prices
  if (price % 1 === 0) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  // Handle decimal prices
  const parts = price.toFixed(2).split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${integerPart},${parts[1]}`
}

