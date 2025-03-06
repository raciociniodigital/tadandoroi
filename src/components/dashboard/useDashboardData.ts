
import { useState, useCallback } from 'react';
import { format, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const generateSampleData = (startDate: Date, endDate: Date) => {
  const data = [];
  const days = differenceInDays(endDate, startDate) + 1;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
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
  const today = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(today, 7),
    to: today,
  });

  const getDataForPeriod = useCallback(() => {
    let startDate;
    let endDate = endOfDay(today);
    
    switch (selectedPeriod) {
      case 'today':
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
      case '7d':
        startDate = startOfDay(subDays(today, 7));
        break;
      case '30d':
        startDate = startOfDay(subDays(today, 30));
        break;
      case 'custom':
        startDate = startOfDay(dateRange.from);
        endDate = endOfDay(dateRange.to);
        break;
      default:
        startDate = startOfDay(subDays(today, 7));
    }
    
    return generateSampleData(startDate, endDate);
  }, [selectedPeriod, dateRange, today]);
  
  const data = getDataForPeriod();
  
  const calculateSummary = useCallback(() => {
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
  }, [data]);
  
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
