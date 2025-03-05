
import React from 'react';
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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);
  const { toast } = useToast();

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

    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      setIsCalendarOpen(false);
    } else if (range.from) {
      toast({
        title: "Selecione a data final",
        description: "Você selecionou a data inicial. Agora clique em uma data para definir o fim do período.",
      });
    }
  };

  const handleCustomPeriodClick = () => {
    setSelectedPeriod('custom');
    setIsCalendarOpen(true);
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
      
      {selectedPeriod === 'custom' && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Selecionar datas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-2 text-sm border-b flex items-center justify-between">
              <span className="text-muted-foreground">
                {dateRange.from && dateRange.to 
                  ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
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
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={handleRangeSelect}
              locale={ptBR}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateRangeSelector;
