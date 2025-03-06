
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthSelectorProps {
  formattedMonth: string;
  onPrevious: () => void;
  onNext: () => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  formattedMonth, 
  onPrevious, 
  onNext 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPrevious}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium min-w-[140px] text-center">
        {formattedMonth}
      </span>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onNext}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
