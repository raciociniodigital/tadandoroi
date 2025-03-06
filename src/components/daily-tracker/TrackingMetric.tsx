
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TrackingMetricProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: ReactNode;
}

const TrackingMetric: React.FC<TrackingMetricProps> = ({ 
  title, 
  value, 
  className,
  icon
}) => {
  return (
    <div className={cn("glass-card rounded-xl p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <div>{icon}</div>}
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      </div>
      <p className={cn("text-xl font-semibold")}>
        {value}
      </p>
    </div>
  );
};

export default TrackingMetric;
