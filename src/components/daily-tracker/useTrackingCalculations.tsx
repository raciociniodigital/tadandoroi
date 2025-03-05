
import { useState } from 'react';

interface TrackingCalculations {
  investment: string;
  setInvestment: (value: string) => void;
  sales: string;
  setSales: (value: string) => void;
  revenue: string;
  setRevenue: (value: string) => void;
  investmentValue: number;
  salesValue: number;
  revenueValue: number;
  profit: number;
  costPerSale: number;
  roas: number;
}

export const useTrackingCalculations = (): TrackingCalculations => {
  const [investment, setInvestment] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');

  // Calculate metrics
  const investmentValue = parseFloat(investment) || 0;
  const salesValue = parseInt(sales) || 0;
  const revenueValue = parseFloat(revenue) || 0;
  
  const profit = revenueValue - investmentValue;
  const costPerSale = salesValue > 0 ? investmentValue / salesValue : 0;
  const roas = investmentValue > 0 ? revenueValue / investmentValue : 0;

  return {
    investment,
    setInvestment,
    sales,
    setSales,
    revenue,
    setRevenue,
    investmentValue,
    salesValue,
    revenueValue,
    profit,
    costPerSale,
    roas
  };
};
