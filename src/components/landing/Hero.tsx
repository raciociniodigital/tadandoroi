
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-24 flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          Monitoramento Inteligente
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Tá Dando <span className="text-primary">ROI</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Plataforma completa para monitorar, analisar e otimizar seus gastos com tráfego pago, ajudando a tomar decisões baseadas em dados.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/plans">
            <Button size="lg" className="gap-2">
              Ver Planos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="gap-2">
              <Lock className="h-4 w-4" /> Fazer Login
            </Button>
          </Link>
        </div>
      </div>

      <AppPreview />
    </section>
  );
};

const AppPreview = () => {
  return (
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
  );
};

export default Hero;
