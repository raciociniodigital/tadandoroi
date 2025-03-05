
import React, { useState, useEffect } from 'react';
import { CalendarDays, Calendar as CalendarIcon, ChevronDown, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface DateRangeSelectorProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  dateRange: { from: Date; to: Date };
  setDateRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  dateRange,
  setDateRange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [tempDateRange, setTempDateRange] = useState<{ from?: Date; to?: Date }>({
    from: dateRange.from,
    to: dateRange.to
  });
  const { toast } = useToast();

  // Reset temporary date range when period changes
  useEffect(() => {
    if (selectedPeriod === 'custom') {
      setTempDateRange({ from: dateRange.from, to: dateRange.to });
    }
  }, [selectedPeriod, dateRange]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today':
        return 'Hoje';
      case '7d':
        return 'Últimos 7 dias';
      case '30d':
        return 'Últimos 30 dias';
      case 'custom':
        return `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')}`;
      default:
        return 'Últimos 7 dias';
    }
  };

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    setTempDateRange(range);

    if (range.from && !range.to) {
      toast({
        title: "Selecione a data final",
        description: "Você selecionou a data inicial. Agora clique em uma data para definir o fim do período.",
      });
    } else if (range.from && range.to) {
      setDateRange({ 
        from: range.from, 
        to: range.to 
      });
      
      // Fechar o popover somente quando ambas as datas estiverem selecionadas
      setTimeout(() => {
        setIsCalendarOpen(false);
      }, 400);
    }
  };

  const handleCustomPeriodClick = () => {
    setSelectedPeriod('custom');
    // Resetar a seleção temporária ao abrir para período personalizado
    setTempDateRange({ from: dateRange.from, to: dateRange.to });
    setIsCalendarOpen(true);
  };

  const cancelSelection = () => {
    setTempDateRange({ from: dateRange.from, to: dateRange.to });
    setIsCalendarOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[180px] truncate">
            <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{getPeriodLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSelectedPeriod('today')}>
            Hoje
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedPeriod('7d')}>
            Últimos 7 dias
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedPeriod('30d')}>
            Últimos 30 dias
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCustomPeriodClick}>
            Período personalizado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            onClick={() => selectedPeriod === 'custom' && setIsCalendarOpen(true)}
            className={selectedPeriod !== 'custom' ? 'hidden' : ''}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Selecionar datas
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-2 text-sm border-b flex items-center justify-between">
            <span className="text-muted-foreground">
              {tempDateRange.from && tempDateRange.to 
                ? `${format(tempDateRange.from, 'dd/MM/yyyy')} - ${format(tempDateRange.to, 'dd/MM/yyyy')}`
                : tempDateRange.from 
                  ? `${format(tempDateRange.from, 'dd/MM/yyyy')} - Selecione data final`
                  : "Selecione data inicial e final"
              }
            </span>
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" />
              <span>Selecione início e fim</span>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={tempDateRange}
            onSelect={handleRangeSelect}
            locale={ptBR}
            initialFocus
            disabled={{
              before: new Date(2022, 0, 1), // Desabilita datas antes de 01/01/2022
            }}
          />
          <div className="p-2 border-t flex justify-between">
            <Button variant="outline" size="sm" onClick={cancelSelection}>
              Cancelar
            </Button>
            <Button 
              size="sm" 
              disabled={!tempDateRange.from || !tempDateRange.to}
              onClick={() => {
                if (tempDateRange.from && tempDateRange.to) {
                  setDateRange({ from: tempDateRange.from, to: tempDateRange.to });
                  setIsCalendarOpen(false);
                }
              }}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelector;
