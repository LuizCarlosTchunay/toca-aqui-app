import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = true,
}) => {
  const {colors, spacing, borderRadius} = useTheme();

  const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: padding ? spacing.lg : 0,
    },
  });

  return <View style={[cardStyles.card, style]}>{children}</View>;
};