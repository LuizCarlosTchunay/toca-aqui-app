import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {Session, User} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {supabase} from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  currentRole: 'contratante' | 'profissional';
  setCurrentRole: (role: 'contratante' | 'profissional') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<
    'contratante' | 'profissional'
  >('contratante');

  useEffect(() => {
    const setupAuth = async () => {
      // Get initial session
      const {
        data: {session: initialSession},
      } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      // Load saved role
      const savedRole = await AsyncStorage.getItem('userRole');
      if (savedRole) {
        setCurrentRole(savedRole as 'contratante' | 'profissional');
      }

      setLoading(false);

      // Listen for auth changes
      const {
        data: {subscription},
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao realizar login',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    try {
      setLoading(true);
      const {error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: name,
            telefone: phone,
            tipo_inicial: 'contratante',
            tem_perfil_profissional: false,
          },
        },
      });

      if (error) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado com sucesso!',
        text2: 'Verifique seu email para confirmar sua conta.',
      });
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const {error} = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear saved role
      await AsyncStorage.removeItem('userRole');

      Toast.show({
        type: 'success',
        text1: 'Logout realizado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer logout',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const {error} = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: 'Email de redefinição enviado',
        text2: 'Verifique sua caixa de entrada',
      });
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar email',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentRole = async (role: 'contratante' | 'profissional') => {
    setCurrentRole(role);
    await AsyncStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};