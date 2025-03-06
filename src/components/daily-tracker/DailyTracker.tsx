
import React, { useState, useEffect } from 'react';
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
import { saveRecord, getRecordByDate } from '@/services/trackingService';
import { useAuth } from '@/context/AuthContext';

interface DailyTrackerProps {
  onDataSubmit?: (date: Date, data: any) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ onDataSubmit }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
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

  // Carregar dados existentes quando mudar a data
  useEffect(() => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const existingRecord = getRecordByDate(dateKey);
    
    if (existingRecord) {
      setInvestment(existingRecord.investment.toString());
      setSales(existingRecord.sales.toString());
      setRevenue(existingRecord.revenue.toString());
    } else {
      // Limpar formulário se não houver dados para esta data
      setInvestment('');
      setSales('');
      setRevenue('');
    }
  }, [date, setInvestment, setSales, setRevenue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro ao salvar",
        description: "Você precisa estar logado para salvar registros.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    // Converter dados do formulário
    const data = {
      investment: investmentValue,
      sales: salesValue,
      revenue: revenueValue,
    };

    // Formatar data como chave para armazenamento
    const dateKey = format(date, 'yyyy-MM-dd');

    try {
      // Salvar no serviço
      saveRecord(dateKey, data);
      
      if (onDataSubmit) {
        onDataSubmit(date, data);
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `Registro para ${format(date, 'PPP', { locale: ptBR })} foi salvo.`,
      });
      
      console.log("Registro diário salvo:", dateKey, data);
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
