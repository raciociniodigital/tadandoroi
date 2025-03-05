
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Coins, 
  BarChart 
} from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  type?: 'default' | 'currency' | 'percentage' | 'count';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  icon?: 'money' | 'sales' | 'roas' | 'profit' | 'cost' | 'chart';
  className?: string;
  animationDelay?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  description,
  type = 'default',
  trend,
  trendValue,
  icon = 'chart',
  className,
  animationDelay = 'animation-delay-0',
}) => {
  // Format the value based on type
  const formattedValue = () => {
    switch (type) {
      case 'currency':
        return `R$ ${typeof value === 'number' ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value;
    }
  };

  // Get the icon component
  const IconComponent = () => {
    switch (icon) {
      case 'money':
        return <DollarSign className="h-5 w-5" />;
      case 'sales':
        return <ShoppingCart className="h-5 w-5" />;
      case 'roas':
        return <TrendingUp className="h-5 w-5" />;
      case 'profit':
        return <Coins className="h-5 w-5" />;
      case 'cost':
        return <DollarSign className="h-5 w-5" />;
      case 'chart':
      default:
        return <BarChart className="h-5 w-5" />;
    }
  };

  // Determine trend colors
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-light';
    if (trend === 'down') return 'text-danger-light';
    return 'text-muted-foreground';
  };

  return (
    <div 
      className={cn(
        "glass-card hover-glass-card relative overflow-hidden rounded-xl p-6 animate-fade-up",
        className,
        animationDelay
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md bg-primary/10 p-2 text-primary">
              <IconComponent />
            </span>
            <h3 className="font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="mt-4 flex items-end space-x-1">
            <p className="text-2xl font-semibold">{formattedValue()}</p>
            {trend && trendValue && (
              <span className={cn("flex items-center text-sm", getTrendColor())}>
                {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {trendValue}
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      
      {/* Decorative blur spot */}
      <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
};

export default DataCard;
