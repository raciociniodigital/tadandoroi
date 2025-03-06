import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  getDaysInMonth, 
  startOfMonth, 
  getMonth, 
  getYear
} from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DailyRecord {
  id?: string;
  date: Date;
  investment: number;
  sales: number;
  revenue: number;
}

export const useRecordsData = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    investment: string;
    sales: string;
    revenue: string;
  }>({
    investment: '',
    sales: '',
    revenue: ''
  });
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId, isSignedIn } = useAuth();
  
  // Fetch records from Supabase when the month changes or user signs in
  useEffect(() => {
    const fetchRecords = async () => {
      if (!isSignedIn || !userId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const endDate = format(lastDayOfMonth, 'yyyy-MM-dd');
        
        console.log('Buscando registros de', startDate, 'até', endDate, 'para o usuário', userId);
        
        const { data, error } = await supabase
          .from('daily_records')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate);
        
        if (error) {
          console.error('Erro ao buscar registros:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível buscar os registros para este mês.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('Registros encontrados:', data);
        
        const formattedRecords: DailyRecord[] = data.map((record: any) => ({
          id: record.id,
          date: new Date(record.date),
          investment: Number(record.investment),
          sales: Number(record.sales),
          revenue: Number(record.revenue)
        }));
        
        setRecords(formattedRecords);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [currentMonth, userId, isSignedIn, toast]);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth);
  
  const currentMonthRecords = records.filter((record) => 
    getMonth(record.date) === getMonth(currentMonth) && 
    getYear(record.date) === getYear(currentMonth)
  );
  
  const daysData = Array.from({ length: daysInMonth }).map((_, index) => {
    const day = index + 1;
    const record = currentMonthRecords.find((r) => r.date.getDate() === day);
    
    if (!record) {
      return {
        day,
        id: null,
        investment: null,
        sales: null,
        revenue: null,
        costPerSale: null,
        profit: null,
        roas: null,
      };
    }
    
    const investment = record.investment;
    const sales = record.sales;
    const revenue = record.revenue;
    const profit = revenue - investment;
    const costPerSale = sales > 0 ? investment / sales : 0;
    const roas = investment > 0 ? revenue / investment : 0;
    
    return {
      day,
      id: record.id,
      investment,
      sales,
      revenue,
      costPerSale,
      profit,
      roas,
    };
  });
  
  const getRoasColorClass = (roas: number | null) => {
    if (roas === null) return '';
    if (roas <= 1) return 'text-danger';
    if (roas <= 1.5) return 'text-warning';
    return 'text-success';
  };

  const getProfitColorClass = (profit: number | null) => {
    if (profit === null) return '';
    if (profit < 0) return 'text-danger';
    return 'text-success';
  };

  const handleEdit = (day: number, dayData: any) => {
    setEditingDay(day);
    setEditData({
      investment: dayData.investment !== null ? dayData.investment.toString() : '',
      sales: dayData.sales !== null ? dayData.sales.toString() : '',
      revenue: dayData.revenue !== null ? dayData.revenue.toString() : ''
    });
  };

  const handleSave = async () => {
    if (editingDay === null || !isSignedIn || !userId) return;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateToEdit = new Date(year, month, editingDay);
    const dateStr = format(dateToEdit, 'yyyy-MM-dd');
    
    try {
      console.log('Atualizando dados para', dateStr, 'com o usuário', userId);
      
      // Prepare data for Supabase
      const recordData = {
        user_id: userId,
        date: dateStr,
        investment: parseFloat(editData.investment) || 0,
        sales: parseInt(editData.sales) || 0,
        revenue: parseFloat(editData.revenue) || 0,
        updated_at: new Date().toISOString()
      };
      
      console.log('Dados a serem salvos:', recordData);
      
      // Upsert to Supabase
      const { error } = await supabase
        .from('daily_records')
        .upsert(recordData, {
          onConflict: 'user_id,date'
        });
      
      if (error) {
        console.error('Erro detalhado ao salvar:', error);
        throw error;
      }
      
      // Refresh the records
      const { data: newRecord, error: fetchError } = await supabase
        .from('daily_records')
        .select('*')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar registro atualizado:', fetchError);
      } else {
        console.log('Registro atualizado:', newRecord);
        
        // Update local state
        const updatedRecords = [...records];
        const existingIndex = updatedRecords.findIndex(r => 
          r.date.getDate() === editingDay && 
          getMonth(r.date) === getMonth(currentMonth) && 
          getYear(r.date) === getYear(currentMonth)
        );
        
        const updatedRecord = {
          id: newRecord.id,
          date: new Date(newRecord.date),
          investment: Number(newRecord.investment),
          sales: Number(newRecord.sales),
          revenue: Number(newRecord.revenue)
        };
        
        if (existingIndex >= 0) {
          updatedRecords[existingIndex] = updatedRecord;
        } else {
          updatedRecords.push(updatedRecord);
        }
        
        setRecords(updatedRecords);
      }
      
      toast({
        title: "Dados atualizados",
        description: `Os dados do dia ${editingDay} foram atualizados com sucesso.`,
      });
      
      setEditingDay(null);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingDay(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNew = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDate = new Date(year, month, day);
    
    // Navigate to daily page with the selected date
    navigate('/daily');
  };

  return {
    currentMonth,
    daysData,
    isLoading,
    editingDay,
    editData,
    goToPreviousMonth,
    goToNextMonth,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAddNew,
    getRoasColorClass,
    getProfitColorClass
  };
};
