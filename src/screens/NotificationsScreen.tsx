import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../contexts/ThemeContext';

const NotificationsScreen = () => {
  const {colors, spacing, fontSize} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <Text style={styles.subtitle}>
        Esta tela será implementada nas próximas etapas
      </Text>
    </SafeAreaView>
  );
};

export default NotificationsScreen;