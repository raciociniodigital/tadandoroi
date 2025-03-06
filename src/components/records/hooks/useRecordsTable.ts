
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DailyRecord,
  DayData,
  loadRecords,
  filterRecordsByMonth,
  calculateDerivedValues,
  saveDailyRecord
} from '../utils/recordsUtils';

export const useRecordsTable = () => {
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadTableRecords();
  }, [currentMonth]);
  
  const loadTableRecords = () => {
    setRecords(loadRecords());
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth);
  
  const currentMonthRecords = filterRecordsByMonth(records, currentMonth);
  
  const daysData: DayData[] = Array.from({ length: daysInMonth }).map((_, index) => {
    const day = index + 1;
    const record = currentMonthRecords.find((r) => r.date.getDate() === day);
    
    if (!record) {
      return {
        day,
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
    const { profit, costPerSale, roas } = calculateDerivedValues({ investment, sales, revenue });
    
    return {
      day,
      investment,
      sales,
      revenue,
      costPerSale,
      profit,
      roas,
    };
  });
  
  const handleEdit = (day: number, dayData: DayData) => {
    setEditingDay(day);
    setEditData({
      investment: dayData.investment !== null ? dayData.investment.toString() : '',
      sales: dayData.sales !== null ? dayData.sales.toString() : '',
      revenue: dayData.revenue !== null ? dayData.revenue.toString() : ''
    });
  };

  const handleSave = () => {
    if (editingDay === null) return;
    
    try {
      saveDailyRecord(editingDay, currentMonth, editData);
      loadTableRecords();
      
      toast({
        title: "Dados atualizados",
        description: `Os dados do dia ${editingDay} foram atualizados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar registro:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar os dados.",
        variant: "destructive"
      });
    } finally {
      setEditingDay(null);
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
    navigate('/daily');
  };
  
  const formatMonth = () => {
    return format(currentMonth, 'MMMM yyyy', { locale: ptBR });
  };

  return {
    currentMonth,
    editingDay,
    editData,
    daysData,
    formatMonth,
    goToPreviousMonth,
    goToNextMonth,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAddNew
  };
};
