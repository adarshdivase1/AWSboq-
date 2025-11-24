import React from 'react';
import { CURRENCIES, Currency } from '../types';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  disabled: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedCurrency, onCurrencyChange, disabled }) => {
  return (
    <div>
      <label htmlFor="currency" className="sr-only">Currency</label>
      <select
        id="currency"
        name="currency"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
        disabled={disabled}
        className="block w-full pl-3 pr-10 py-2 text-base bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900 dark:text-white disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-500"
      >
        {CURRENCIES.map(currency => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;