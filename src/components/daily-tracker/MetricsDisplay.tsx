
import React from 'react';
import { cn } from '@/lib/utils';
import TrackingMetric from './TrackingMetric';

interface MetricsDisplayProps {
  profit: number;
  costPerSale: number;
  roas: number;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ profit, costPerSale, roas }) => {
  // Get ROAS color class
  const getRoasColorClass = () => {
    if (roas <= 1) return 'text-danger';
    if (roas <= 1.5) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <TrackingMetric 
        title="Lucro" 
        value={`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        className={cn(profit >= 0 ? "text-success" : "text-danger")}
      />
      <TrackingMetric 
        title="Custo por Venda" 
        value={`R$ ${costPerSale.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />
      <TrackingMetric 
        title="ROAS" 
        value={roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        className={getRoasColorClass()}
      />
    </div>
  );
};

export default MetricsDisplay;
