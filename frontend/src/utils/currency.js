// Currency Map & Auto-Detection Helpers

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rate: 1 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rate: 83.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rate: 155.0 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', rate: 1.52 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', rate: 1.37 }
};

// Detect user currency based on location / country name
export function detectCurrency(countryName = '') {
  const c = (countryName || '').toLowerCase();
  if (c.includes('india')) return 'INR';
  if (c.includes('france') || c.includes('italy') || c.includes('spain') || c.includes('germany')) return 'EUR';
  if (c.includes('uk') || c.includes('britain') || c.includes('england')) return 'GBP';
  if (c.includes('japan')) return 'JPY';
  if (c.includes('australia')) return 'AUD';
  if (c.includes('canada')) return 'CAD';
  
  // Browser locale detection fallback
  const lang = (navigator.language || '').toLowerCase();
  if (lang.includes('in')) return 'INR';
  if (lang.includes('gb')) return 'GBP';
  if (lang.includes('jp')) return 'JPY';
  if (lang.includes('fr') || lang.includes('de') || lang.includes('es') || lang.includes('it')) return 'EUR';

  return 'USD';
}

export function formatPrice(amountInUSD, currencyCode = 'USD') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = Math.round((amountInUSD || 0) * currency.rate);
  return `${currency.symbol}${converted.toLocaleString()}`;
}
