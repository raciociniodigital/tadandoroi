
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Save,
  X,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Percent,
  Calculator,
  Calendar
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  getDaysInMonth, 
  startOfMonth, 
  getMonth, 
  getYear,
  parseISO 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

interface DailyRecord {
  id?: string;
  date: Date;
  investment: number;
  sales: number;
  revenue: number;
}

const RecordsTable = () => {
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
      if (!isSignedIn || !userId) return;
      
      setIsLoading(true);
      try {
        const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const endDate = format(lastDayOfMonth, 'yyyy-MM-dd');
        
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
      // Prepare data for Supabase
      const recordData = {
        user_id: userId,
        date: dateStr,
        investment: parseFloat(editData.investment) || 0,
        sales: parseInt(editData.sales) || 0,
        revenue: parseFloat(editData.revenue) || 0,
        updated_at: new Date().toISOString()
      };
      
      // Upsert to Supabase
      const { error } = await supabase
        .from('daily_records')
        .upsert(recordData, {
          onConflict: 'user_id,date'
        });
      
      if (error) {
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

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Tabela de Registros</h1>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card glass-card hover-glass-card overflow-hidden shadow-md p-8">
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando registros...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Tabela de Registros</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousMonth}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextMonth}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card glass-card hover-glass-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse records-table">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Dia</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>Investimento (R$)</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span>Vendas</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span>Custo/Venda (R$)</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span>Lucro (R$)</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>ROAS</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {daysData.map((day) => (
                <tr 
                  key={day.day} 
                  className={cn(
                    "border-t hover:bg-muted/30 transition-colors",
                    day.day % 2 === 0 ? "bg-muted/10" : ""
                  )}
                >
                  <td className="py-3 px-4 border-r font-medium">{day.day}</td>
                  
                  {editingDay === day.day ? (
                    <>
                      <td className="py-3 px-4 border-r">
                        <Input
                          type="number"
                          value={editData.investment}
                          onChange={(e) => handleInputChange('investment', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-4 border-r">
                        <Input
                          type="number"
                          value={editData.sales}
                          onChange={(e) => handleInputChange('sales', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-4 border-r">
                        <Input
                          type="number"
                          value={editData.revenue}
                          onChange={(e) => handleInputChange('revenue', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-4 border-r">-</td>
                      <td className="py-3 px-4 border-r">-</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleSave}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left border-r">
                        {day.investment !== null 
                          ? day.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-left border-r">
                        {day.sales !== null ? day.sales : '-'}
                      </td>
                      <td className="py-3 px-4 text-left border-r">
                        {day.costPerSale !== null 
                          ? day.costPerSale.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className={cn("py-3 px-4 text-left border-r", getProfitColorClass(day.profit))}>
                        {day.profit !== null 
                          ? day.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className={cn("py-3 px-4 text-left border-r font-medium", getRoasColorClass(day.roas))}>
                        {day.roas !== null 
                          ? day.roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {day.investment !== null ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEdit(day.day, day)}
                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleAddNew(day.day)}
                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsTable;
