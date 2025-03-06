
import { LoginForm } from '@/components/auth';

const Login = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Tá Dando <span className="text-primary">ROI</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe seus investimentos em tráfego e maximize seus resultados
        </p>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default Login;
