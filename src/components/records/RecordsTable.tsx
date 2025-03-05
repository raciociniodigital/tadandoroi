
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getMonth, getYear, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { dailyRecords } from '@/components/daily-tracker/DailyTracker';
import { useNavigate } from 'react-router-dom';

interface DailyRecord {
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load records from our storage
  useEffect(() => {
    const loadedRecords: DailyRecord[] = [];
    
    Object.entries(dailyRecords).forEach(([dateStr, data]) => {
      loadedRecords.push({
        date: parseISO(dateStr),
        investment: data.investment,
        sales: data.sales,
        revenue: data.revenue
      });
    });
    
    setRecords(loadedRecords);
  }, [currentMonth, dailyRecords]);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth);
  
  // Filter records for the current month
  const currentMonthRecords = records.filter((record) => 
    getMonth(record.date) === getMonth(currentMonth) && 
    getYear(record.date) === getYear(currentMonth)
  );
  
  // Calculate metrics for each day
  const daysData = Array.from({ length: daysInMonth }).map((_, index) => {
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
    const profit = revenue - investment;
    const costPerSale = sales > 0 ? investment / sales : 0;
    const roas = investment > 0 ? revenue / investment : 0;
    
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
  
  // Get ROAS color class
  const getRoasColorClass = (roas: number | null) => {
    if (roas === null) return '';
    if (roas <= 1) return 'text-red-500';
    if (roas <= 1.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleEdit = (day: number, dayData: any) => {
    setEditingDay(day);
    setEditData({
      investment: dayData.investment !== null ? dayData.investment.toString() : '',
      sales: dayData.sales !== null ? dayData.sales.toString() : '',
      revenue: dayData.revenue !== null ? dayData.revenue.toString() : ''
    });
  };

  const handleSave = () => {
    if (editingDay === null) return;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateToEdit = new Date(year, month, editingDay);
    const dateKey = format(dateToEdit, 'yyyy-MM-dd');
    
    // Update the dailyRecords
    dailyRecords[dateKey] = {
      investment: parseFloat(editData.investment) || 0,
      sales: parseInt(editData.sales) || 0,
      revenue: parseFloat(editData.revenue) || 0
    };
    
    // Update local records
    const updatedRecords = [...records];
    const existingIndex = updatedRecords.findIndex(r => 
      r.date.getDate() === editingDay && 
      getMonth(r.date) === getMonth(currentMonth) && 
      getYear(r.date) === getYear(currentMonth)
    );
    
    if (existingIndex >= 0) {
      updatedRecords[existingIndex] = {
        date: dateToEdit,
        investment: parseFloat(editData.investment) || 0,
        sales: parseInt(editData.sales) || 0,
        revenue: parseFloat(editData.revenue) || 0
      };
    } else {
      updatedRecords.push({
        date: dateToEdit,
        investment: parseFloat(editData.investment) || 0,
        sales: parseInt(editData.sales) || 0,
        revenue: parseFloat(editData.revenue) || 0
      });
    }
    
    setRecords(updatedRecords);
    
    toast({
      title: "Dados atualizados",
      description: `Os dados do dia ${editingDay} foram atualizados com sucesso.`,
    });
    
    setEditingDay(null);
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
    // Navigate to the daily tracking page with the selected date
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDate = new Date(year, month, day);
    
    // In a real app, we would pass the date through state management or URL
    // For this demo, we'll just navigate to the page
    navigate('/daily');
    
    // Alternatively, you could open a dialog/modal to add data directly
  };

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
      
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse records-table">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 text-left font-medium border-r">Dia</th>
                <th className="py-3 px-4 text-right font-medium border-r">Investimento (R$)</th>
                <th className="py-3 px-4 text-right font-medium border-r">Vendas</th>
                <th className="py-3 px-4 text-right font-medium border-r">Custo/Venda (R$)</th>
                <th className="py-3 px-4 text-right font-medium border-r">Lucro (R$)</th>
                <th className="py-3 px-4 text-right font-medium border-r">ROAS</th>
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
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="py-3 px-4 border-r">
                        <Input
                          type="number"
                          value={editData.sales}
                          onChange={(e) => handleInputChange('sales', e.target.value)}
                          className="w-20 text-right"
                        />
                      </td>
                      <td className="py-3 px-4 border-r text-right">
                        <Input
                          type="number"
                          value={editData.revenue}
                          onChange={(e) => handleInputChange('revenue', e.target.value)}
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="py-3 px-4 border-r text-right">-</td>
                      <td className="py-3 px-4 border-r text-right">-</td>
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
                      <td className="py-3 px-4 text-right border-r">
                        {day.investment !== null 
                          ? day.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-right border-r">
                        {day.sales !== null ? day.sales : '-'}
                      </td>
                      <td className="py-3 px-4 text-right border-r">
                        {day.costPerSale !== null 
                          ? day.costPerSale.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className={cn("py-3 px-4 text-right border-r", day.profit && day.profit < 0 ? "text-red-500" : "")}>
                        {day.profit !== null 
                          ? day.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                          : '-'}
                      </td>
                      <td className={cn("py-3 px-4 text-right border-r", getRoasColorClass(day.roas))}>
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
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleAddNew(day.day)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
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
