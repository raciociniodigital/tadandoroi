
import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import DayActions from './DayActions';

interface DayData {
  day: number;
  id: string | null;
  investment: number | null;
  sales: number | null;
  revenue?: number | null;
  costPerSale: number | null;
  profit: number | null;
  roas: number | null;
}

interface TableRowProps {
  day: DayData;
  editingDay: number | null;
  editData: {
    investment: string;
    sales: string;
    revenue: string;
  };
  onEdit: (day: number, dayData: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNew: (day: number) => void;
  onInputChange: (field: string, value: string) => void;
  getRoasColorClass: (roas: number | null) => string;
  getProfitColorClass: (profit: number | null) => string;
}

const TableRow: React.FC<TableRowProps> = ({
  day,
  editingDay,
  editData,
  onEdit,
  onSave,
  onCancel,
  onAddNew,
  onInputChange,
  getRoasColorClass,
  getProfitColorClass
}) => {
  const isEditing = editingDay === day.day;
  
  return (
    <tr 
      className={cn(
        "border-t hover:bg-muted/30 transition-colors",
        day.day % 2 === 0 ? "bg-muted/10" : ""
      )}
    >
      <td className="py-3 px-4 border-r font-medium">{day.day}</td>
      
      {isEditing ? (
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
            <DayActions 
              isEditing={true}
              hasData={day.investment !== null}
              onEdit={() => onEdit(day.day, day)}
              onSave={onSave}
              onCancel={onCancel}
              onAddNew={() => onAddNew(day.day)}
            />
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
            <DayActions 
              isEditing={false}
              hasData={day.investment !== null}
              onEdit={() => onEdit(day.day, day)}
              onSave={onSave}
              onCancel={onCancel}
              onAddNew={() => onAddNew(day.day)}
            />
          </td>
        </>
      )}
    </tr>
  );
};

export default TableRow;
