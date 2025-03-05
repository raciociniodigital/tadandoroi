
import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const generateSampleData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const investment = Math.random() * 300 + 200;
    const sales = Math.floor(Math.random() * 20) + 5;
    const revenue = sales * (Math.random() * 100 + 50);
    const profit = revenue - investment;
    const roas = revenue / investment;
    
    data.push({
      name: format(date, 'dd/MM', { locale: ptBR }),
      date: date,
      investment: investment,
      revenue: revenue,
      sales: sales,
      profit: profit,
      roas: roas
    });
  }
  
  return data;
};

export const useDashboardData = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const getDataForPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return generateSampleData(0);
      case '7d':
        return generateSampleData(7);
      case '30d':
        return generateSampleData(30);
      case 'custom':
        const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return generateSampleData(diffDays);
      default:
        return generateSampleData(7);
    }
  };
  
  const data = getDataForPeriod();
  
  const calculateSummary = () => {
    const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const averageRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
    
    return {
      investment: totalInvestment.toFixed(2),
      revenue: totalRevenue.toFixed(2),
      sales: totalSales,
      profit: totalProfit.toFixed(2),
      roas: averageRoas.toFixed(2)
    };
  };
  
  const summary = calculateSummary();

  return {
    data,
    summary,
    selectedPeriod,
    setSelectedPeriod,
    dateRange,
    setDateRange
  };
};
