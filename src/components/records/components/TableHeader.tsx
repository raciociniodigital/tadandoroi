
import React from 'react';
import { Calendar, DollarSign, ShoppingCart, Calculator, TrendingUp } from 'lucide-react';

const TableHeader: React.FC = () => {
  return (
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
  );
};

export default TableHeader;
