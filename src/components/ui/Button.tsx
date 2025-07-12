import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const {colors, spacing, borderRadius, fontSize} = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = spacing.sm;
        baseStyle.paddingHorizontal = spacing.md;
        baseStyle.minHeight = 36;
        break;
      case 'lg':
        baseStyle.paddingVertical = spacing.lg;
        baseStyle.paddingHorizontal = spacing.xl;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingVertical = spacing.md;
        baseStyle.paddingHorizontal = spacing.lg;
        baseStyle.minHeight = 44;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.card;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.accent;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      default:
        baseStyle.backgroundColor = colors.accent;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.fontSize = fontSize.sm;
        break;
      case 'lg':
        baseStyle.fontSize = fontSize.lg;
        break;
      default:
        baseStyle.fontSize = fontSize.md;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
        baseStyle.color = colors.accent;
        break;
      case 'ghost':
        baseStyle.color = colors.textSecondary;
        break;
      default:
        baseStyle.color = colors.textPrimary;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.accent : colors.textPrimary}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});