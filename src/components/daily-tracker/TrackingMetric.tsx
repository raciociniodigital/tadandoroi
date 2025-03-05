
import React from 'react';
import { cn } from '@/lib/utils';

interface TrackingMetricProps {
  title: string;
  value: string | number;
  className?: string;
}

const TrackingMetric: React.FC<TrackingMetricProps> = ({ 
  title, 
  value, 
  className 
}) => {
  return (
    <div className={cn("glass-card rounded-xl p-4", className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
      <p className={cn("text-xl font-semibold")}>
        {value}
      </p>
    </div>
  );
};

export default TrackingMetric;
