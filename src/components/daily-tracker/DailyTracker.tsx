
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import DatePicker from './DatePicker';
import TrackingForm from './TrackingForm';
import MetricsDisplay from './MetricsDisplay';
import { useTrackingCalculations } from './useTrackingCalculations';

interface TrackingData {
  investment: number;
  sales: number;
  revenue: number;
}

interface DailyTrackerProps {
  onDataSubmit?: (date: Date, data: TrackingData) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ onDataSubmit }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    investment,
    setInvestment,
    sales,
    setSales,
    revenue,
    setRevenue,
    investmentValue,
    salesValue,
    revenueValue,
    profit,
    costPerSale,
    roas
  } = useTrackingCalculations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert form data
    const data: TrackingData = {
      investment: investmentValue,
      sales: salesValue,
      revenue: revenueValue,
    };

    // Simulate API call
    setTimeout(() => {
      if (onDataSubmit) {
        onDataSubmit(date, data);
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `Registro para ${format(date, 'PPP', { locale: ptBR })} foi salvo.`,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="glass-card shadow-lg w-full max-w-3xl mx-auto animate-fade-up">
      <CardHeader>
        <CardTitle className="text-gradient text-2xl">Registro Diário de Tráfego</CardTitle>
        <CardDescription>
          Registre os dados de investimento e vendas para análise de performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DatePicker date={date} setDate={setDate} />

          <TrackingForm 
            investment={investment}
            setInvestment={setInvestment}
            sales={sales}
            setSales={setSales}
            revenue={revenue}
            setRevenue={setRevenue}
          />

          <MetricsDisplay
            profit={profit}
            costPerSale={costPerSale}
            roas={roas}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? "Salvando..." : "Salvar Dados"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyTracker;
