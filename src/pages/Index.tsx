import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, Calendar, LineChart, Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Feature = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 'animation-delay-0' 
}: { 
  icon: any; 
  title: string; 
  description: string;
  delay?: string;
}) => (
  <div className={cn("glass-card hover-glass-card p-6 rounded-xl animate-fade-up", delay)}>
    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Nav */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed top-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gradient">
              Tá Dando<span className="text-foreground">ROI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            Monitoramento Inteligente
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Acompanhe seu <span className="text-gradient">investimento</span> em tráfego e <span className="text-gradient">maximize</span> seus resultados
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma completa para monitorar, analisar e otimizar seus gastos com tráfego pago, ajudando a tomar decisões baseadas em dados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                <Lock className="h-4 w-4" /> Fazer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="w-full max-w-5xl mx-auto mb-20 px-4">
          <div className="glass-card rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-sidebar p-2 border-b border-border/40 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-danger/60"></div>
                <div className="w-3 h-3 rounded-full bg-warning/60"></div>
                <div className="w-3 h-3 rounded-full bg-success/60"></div>
              </div>
            </div>
            <div className="p-4 bg-card">
              <div className="animate-pulse-subtle">
                <div className="h-8 w-1/4 bg-white/5 rounded-md mb-4"></div>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white/5 h-24 rounded-md"></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 h-64 rounded-md"></div>
                  <div className="bg-white/5 h-64 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Faça Login Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para <span className="text-gradient">otimizar</span> seus resultados?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece hoje mesmo a monitorar e melhorar o desempenho do seu investimento em tráfego.
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Fazer Login <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Tá Dando ROI. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
