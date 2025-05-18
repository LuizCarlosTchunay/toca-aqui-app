
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar se o usuário está acessando esta página através de um link de redefinição de senha
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    
    // Se não estiver vindo de um link válido, redirecionar para a página de recuperação
    if (!accessToken && !refreshToken) {
      toast.error("Link inválido ou expirado");
      navigate("/recuperar-senha");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Senha atualizada com sucesso");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast.error(error.message || "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-toca-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="bg-toca-card rounded-lg border border-toca-border shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Redefinir Senha
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-toca-background border-toca-border text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-toca-background border-toca-border text-white"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-toca-text-secondary">
              Lembrou sua senha?
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="text-toca-accent hover:text-toca-accent-hover"
                type="button"
              >
                Faça login
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
