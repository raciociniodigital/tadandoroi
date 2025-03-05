
import React from 'react';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrackingFormProps {
  investment: string;
  setInvestment: (value: string) => void;
  sales: string;
  setSales: (value: string) => void;
  revenue: string;
  setRevenue: (value: string) => void;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  investment,
  setInvestment,
  sales,
  setSales,
  revenue,
  setRevenue,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Investment */}
      <div className="space-y-2">
        <Label htmlFor="investment">Investimento em Tráfego (R$)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="investment"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            className="pl-10"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Revenue */}
      <div className="space-y-2">
        <Label htmlFor="revenue">Receita Total (R$)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="revenue"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            className="pl-10"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Sales Count */}
      <div className="space-y-2">
        <Label htmlFor="sales">Quantidade de Vendas</Label>
        <div className="relative">
          <ShoppingCart className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="sales"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            className="pl-10"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default TrackingForm;
