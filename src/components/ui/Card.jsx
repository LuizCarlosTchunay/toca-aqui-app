
import React from 'react';

export const Card = ({ 
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
