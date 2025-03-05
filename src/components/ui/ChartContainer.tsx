
import React from 'react';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title: string;
  description?: string;
  data: any[];
  type: 'line' | 'bar' | 'area';
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  className?: string;
  animationDelay?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  data,
  type,
  dataKeys,
  colors = ['#10b981', '#34d399', '#059669'],
  xAxisKey = 'name',
  height = 300,
  className,
  animationDelay = 'animation-delay-0',
}) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-lg">
          <p className="mb-1 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value instanceof Date 
                ? entry.value.toLocaleDateString() 
                : typeof entry.value === 'number' 
                  ? entry.value.toLocaleString('pt-BR', { 
                      style: dataKeys[index].includes('investment') || dataKeys[index].includes('revenue') ? 'currency' : 'decimal',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <YAxis 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ stroke: colors[index % colors.length], strokeWidth: 2, r: 4, fill: '#111827' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <YAxis 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <YAxis 
              tick={{ fill: 'rgb(148 163 184)' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={`${colors[index % colors.length]}33`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "glass-card hover-glass-card rounded-xl p-6 animate-fade-up",
        className,
        animationDelay
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;
