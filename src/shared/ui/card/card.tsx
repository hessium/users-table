
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: boolean;
}

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  gradient = false,
} : CardProps) => {
  const baseClasses = 'rounded-lg overflow-hidden bg-slate-800 shadow-lg';
  const hoverClasses = hoverEffect 
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:brightness-110' 
    : '';
  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
    : '';

  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};
