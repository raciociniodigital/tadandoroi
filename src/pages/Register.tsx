
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">
          Tá Dando<span className="text-foreground">ROI</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe seus investimentos em tráfego e maximize seus resultados
        </p>
      </div>
      
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Página Não Disponível</h1>
          <p className="mt-2 text-muted-foreground">
            O cadastro é feito apenas através da compra de planos
          </p>
        </div>
        
        <div className="space-y-6 text-center">
          <div className="rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-medium mb-4">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">
              No momento, novos cadastros são permitidos apenas através da aquisição de um dos nossos planos. 
              Entre em contato conosco para mais informações.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button variant="outline" asChild>
                <Link to="/login">Fazer Login</Link>
              </Button>
              
              <Button asChild>
                <Link to="/">Voltar para a Página Inicial</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
