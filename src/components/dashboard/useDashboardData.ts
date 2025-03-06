
import { useState, useCallback, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';
import { useSupabaseAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useDashboardData = () => {
  const today = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(today, 7),
    to: today,
  });
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isSignedIn } = useAuth();
  const { isSynced } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchDataFromSupabase = useCallback(async () => {
    if (!isSignedIn || !userId || !isSynced) {
      setIsLoading(false);
      return [];
    }

    try {
      setIsLoading(true);
      
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
      
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      console.log('Buscando dados do dashboard de', startDateStr, 'até', endDateStr, 'para o usuário', userId);
      
      const { data: records, error } = await supabase
        .from('daily_records')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar os dados para o dashboard.",
          variant: "destructive",
        });
        setIsLoading(false);
        return [];
      }
      
      console.log('Registros encontrados para o dashboard:', records);
      
      // Transform Supabase data to match the expected format
      const formattedData = records.map((record: any) => {
        const recordDate = new Date(record.date);
        const investment = Number(record.investment);
        const sales = Number(record.sales);
        const revenue = Number(record.revenue);
        const profit = revenue - investment;
        const roas = investment > 0 ? revenue / investment : 0;
        
        return {
          name: format(recordDate, 'dd/MM', { locale: ptBR }),
          date: recordDate,
          investment: investment,
          revenue: revenue,
          sales: sales,
          profit: profit,
          roas: roas
        };
      });
      
      setData(formattedData);
      setIsLoading(false);
      return formattedData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setIsLoading(false);
      return [];
    }
  }, [selectedPeriod, dateRange, today, userId, isSignedIn, isSynced, toast]);

  useEffect(() => {
    fetchDataFromSupabase();
  }, [fetchDataFromSupabase]);
  
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
    setDateRange,
    isLoading
  };
};
