
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register" | "reset-password";

const AuthPage: React.FC<{ initialMode?: AuthMode }> = ({
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
      } else if (mode === "register") {
        await signUp(formData.email, formData.password, formData.name, formData.phone);
      } else if (mode === "reset-password") {
        await resetPassword(formData.email);
        setMode("login");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-toca-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="bg-toca-card rounded-lg border border-toca-border shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {mode === "login" ? "Entrar" : mode === "register" ? "Criar Conta" : "Recuperar Senha"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(XX) XXXXX-XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-toca-background border-toca-border text-white"
              />
            </div>

            {mode !== "reset-password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={mode === "login" ? "Sua senha" : "Crie uma senha forte"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <Button
                  variant="link"
                  onClick={() => toggleMode("reset-password")}
                  className="text-toca-accent hover:text-toca-accent-hover p-0"
                  type="button"
                >
                  Esqueceu a senha?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              disabled={loading}
            >
              {loading 
                ? "Carregando..." 
                : mode === "login" 
                  ? "Entrar" 
                  : mode === "register" 
                    ? "Cadastrar" 
                    : "Enviar e-mail de recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-toca-text-secondary">
              {mode === "login"
                ? "Ainda não tem uma conta?"
                : mode === "register"
                  ? "Já possui uma conta?"
                  : "Lembrou sua senha?"}
              <Button
                variant="link"
                onClick={() => toggleMode(mode === "login" ? "register" : "login")}
                className="text-toca-accent hover:text-toca-accent-hover"
                type="button"
              >
                {mode === "login" ? "Cadastre-se" : "Faça login"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
