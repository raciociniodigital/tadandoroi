
import Layout from '@/components/Layout';
import DailyTracker from '@/components/dashboard/DailyTracker';

const DailyTracking = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Registro Diário</h1>
          <p className="text-muted-foreground">
            Registre seus investimentos e resultados diários
          </p>
        </div>
        
        <DailyTracker />
      </div>
    </Layout>
  );
};

export default DailyTracking;
