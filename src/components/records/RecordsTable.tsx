
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data for demonstration
// In a real app, this would come from your database
interface DailyRecord {
  date: Date;
  investment: number;
  sales: number;
  revenue: number;
}

const mockData: DailyRecord[] = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(2023, 6, i + 1),
  investment: Math.round(Math.random() * 1000),
  sales: Math.round(Math.random() * 20),
  revenue: Math.round(Math.random() * 3000),
}));

const RecordsTable = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth);
  
  // Filter records for the current month
  // In a real app, this would filter from your database
  const currentMonthRecords = mockData.filter((record) => 
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 text-left font-medium border-r">Dia</th>
                <th className="py-3 px-4 text-right font-medium border-r">Investimento (R$)</th>
                <th className="py-3 px-4 text-right font-medium border-r">Vendas</th>
                <th className="py-3 px-4 text-right font-medium border-r">Custo/Venda (R$)</th>
                <th className="py-3 px-4 text-right font-medium border-r">Lucro (R$)</th>
                <th className="py-3 px-4 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {daysData.map((day) => (
                <tr key={day.day} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 border-r">{day.day}</td>
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
                  <td className={cn("py-3 px-4 text-right", getRoasColorClass(day.roas))}>
                    {day.roas !== null 
                      ? day.roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      : '-'}
                  </td>
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
