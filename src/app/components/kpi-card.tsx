import { LucideIcon } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: KpiCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-[#0A2E50]',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const trendColor = trend && trend.value > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={cn("text-sm font-medium mt-2", trendColor)}>
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
