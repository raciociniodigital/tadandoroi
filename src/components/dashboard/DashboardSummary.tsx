
import React from 'react';
import DataCard from '@/components/ui/DataCard';

interface DashboardSummaryProps {
  summary: {
    investment: string;
    revenue: string;
    sales: number;
    profit: string;
    roas: string;
  };
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <DataCard
        title="Investimento"
        value={summary.investment}
        type="currency"
        icon="money"
        animationDelay="animation-delay-100"
        description="Total investido no período"
      />
      <DataCard
        title="Receita"
        value={summary.revenue}
        type="currency"
        icon="money"
        animationDelay="animation-delay-200"
        description="Receita total no período"
      />
      <DataCard
        title="Vendas"
        value={summary.sales}
        type="count"
        icon="sales"
        animationDelay="animation-delay-300"
        description="Número de vendas realizadas"
      />
      <DataCard
        title="Lucro"
        value={summary.profit}
        type="currency"
        icon="profit"
        animationDelay="animation-delay-400"
        description="Lucro líquido no período"
      />
      <DataCard
        title="ROAS"
        value={summary.roas}
        icon="roas"
        animationDelay="animation-delay-500"
        description="Retorno sobre investimento"
      />
    </div>
  );
};

export default DashboardSummary;
