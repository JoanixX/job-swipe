import React, { ReactNode } from 'react';

interface CardFancyProps {
  children: ReactNode;
  className?: string;
}

// En lugar de usar @apply en CSS, usamos las clases de Tailwind directamente
export default function CardFancy({ children, className = '' }: CardFancyProps) {
  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative z-[1] ${className}`}
    >
      {children}
    </div>
  );
}