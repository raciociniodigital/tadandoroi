import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DatePicker from './DatePicker';
import TrackingForm from './TrackingForm';
import MetricsDisplay from './MetricsDisplay';
import { useTrackingCalculations } from './useTrackingCalculations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userId, isSignedIn } = useAuth();
  
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

  // Fetch data for selected date when date changes or user signs in
  useEffect(() => {
    const fetchDailyRecord = async () => {
      if (!isSignedIn || !userId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        console.log('Buscando dados para a data:', dateStr, 'com userId:', userId);
        
        // Make sure we're authenticated with Supabase
        const authSynced = await syncSupabaseAuth();
        if (!authSynced) {
          console.error('Erro na autenticação com Supabase');
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível autenticar com o Supabase. Tente fazer login novamente.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const { data: record, error } = await supabase
          .from('daily_records')
          .select('*')
          .eq('user_id', userId)
          .eq('date', dateStr)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao buscar dados:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível buscar os dados para esta data.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('Dados encontrados:', record);
        
        if (record) {
          setInvestment(record.investment.toString());
          setSales(record.sales.toString());
          setRevenue(record.revenue.toString());
        } else {
          // Clear form if no data exists for this day
          setInvestment('');
          setSales('');
          setRevenue('');
        }
      } catch (error) {
        console.error('Erro ao buscar registro diário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyRecord();
  }, [date, userId, isSignedIn, setInvestment, setSales, setRevenue, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !userId) {
      toast({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para salvar dados.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Ensure we have a valid Supabase authentication
      const authSynced = await syncSupabaseAuth();
      
      if (!authSynced) {
        throw new Error('Falha ao autenticar com o Supabase');
      }
      
      // Convert form data
      const data: TrackingData = {
        investment: investmentValue,
        sales: salesValue,
        revenue: revenueValue,
      };

      // Format date as string for Supabase
      const dateStr = format(date, 'yyyy-MM-dd');

      // Logging for debugging
      console.log('Salvando dados:', {
        user_id: userId,
        date: dateStr,
        investment: data.investment,
        sales: data.sales,
        revenue: data.revenue
      });
      
      // Important: Make sure we're using the userId as a string here
      const { error } = await supabase
        .from('daily_records')
        .upsert({
          user_id: userId,
          date: dateStr,
          investment: data.investment,
          sales: data.sales,
          revenue: data.revenue,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('Erro detalhado ao salvar:', error);
        throw error;
      }
      
      console.log("Dados salvos com sucesso!");
      
      if (onDataSubmit) {
        onDataSubmit(date, data);
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `Registro para ${format(date, 'PPP', { locale: ptBR })} foi salvo.`,
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
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

          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting || isLoading || !isSignedIn}
        >
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? "Salvando..." : isSignedIn ? "Salvar Dados" : "Faça login para salvar"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyTracker;
