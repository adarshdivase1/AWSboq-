
import { Currency } from '../types';

// Using a free, no-API-key-required service for exchange rates.
const API_URL = 'https://api.frankfurter.app/latest?from=USD&to=USD,EUR,GBP,INR';

interface ExchangeRates {
  [key: string]: number;
}

let cachedRates: { rates: ExchangeRates, timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getExchangeRates = async (): Promise<Record<Currency, number>> => {
  const now = Date.now();
  if (cachedRates && (now - cachedRates.timestamp < CACHE_DURATION)) {
    return cachedRates.rates as Record<Currency, number>;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = await response.json();
    
    const rates: ExchangeRates = data.rates;
    rates['USD'] = 1; // The API doesn't return the 'from' currency in the rates object
    
    cachedRates = {
        rates,
        timestamp: now,
    };

    return rates as Record<Currency, number>;
  } catch (error) {
    console.error("Could not fetch exchange rates:", error);
    // Return default/fallback rates on failure
    return {
      'USD': 1,
      'EUR': 0.93,
      'GBP': 0.79,
      'INR': 83.5,
    };
  }
};
