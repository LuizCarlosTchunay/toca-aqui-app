
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = true 
}) => {
  return (
    <div 
      className={`
        bg-card border border-border rounded-lg
        ${padding ? 'p-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
