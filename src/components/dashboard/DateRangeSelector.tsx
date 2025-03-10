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
import { DateRange } from 'react-day-picker';

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
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  // Reset temporary date range when period changes or when opening the popover
  useEffect(() => {
    if (selectedPeriod === 'custom') {
      if (!isCalendarOpen) {
        // Keep the current selection when the popover is closed
        setTempDateRange({ from: dateRange.from, to: dateRange.to });
      } else {
        // Clear the selection when opening the calendar
        setTempDateRange(undefined);
      }
    }
  }, [selectedPeriod, dateRange, isCalendarOpen]);

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

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setTempDateRange(undefined);
      return;
    }

    setTempDateRange(range);

    if (range.from && !range.to) {
      toast({
        title: "Selecione a data final",
        description: "Você selecionou a data inicial. Agora clique em uma data para definir o fim do período.",
      });
    } else if (range.from && range.to) {
      // Não fecha automaticamente, deixa o usuário confirmar clicando em "Aplicar"
    }
  };

  const handleCustomPeriodClick = () => {
    setSelectedPeriod('custom');
    // Não definimos tempDateRange aqui, ele será limpo quando o popover abrir via useEffect
    setIsCalendarOpen(true);
  };

  const cancelSelection = () => {
    // Restaurar a seleção anterior ao fechar
    setTempDateRange({ from: dateRange.from, to: dateRange.to });
    setIsCalendarOpen(false);
  };

  const applySelection = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      setDateRange({ 
        from: tempDateRange.from, 
        to: tempDateRange.to 
      });
      setIsCalendarOpen(false);
    }
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
      
      <Popover open={isCalendarOpen} onOpenChange={(open) => {
        setIsCalendarOpen(open);
        if (!open) {
          // Quando fechamos o popover sem aplicar, restauramos a seleção anterior
          setTempDateRange({ from: dateRange.from, to: dateRange.to });
        }
      }}>
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
              {tempDateRange?.from && tempDateRange?.to 
                ? `${format(tempDateRange.from, 'dd/MM/yyyy')} - ${format(tempDateRange.to, 'dd/MM/yyyy')}`
                : tempDateRange?.from 
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
            className="pointer-events-auto"
          />
          <div className="p-2 border-t flex justify-between">
            <Button variant="outline" size="sm" onClick={cancelSelection}>
              Cancelar
            </Button>
            <Button 
              size="sm" 
              disabled={!tempDateRange?.from || !tempDateRange?.to}
              onClick={applySelection}
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
