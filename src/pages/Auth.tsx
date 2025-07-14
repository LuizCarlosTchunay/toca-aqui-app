import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

type AuthMode = 'login' | 'register' | 'reset-password';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get('mode') as AuthMode) || 'login'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        navigate('/dashboard');
      } else if (mode === 'register') {
        await signUp(formData.email, formData.password, formData.name, formData.phone);
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

  return (
    <div className="min-h-screen bg-toca-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-toca-text-primary">
            Toca<span className="text-toca-accent">Aqui</span>
          </h1>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h2 className="text-2xl font-bold text-toca-text-primary text-center mb-6">
            {getTitle()}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-toca-text-primary mb-1">
                    Nome completo
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Digite seu nome completo"
                    className="bg-toca-card border-toca-border text-toca-input"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-toca-text-primary mb-1">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="(XX) XXXXX-XXXX"
                    className="bg-toca-card border-toca-border text-toca-input"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-toca-text-primary mb-1">
                E-mail
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="seu@email.com"
                className="bg-toca-card border-toca-border text-toca-input"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {mode !== 'reset-password' && (
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder={mode === 'login' ? 'Sua senha' : 'Crie uma senha forte'}
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Confirmar senha
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirme sua senha"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode('reset-password')}
                className="w-full text-toca-text-secondary hover:text-toca-accent"
              >
                Esqueceu a senha?
              </Button>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-toca-accent hover:bg-toca-accent-hover text-white"
            >
              {loading ? 'Carregando...' : 
                mode === 'login' ? 'Entrar' :
                mode === 'register' ? 'Cadastrar' :
                'Enviar e-mail de recuperação'
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-toca-text-secondary mb-2">
              {mode === 'login'
                ? 'Ainda não tem uma conta?'
                : mode === 'register'
                ? 'Já possui uma conta?'
                : 'Lembrou sua senha?'}
            </p>
            <Button
              variant="outline"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
            >
              {mode === 'login'
                ? 'Cadastre-se'
                : mode === 'register'
                ? 'Faça login'
                : 'Voltar ao login'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;