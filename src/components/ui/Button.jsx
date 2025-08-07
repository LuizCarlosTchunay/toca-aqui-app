
import React from 'react';

export const Button = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  textClassName = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-accent text-text-primary hover:bg-accent-hover',
    secondary: 'bg-card text-text-primary hover:bg-border',
    outline: 'border border-border text-text-primary hover:bg-card',
    ghost: 'text-text-primary hover:bg-card',
  };
  
  const sizeClasses = {
    sm: 'px-sm py-xs text-sm',
    md: 'px-md py-sm text-md',
    lg: 'px-lg py-md text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
    >
      <span className={textClassName}>
        {children || title}
      </span>
    </button>
  );
};
