import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../contexts/ThemeContext';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {Card} from '../components/ui/Card';
import {useAuth} from '../hooks/useAuth';
import {RootStackParamList} from '../App';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;
type AuthScreenRouteProp = RouteProp<RootStackParamList, 'Auth'>;

type AuthMode = 'login' | 'register' | 'reset-password';

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute<AuthScreenRouteProp>();
  const {colors, spacing, fontSize} = useTheme();
  const {signIn, signUp, resetPassword, loading} = useAuth();

  const [mode, setMode] = useState<AuthMode>(route.params?.mode || 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (mode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (mode !== 'reset-password' && !formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        navigation.replace('Dashboard');
      } else if (mode === 'register') {
        await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.phone,
        );
        setMode('login');
      } else if (mode === 'reset-password') {
        await resetPassword(formData.email);
        setMode('login');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'register':
        return 'Criar Conta';
      case 'reset-password':
        return 'Recuperar Senha';
      default:
        return 'Entrar';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    logo: {
      fontSize: fontSize.xxxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    logoAccent: {
      color: colors.accent,
    },
    card: {
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    switchModeContainer: {
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    switchModeText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    switchModeButton: {
      marginTop: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              Toca<Text style={styles.logoAccent}>Aqui</Text>
            </Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.title}>{getTitle()}</Text>

            {mode === 'register' && (
              <>
                <Input
                  label="Nome completo"
                  value={formData.name}
                  onChangeText={text =>
                    setFormData(prev => ({...prev, name: text}))
                  }
                  error={errors.name}
                  placeholder="Digite seu nome completo"
                />
                <Input
                  label="Telefone"
                  value={formData.phone}
                  onChangeText={text =>
                    setFormData(prev => ({...prev, phone: text}))
                  }
                  error={errors.phone}
                  placeholder="(XX) XXXXX-XXXX"
                  keyboardType="phone-pad"
                />
              </>
            )}

            <Input
              label="E-mail"
              value={formData.email}
              onChangeText={text =>
                setFormData(prev => ({...prev, email: text}))
              }
              error={errors.email}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {mode !== 'reset-password' && (
              <Input
                label="Senha"
                value={formData.password}
                onChangeText={text =>
                  setFormData(prev => ({...prev, password: text}))
                }
                error={errors.password}
                placeholder={
                  mode === 'login' ? 'Sua senha' : 'Crie uma senha forte'
                }
                secureTextEntry
              />
            )}

            {mode === 'register' && (
              <Input
                label="Confirmar senha"
                value={formData.confirmPassword}
                onChangeText={text =>
                  setFormData(prev => ({...prev, confirmPassword: text}))
                }
                error={errors.confirmPassword}
                placeholder="Confirme sua senha"
                secureTextEntry
              />
            )}

            {mode === 'login' && (
              <Button
                title="Esqueceu a senha?"
                onPress={() => setMode('reset-password')}
                variant="ghost"
                style={styles.switchModeButton}
              />
            )}

            <Button
              title={
                mode === 'login'
                  ? 'Entrar'
                  : mode === 'register'
                  ? 'Cadastrar'
                  : 'Enviar e-mail de recuperação'
              }
              onPress={handleSubmit}
              loading={loading}
              style={{marginTop: spacing.lg}}
            />
          </Card>

          <View style={styles.switchModeContainer}>
            <Text style={styles.switchModeText}>
              {mode === 'login'
                ? 'Ainda não tem uma conta?'
                : mode === 'register'
                ? 'Já possui uma conta?'
                : 'Lembrou sua senha?'}
            </Text>
            <Button
              title={
                mode === 'login'
                  ? 'Cadastre-se'
                  : mode === 'register'
                  ? 'Faça login'
                  : 'Voltar ao login'
              }
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;