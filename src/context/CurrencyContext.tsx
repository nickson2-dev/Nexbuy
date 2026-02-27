
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'UGX' | 'USD' | 'EUR' | 'JPY';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to USD (1 USD = X Currency)
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  UGX: { code: 'UGX', symbol: 'UGX', rate: 3850, label: 'Ugandan Shilling' },
  USD: { code: 'USD', symbol: '$', rate: 1, label: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro' },
  JPY: { code: 'JPY', symbol: '¥', rate: 150, label: 'Japanese Yen' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('nexbuy_currency');
    return (saved as CurrencyCode) || 'UGX';
  });

  const currency = CURRENCIES[currencyCode];

  useEffect(() => {
    localStorage.setItem('nexbuy_currency', currencyCode);
  }, [currencyCode]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
  };

  const convertPrice = (priceInUSD: number) => {
    return priceInUSD * currency.rate;
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = convertPrice(priceInUSD);
    
    if (currency.code === 'UGX') {
      return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
