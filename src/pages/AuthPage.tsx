
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthMode = "login" | "register";

const AuthPage: React.FC<{ initialMode?: AuthMode }> = ({
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    // Mock authentication success
    toast.success(mode === "login" ? "Login realizado com sucesso" : "Cadastro realizado com sucesso");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-toca-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="bg-toca-card rounded-lg border border-toca-border shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {mode === "login" ? "Entrar" : "Criar Conta"}
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

            <Button
              type="submit"
              className="w-full bg-toca-accent hover:bg-toca-accent-hover"
            >
              {mode === "login" ? "Entrar" : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-toca-text-secondary">
              {mode === "login"
                ? "Ainda não tem uma conta?"
                : "Já possui uma conta?"}
              <Button
                variant="link"
                onClick={toggleMode}
                className="text-toca-accent hover:text-toca-accent-hover"
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
