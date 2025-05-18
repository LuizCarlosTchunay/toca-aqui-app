
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  currentRole: "contratante" | "profissional";
  setCurrentRole: (role: "contratante" | "profissional") => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<"contratante" | "profissional">("contratante");
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };
    
    setupAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            nome: name,
            telefone: phone,
            tipo_inicial: "contratante",
            tem_perfil_profissional: false
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Enviamos um link para redefinição de senha para seu email");
    } catch (error: any) {
      console.error("Erro ao enviar email de redefinição:", error);
      toast.error(error.message || "Erro ao enviar email de redefinição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      currentRole,
      setCurrentRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
