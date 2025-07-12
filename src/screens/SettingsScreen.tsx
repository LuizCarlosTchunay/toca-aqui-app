import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {useAuth} from '../hooks/useAuth';
import {RootStackParamList} from '../App';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {colors, spacing, fontSize} = useTheme();
  const {user, signOut} = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    locationServices: false,
    darkMode: true,
    autoBackup: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Sair', style: 'destructive', onPress: signOut},
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Implementar exclusão de conta
            Alert.alert('Funcionalidade em desenvolvimento');
          },
        },
      ],
    );
  };

  const SettingItem = ({
    title,
    description,
    value,
    onValueChange,
    type = 'switch',
    onPress,
  }: {
    title: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={type === 'button' ? onPress : undefined}
      disabled={type === 'switch'}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{false: colors.border, true: colors.accent}}
          thumbColor={colors.textPrimary}
        />
      )}
      {type === 'button' && (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    profileCard: {
      padding: spacing.lg,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    profileName: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    profileEmail: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    settingDescription: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    settingArrow: {
      fontSize: fontSize.xl,
      color: colors.textSecondary,
    },
    dangerSection: {
      marginTop: spacing.xl,
    },
    dangerButton: {
      marginTop: spacing.md,
    },
    version: {
      textAlign: 'center',
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <Text style={styles.profileName}>
            {user?.user_metadata?.nome || 'Usuário'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </Card>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <Card padding={false}>
            <SettingItem
              title="Editar Perfil"
              description="Altere suas informações pessoais"
              type="button"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <SettingItem
              title="Alterar Senha"
              description="Modifique sua senha de acesso"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Privacidade"
              description="Gerencie suas configurações de privacidade"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Card padding={false}>
            <SettingItem
              title="Notificações"
              description="Receber notificações do app"
              value={settings.notifications}
              onValueChange={value => handleSettingChange('notifications', value)}
            />
            <SettingItem
              title="Notificações por Email"
              description="Receber emails sobre atividades importantes"
              value={settings.emailNotifications}
              onValueChange={value =>
                handleSettingChange('emailNotifications', value)
              }
            />
            <SettingItem
              title="Notificações Push"
              description="Receber notificações push no dispositivo"
              value={settings.pushNotifications}
              onValueChange={value =>
                handleSettingChange('pushNotifications', value)
              }
            />
          </Card>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          <Card padding={false}>
            <SettingItem
              title="Serviços de Localização"
              description="Permitir acesso à localização para eventos próximos"
              value={settings.locationServices}
              onValueChange={value =>
                handleSettingChange('locationServices', value)
              }
            />
            <SettingItem
              title="Modo Escuro"
              description="Interface com tema escuro"
              value={settings.darkMode}
              onValueChange={value => handleSettingChange('darkMode', value)}
            />
            <SettingItem
              title="Backup Automático"
              description="Fazer backup automático dos dados"
              value={settings.autoBackup}
              onValueChange={value => handleSettingChange('autoBackup', value)}
            />
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <Card padding={false}>
            <SettingItem
              title="Central de Ajuda"
              description="Encontre respostas para suas dúvidas"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Fale Conosco"
              description="Entre em contato com nossa equipe"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Avaliar App"
              description="Deixe sua avaliação na loja"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Termos de Uso"
              description="Leia nossos termos e condições"
              type="button"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            />
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Zona de Perigo</Text>
          <Button
            title="Sair da Conta"
            onPress={handleSignOut}
            variant="outline"
            style={styles.dangerButton}
          />
          <Button
            title="Excluir Conta"
            onPress={handleDeleteAccount}
            variant="outline"
            style={[styles.dangerButton, {borderColor: colors.error}]}
            textStyle={{color: colors.error}}
          />
        </View>

        <Text style={styles.version}>Toca Aqui v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;