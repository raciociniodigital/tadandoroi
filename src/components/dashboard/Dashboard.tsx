
import React from 'react';
import { useDashboardData } from './useDashboardData';
import DateRangeSelector from './DateRangeSelector';
import DashboardSummary from './DashboardSummary';
import DashboardCharts from './DashboardCharts';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { 
    data, 
    summary, 
    selectedPeriod, 
    setSelectedPeriod, 
    dateRange, 
    setDateRange 
  } = useDashboardData();

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today':
        return 'Hoje';
      case '7d':
        return 'Últimos 7 dias';
      case '30d':
        return 'Últimos 30 dias';
      case 'custom':
        return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
      default:
        return 'Últimos 7 dias';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Análise de desempenho - {getPeriodLabel()}
          </p>
        </div>
        
        <DateRangeSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      
      <DashboardSummary summary={summary} />
      
      <DashboardCharts data={data} />
    </div>
  );
};

export default Dashboard;
