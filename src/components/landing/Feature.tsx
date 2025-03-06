
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: string;
}

const Feature = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 'animation-delay-0' 
}: FeatureProps) => (
  <div className={cn("glass-card hover-glass-card p-6 rounded-xl animate-fade-up", delay)}>
    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Feature;
