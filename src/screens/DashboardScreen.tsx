import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {useAuth} from '../hooks/useAuth';

const DashboardScreen = () => {
  const {colors, spacing, fontSize} = useTheme();
  const {user, currentRole, setCurrentRole, signOut} = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    roleToggle: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 4,
    },
    roleButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 6,
    },
    activeRole: {
      backgroundColor: colors.accent,
    },
    roleText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    activeRoleText: {
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    welcomeCard: {
      marginBottom: spacing.lg,
    },
    welcomeText: {
      fontSize: fontSize.lg,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    userEmail: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    quickActions: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    actionButton: {
      flex: 1,
      minWidth: '45%',
    },
  });

  const contractorActions = [
    {title: 'Criar Evento', action: () => {}},
    {title: 'Explorar Profissionais', action: () => {}},
    {title: 'Meus Eventos', action: () => {}},
    {title: 'Reservas', action: () => {}},
  ];

  const professionalActions = [
    {title: 'Editar Perfil', action: () => {}},
    {title: 'Ver Eventos', action: () => {}},
    {title: 'Candidaturas', action: () => {}},
    {title: 'Agenda', action: () => {}},
  ];

  const actions =
    currentRole === 'contratante' ? contractorActions : professionalActions;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.roleToggle}>
          <Button
            title="Contratante"
            onPress={() => setCurrentRole('contratante')}
            variant={currentRole === 'contratante' ? 'primary' : 'ghost'}
            size="sm"
          />
          <Button
            title="Profissional"
            onPress={() => setCurrentRole('profissional')}
            variant={currentRole === 'profissional' ? 'primary' : 'ghost'}
            size="sm"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Bem-vindo, {user?.user_metadata?.nome || 'Usuário'}!
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userEmail}>
            Modo: {currentRole === 'contratante' ? 'Contratante' : 'Profissional'}
          </Text>
        </Card>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionGrid}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.title}
                onPress={action.action}
                variant="outline"
                style={styles.actionButton}
              />
            ))}
          </View>
        </View>

        <Button title="Sair" onPress={signOut} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;