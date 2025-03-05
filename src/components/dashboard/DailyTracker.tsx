
import React, { useState } from 'react';
import { Calendar as CalendarIcon, DollarSign, Save, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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
  const [investment, setInvestment] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Calculate metrics
  const investmentValue = parseFloat(investment) || 0;
  const salesValue = parseInt(sales) || 0;
  const revenueValue = parseFloat(revenue) || 0;
  
  const profit = revenueValue - investmentValue;
  const costPerSale = salesValue > 0 ? investmentValue / salesValue : 0;
  const roas = investmentValue > 0 ? revenueValue / investmentValue : 0;

  // Get ROAS color class
  const getRoasColorClass = () => {
    if (roas <= 1) return 'text-danger';
    if (roas <= 1.5) return 'text-warning';
    return 'text-success';
  };

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
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Data do Registro</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

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

          {/* Calculated Metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Lucro</h4>
              <p className={cn("text-xl font-semibold", profit >= 0 ? "text-success" : "text-danger")}>
                R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Custo por Venda</h4>
              <p className="text-xl font-semibold">
                R$ {costPerSale.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">ROAS</h4>
              <p className={cn("text-xl font-semibold", getRoasColorClass())}>
                {roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
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
