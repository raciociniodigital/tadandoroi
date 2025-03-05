import React, { useState } from 'react';
import { 
  CalendarDays, 
  Calendar as CalendarIcon, 
  ChevronDown,
  Info
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import DataCard from '@/components/ui/DataCard';
import ChartContainer from '@/components/ui/ChartContainer';

const generateSampleData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const investment = Math.random() * 300 + 200;
    const sales = Math.floor(Math.random() * 20) + 5;
    const revenue = sales * (Math.random() * 100 + 50);
    const profit = revenue - investment;
    const roas = revenue / investment;
    
    data.push({
      name: format(date, 'dd/MM', { locale: ptBR }),
      date: date,
      investment: investment,
      revenue: revenue,
      sales: sales,
      profit: profit,
      roas: roas
    });
  }
  
  return data;
};

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const getDataForPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return generateSampleData(0);
      case '7d':
        return generateSampleData(7);
      case '30d':
        return generateSampleData(30);
      case 'custom':
        const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return generateSampleData(diffDays);
      default:
        return generateSampleData(7);
    }
  };

  const data = getDataForPeriod();
  
  const calculateSummary = () => {
    const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const averageRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
    
    return {
      investment: totalInvestment.toFixed(2),
      revenue: totalRevenue.toFixed(2),
      sales: totalSales,
      profit: totalProfit.toFixed(2),
      roas: averageRoas.toFixed(2)
    };
  };
  
  const summary = calculateSummary();
  
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today':
        return 'Hoje';
      case '7d':
        return 'Últimos 7 dias';
      case '30d':
        return 'Últimos 30 dias';
      case 'custom':
        return `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')}`;
      default:
        return 'Últimos 7 dias';
    }
  };

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      setIsCalendarOpen(false);
    } else if (range.from) {
      toast({
        title: "Selecione a data final",
        description: "Você selecionou a data inicial. Agora clique em uma data para definir o fim do período.",
      });
    }
  };

  const handleCustomPeriodClick = () => {
    setSelectedPeriod('custom');
    setIsCalendarOpen(true);
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
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] truncate">
                <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">{getPeriodLabel()}</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPeriod('today')}>
                Hoje
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('7d')}>
                Últimos 7 dias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('30d')}>
                Últimos 30 dias
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCustomPeriodClick}>
                Período personalizado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedPeriod === 'custom' && (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Selecionar datas
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-2 text-sm border-b flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {dateRange.from && dateRange.to 
                      ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                      : "Selecione data inicial e final"
                    }
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Selecione início e fim</span>
                  </div>
                </div>
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={handleRangeSelect}
                  locale={ptBR}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
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
    </div>
  );
};

export default Dashboard;
