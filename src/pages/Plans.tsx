
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Plans = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Tá Dando <span className="text-primary">ROI</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Escolha o plano ideal para maximizar seus resultados com tráfego pago
        </p>
      </div>
      
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {/* Plano Mensal */}
        <PlanCard
          title="Plano Mensal"
          price="R$ 20"
          period="/mês"
          features={[
            "Acesso a todas as ferramentas",
            "Registro ilimitado de campanhas",
            "Análise de desempenho em tempo real",
            "Suporte por email",
          ]}
          checkoutUrl="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c938084955cc480019576f0e4fb0da1"
          cta="Assinar Plano Mensal"
          popular={false}
        />
        
        {/* Plano Anual */}
        <PlanCard
          title="Plano Anual"
          price="R$ 100"
          period="/ano"
          features={[
            "Tudo do plano mensal",
            "2 meses grátis",
            "Acesso prioritário a novos recursos",
            "Suporte prioritário",
          ]}
          checkoutUrl="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380849563a165019576f1bf8f0a63"
          cta="Assinar Plano Anual"
          popular={true}
        />
      </div>
      
      <div className="mt-10 text-center">
        <p className="mb-4 text-muted-foreground">
          Já tem uma conta? {" "}
          <Link to="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
        
        <Link to="/">
          <Button variant="ghost">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Plan Card Component
interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  checkoutUrl: string;
  cta: string;
  popular?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  period,
  features,
  checkoutUrl,
  cta,
  popular = false,
}) => {
  return (
    <Card className={`w-full flex flex-col border ${popular ? 'border-primary shadow-lg relative' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-max rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Mais popular
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full gap-2" variant={popular ? "default" : "outline"}>
            {cta} <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default Plans;
