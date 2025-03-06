
import { useState, useCallback, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAllRecords, TrackingData } from '@/services/trackingService';

export const useDashboardData = () => {
  const today = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(today, 7),
    to: today,
  });
  const [data, setData] = useState<any[]>([]);

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
    
    // Buscar registros do armazenamento
    const allRecords = getAllRecords();
    const filteredData: any[] = [];
    
    Object.entries(allRecords).forEach(([dateStr, record]) => {
      const recordDate = parseISO(dateStr);
      
      if (isWithinInterval(recordDate, { start: startDate, end: endDate })) {
        const investment = record.investment;
        const sales = record.sales;
        const revenue = record.revenue;
        const profit = revenue - investment;
        const roas = investment > 0 ? revenue / investment : 0;
        
        filteredData.push({
          name: format(recordDate, 'dd/MM', { locale: ptBR }),
          date: recordDate,
          investment: investment,
          revenue: revenue,
          sales: sales,
          profit: profit,
          roas: roas
        });
      }
    });
    
    // Ordenar por data
    filteredData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return filteredData;
  }, [selectedPeriod, dateRange, today]);
  
  useEffect(() => {
    const filteredData = getDataForPeriod();
    setData(filteredData);
  }, [getDataForPeriod]);
  
  const calculateSummary = useCallback(() => {
    if (data.length === 0) {
      return {
        investment: "0.00",
        revenue: "0.00",
        sales: 0,
        profit: "0.00",
        roas: "0.00"
      };
    }
    
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
