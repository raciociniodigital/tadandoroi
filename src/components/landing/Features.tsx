
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Calendar, LineChart, Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Feature from './Feature';

const Features = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            Recursos Principais
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Uma solução completa para <span className="text-gradient">gerenciar</span> seu tráfego</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitore e analise o desempenho dos seus investimentos em tráfego pago para maximizar seus resultados e otimizar seu ROAS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature 
            icon={Calendar} 
            title="Registro Diário" 
            description="Registre facilmente seus investimentos e resultados diários para um acompanhamento detalhado."
            delay="animation-delay-100"
          />
          <Feature 
            icon={BarChart} 
            title="Dashboard Intuitivo" 
            description="Visualize todos os seus dados em um dashboard moderno e interativo para fácil compreensão."
            delay="animation-delay-200"
          />
          <Feature 
            icon={TrendingUp} 
            title="Análise de ROAS" 
            description="Acompanhe o retorno sobre o investimento em publicidade para otimizar suas campanhas."
            delay="animation-delay-300"
          />
          <Feature 
            icon={LineChart} 
            title="Gráficos Detalhados" 
            description="Analise tendências e padrões com gráficos interativos e filtros personalizados."
            delay="animation-delay-400"
          />
          <Feature 
            icon={Lock} 
            title="Dados Seguros" 
            description="Suas informações ficam armazenadas com segurança e acessíveis a qualquer momento."
            delay="animation-delay-500"
          />
          <div className="glass-card hover-glass-card p-6 rounded-xl animate-fade-up animation-delay-600 bg-primary/5 border border-primary/20">
            <h3 className="text-xl font-semibold mb-2">E muito mais...</h3>
            <p className="text-muted-foreground mb-4">Descubra todos os recursos que preparamos para ajudar no seu crescimento.</p>
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Comece a Usar Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
