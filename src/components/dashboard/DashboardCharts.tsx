
import React from 'react';
import ChartContainer from '@/components/ui/ChartContainer';

interface DashboardChartsProps {
  data: any[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer
          title="Receita vs. Investimento"
          description="Comparativo entre receita e investimento ao longo do tempo"
          data={data}
          type="area"
          dataKeys={['revenue', 'investment']}
          colors={['#10b981', '#0ea5e9']}
          animationDelay="animation-delay-100"
        />
        <ChartContainer
          title="Vendas Diárias"
          description="Número de vendas realizadas por dia"
          data={data}
          type="bar"
          dataKeys={['sales']}
          colors={['#8b5cf6']}
          animationDelay="animation-delay-200"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer
          title="Evolução do ROAS"
          description="Retorno sobre investimento ao longo do tempo"
          data={data}
          type="line"
          dataKeys={['roas']}
          colors={['#f59e0b']}
          animationDelay="animation-delay-300"
        />
        <ChartContainer
          title="Lucro Diário"
          description="Lucro obtido a cada dia"
          data={data}
          type="area"
          dataKeys={['profit']}
          colors={['#10b981']}
          animationDelay="animation-delay-400"
        />
      </div>
    </>
  );
};

export default DashboardCharts;
