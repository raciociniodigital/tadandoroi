
import React from 'react';
import { cn } from '@/lib/utils';
import { Edit, DollarSign, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DayData } from '../utils/recordsUtils';

interface RecordRowProps {
  dayData: DayData;
  editingDay: number | null;
  editData: {
    investment: string;
    sales: string;
    revenue: string;
  };
  onEdit: (day: number, dayData: DayData) => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
  onAddNew: (day: number) => void;
}

const RecordRow: React.FC<RecordRowProps> = ({
  dayData,
  editingDay,
  editData,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onAddNew,
}) => {
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

  return (
    <tr 
      className={cn(
        "border-t hover:bg-muted/30 transition-colors",
        dayData.day % 2 === 0 ? "bg-muted/10" : ""
      )}
    >
      <td className="py-3 px-4 border-r font-medium">{dayData.day}</td>
      
      {editingDay === dayData.day ? (
        <>
          <td className="py-3 px-4 border-r">
            <Input
              type="number"
              value={editData.investment}
              onChange={(e) => onInputChange('investment', e.target.value)}
              className="w-full"
            />
          </td>
          <td className="py-3 px-4 border-r">
            <Input
              type="number"
              value={editData.sales}
              onChange={(e) => onInputChange('sales', e.target.value)}
              className="w-full"
            />
          </td>
          <td className="py-3 px-4 border-r">
            <Input
              type="number"
              value={editData.revenue}
              onChange={(e) => onInputChange('revenue', e.target.value)}
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
                onClick={onSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onCancel}
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
            {dayData.investment !== null 
              ? dayData.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
              : '-'}
          </td>
          <td className="py-3 px-4 text-left border-r">
            {dayData.sales !== null ? dayData.sales : '-'}
          </td>
          <td className="py-3 px-4 text-left border-r">
            {dayData.costPerSale !== null 
              ? dayData.costPerSale.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
              : '-'}
          </td>
          <td className={cn("py-3 px-4 text-left border-r", getProfitColorClass(dayData.profit))}>
            {dayData.profit !== null 
              ? dayData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
              : '-'}
          </td>
          <td className={cn("py-3 px-4 text-left border-r font-medium", getRoasColorClass(dayData.roas))}>
            {dayData.roas !== null 
              ? dayData.roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
              : '-'}
          </td>
          <td className="py-3 px-4 text-center">
            {dayData.investment !== null ? (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEdit(dayData.day, dayData)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onAddNew(dayData.day)}
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
  );
};

export default RecordRow;
