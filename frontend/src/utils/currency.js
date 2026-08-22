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

// Purchasing Power Parity (PPP) & Cost of Living Index Multipliers for 50 Countries
export const COUNTRY_PURCHASING_POWER = [
  { name: 'Switzerland', keywords: ['switzerland', 'swiss'], factor: 1.95, tier: 'Very High Cost' },
  { name: 'Iceland', keywords: ['iceland'], factor: 1.85, tier: 'Very High Cost' },
  { name: 'Norway', keywords: ['norway'], factor: 1.80, tier: 'Very High Cost' },
  { name: 'Denmark', keywords: ['denmark'], factor: 1.70, tier: 'High Cost' },
  { name: 'Singapore', keywords: ['singapore'], factor: 1.65, tier: 'High Cost' },
  { name: 'United States', keywords: ['united states', 'usa', 'america', 'us'], factor: 1.50, tier: 'High Cost' },
  { name: 'United Arab Emirates', keywords: ['united arab emirates', 'uae', 'dubai'], factor: 1.55, tier: 'High Cost' },
  { name: 'Qatar', keywords: ['qatar'], factor: 1.50, tier: 'High Cost' },
  { name: 'Israel', keywords: ['israel'], factor: 1.50, tier: 'High Cost' },
  { name: 'United Kingdom', keywords: ['united kingdom', 'uk', 'england', 'britain', 'london'], factor: 1.45, tier: 'High Cost' },
  { name: 'Sweden', keywords: ['sweden'], factor: 1.45, tier: 'High Cost' },
  { name: 'Finland', keywords: ['finland'], factor: 1.40, tier: 'High Cost' },
  { name: 'Australia', keywords: ['australia', 'sydney'], factor: 1.40, tier: 'High Cost' },
  { name: 'Netherlands', keywords: ['netherlands', 'holland', 'amsterdam'], factor: 1.40, tier: 'High Cost' },
  { name: 'France', keywords: ['france', 'paris'], factor: 1.35, tier: 'Moderate-High Cost' },
  { name: 'Canada', keywords: ['canada'], factor: 1.35, tier: 'Moderate-High Cost' },
  { name: 'New Zealand', keywords: ['new zealand'], factor: 1.35, tier: 'Moderate-High Cost' },
  { name: 'Germany', keywords: ['germany', 'munich', 'berlin'], factor: 1.30, tier: 'Moderate-High Cost' },
  { name: 'Saudi Arabia', keywords: ['saudi arabia'], factor: 1.25, tier: 'Moderate-High Cost' },
  { name: 'Japan', keywords: ['japan', 'tokyo', 'kyoto'], factor: 1.25, tier: 'Moderate Cost' },
  { name: 'Italy', keywords: ['italy', 'rome'], factor: 1.20, tier: 'Moderate Cost' },
  { name: 'South Korea', keywords: ['south korea', 'seoul', 'korea'], factor: 1.15, tier: 'Moderate Cost' },
  { name: 'Spain', keywords: ['spain', 'barcelona', 'madrid'], factor: 1.05, tier: 'Moderate Cost' },
  { name: 'Greece', keywords: ['greece', 'athens'], factor: 0.90, tier: 'Moderate Cost' },
  { name: 'Portugal', keywords: ['portugal', 'lisbon'], factor: 0.85, tier: 'Moderate-Low Cost' },
  { name: 'Croatia', keywords: ['croatia'], factor: 0.85, tier: 'Moderate-Low Cost' },
  { name: 'Czech Republic', keywords: ['czech', 'prague'], factor: 0.80, tier: 'Moderate-Low Cost' },
  { name: 'Costa Rica', keywords: ['costa rica'], factor: 0.80, tier: 'Moderate-Low Cost' },
  { name: 'Poland', keywords: ['poland'], factor: 0.75, tier: 'Budget-Friendly' },
  { name: 'Hungary', keywords: ['hungary', 'budapest'], factor: 0.75, tier: 'Budget-Friendly' },
  { name: 'Chile', keywords: ['chile'], factor: 0.75, tier: 'Budget-Friendly' },
  { name: 'Mexico', keywords: ['mexico'], factor: 0.65, tier: 'Budget-Friendly' },
  { name: 'Turkey', keywords: ['turkey', 'istanbul'], factor: 0.60, tier: 'Budget-Friendly' },
  { name: 'Brazil', keywords: ['brazil'], factor: 0.60, tier: 'Budget-Friendly' },
  { name: 'South Africa', keywords: ['south africa'], factor: 0.60, tier: 'Budget-Friendly' },
  { name: 'Malaysia', keywords: ['malaysia'], factor: 0.55, tier: 'Budget-Friendly' },
  { name: 'Argentina', keywords: ['argentina'], factor: 0.55, tier: 'Budget-Friendly' },
  { name: 'Peru', keywords: ['peru'], factor: 0.55, tier: 'Budget-Friendly' },
  { name: 'Thailand', keywords: ['thailand', 'bangkok'], factor: 0.50, tier: 'Low Cost' },
  { name: 'Morocco', keywords: ['morocco'], factor: 0.50, tier: 'Low Cost' },
  { name: 'Colombia', keywords: ['colombia'], factor: 0.50, tier: 'Low Cost' },
  { name: 'Indonesia', keywords: ['indonesia', 'bali'], factor: 0.45, tier: 'Low Cost' },
  { name: 'Philippines', keywords: ['philippines'], factor: 0.45, tier: 'Low Cost' },
  { name: 'Kenya', keywords: ['kenya'], factor: 0.45, tier: 'Low Cost' },
  { name: 'Vietnam', keywords: ['vietnam'], factor: 0.40, tier: 'Very Low Cost' },
  { name: 'Cambodia', keywords: ['cambodia'], factor: 0.40, tier: 'Very Low Cost' },
  { name: 'India', keywords: ['india', 'surat', 'delhi', 'mumbai'], factor: 0.35, tier: 'Very Low Cost' },
  { name: 'Egypt', keywords: ['egypt', 'cairo'], factor: 0.35, tier: 'Very Low Cost' },
  { name: 'Sri Lanka', keywords: ['sri lanka'], factor: 0.35, tier: 'Very Low Cost' },
  { name: 'Nepal', keywords: ['nepal'], factor: 0.30, tier: 'Very Low Cost' }
];

export function getCountryPPP(countryOrCityName = '') {
  const query = (countryOrCityName || '').toLowerCase().trim();
  if (!query) return { name: 'Standard Global', factor: 1.0, tier: 'Global Average' };

  for (const item of COUNTRY_PURCHASING_POWER) {
    if (item.keywords.some(k => query.includes(k))) {
      return item;
    }
  }

  return { name: countryOrCityName || 'Standard Global', factor: 1.0, tier: 'Global Average' };
}

// Detect user currency based on location / country name
export function detectCurrency(countryName = '') {
  const c = (countryName || '').toLowerCase();
  if (c.includes('india')) return 'INR';
  if (c.includes('france') || c.includes('italy') || c.includes('spain') || c.includes('germany')) return 'EUR';
  if (c.includes('uk') || c.includes('britain') || c.includes('england')) return 'GBP';
  if (c.includes('japan')) return 'JPY';
  if (c.includes('australia')) return 'AUD';
  if (c.includes('canada')) return 'CAD';
  
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
