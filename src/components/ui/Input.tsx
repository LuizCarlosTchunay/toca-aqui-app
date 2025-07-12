import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const {colors, spacing, borderRadius, fontSize} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: fontSize.sm,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: isFocused ? colors.accent : colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      fontSize: fontSize.md,
      color: colors.textPrimary,
      minHeight: 44,
    },
    error: {
      fontSize: fontSize.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[inputStyles.container, containerStyle]}>
      {label && (
        <Text style={[inputStyles.label, labelStyle]}>{label}</Text>
      )}
      <TextInput
        style={[inputStyles.input, inputStyle]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={inputStyles.error}>{error}</Text>}
    </View>
  );
};