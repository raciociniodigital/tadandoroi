
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para <span className="text-gradient">otimizar</span> seus resultados?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo a monitorar e melhorar o desempenho do seu investimento em tráfego.
          </p>
          <Link to="/plans">
            <Button size="lg" className="gap-2">
              Ver Planos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
