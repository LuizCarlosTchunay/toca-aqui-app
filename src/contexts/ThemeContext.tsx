import React, {createContext, useContext, ReactNode} from 'react';
import {colors, spacing, borderRadius, fontSize} from '../styles/colors';

interface ThemeContextType {
  colors: typeof colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  fontSize: typeof fontSize;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const theme = {
    colors,
    spacing,
    borderRadius,
    fontSize,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};