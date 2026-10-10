import React from 'react';
import { Info } from 'lucide-react';

interface DemoDataBadgeProps {
  label?: string;
  className?: string;
}

export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({
  label = 'Illustrative Demo Record',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded ${className}`}
      title="This record is synthetic demonstration data for product exploration and testing."
    >
      <Info className="w-3 h-3 text-amber-600" />
      {label}
    </span>
  );
};
