
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPreviousMonth}
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
        onClick={onNextMonth}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthNavigator;
