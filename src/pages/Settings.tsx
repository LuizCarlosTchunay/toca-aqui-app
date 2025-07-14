import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, signOut } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    locationServices: false,
    darkMode: true,
    autoBackup: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSignOut = () => {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
      signOut();
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente. Tem certeza?')) {
      alert('Funcionalidade em desenvolvimento');
    }
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
    <div
      className={`flex items-center justify-between p-4 border-b border-toca-border last:border-b-0 ${
        type === 'button' ? 'cursor-pointer hover:bg-toca-background' : ''
      }`}
      onClick={type === 'button' ? onPress : undefined}
    >
      <div className="flex-1">
        <h3 className="text-toca-text-primary font-medium">{title}</h3>
        {description && (
          <p className="text-toca-text-secondary text-sm mt-1">{description}</p>
        )}
      </div>
      {type === 'switch' && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onValueChange?.(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-toca-accent"></div>
        </label>
      )}
      {type === 'button' && (
        <span className="text-toca-text-secondary text-xl">›</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-toca-text-primary">Configurações</h1>

        {/* Profile Card */}
        <Card className="p-6 bg-toca-card border-toca-border text-center">
          <h2 className="text-lg font-bold text-toca-text-primary mb-2">
            {user?.user_metadata?.nome || 'Usuário'}
          </h2>
          <p className="text-toca-text-secondary">{user?.email}</p>
        </Card>

        {/* Account Section */}
        <div>
          <h3 className="text-lg font-bold text-toca-text-primary mb-4">Conta</h3>
          <Card className="bg-toca-card border-toca-border">
            <SettingItem
              title="Editar Perfil"
              description="Altere suas informações pessoais"
              type="button"
              onPress={() => window.location.href = '/edit-profile'}
            />
            <SettingItem
              title="Alterar Senha"
              description="Modifique sua senha de acesso"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Privacidade"
              description="Gerencie suas configurações de privacidade"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
          </Card>
        </div>

        {/* Notifications Section */}
        <div>
          <h3 className="text-lg font-bold text-toca-text-primary mb-4">Notificações</h3>
          <Card className="bg-toca-card border-toca-border">
            <SettingItem
              title="Notificações"
              description="Receber notificações do app"
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
            />
            <SettingItem
              title="Notificações por Email"
              description="Receber emails sobre atividades importantes"
              value={settings.emailNotifications}
              onValueChange={(value) => handleSettingChange('emailNotifications', value)}
            />
            <SettingItem
              title="Notificações Push"
              description="Receber notificações push no dispositivo"
              value={settings.pushNotifications}
              onValueChange={(value) => handleSettingChange('pushNotifications', value)}
            />
          </Card>
        </div>

        {/* App Settings Section */}
        <div>
          <h3 className="text-lg font-bold text-toca-text-primary mb-4">Aplicativo</h3>
          <Card className="bg-toca-card border-toca-border">
            <SettingItem
              title="Serviços de Localização"
              description="Permitir acesso à localização para eventos próximos"
              value={settings.locationServices}
              onValueChange={(value) => handleSettingChange('locationServices', value)}
            />
            <SettingItem
              title="Modo Escuro"
              description="Interface com tema escuro"
              value={settings.darkMode}
              onValueChange={(value) => handleSettingChange('darkMode', value)}
            />
            <SettingItem
              title="Backup Automático"
              description="Fazer backup automático dos dados"
              value={settings.autoBackup}
              onValueChange={(value) => handleSettingChange('autoBackup', value)}
            />
          </Card>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-bold text-toca-text-primary mb-4">Suporte</h3>
          <Card className="bg-toca-card border-toca-border">
            <SettingItem
              title="Central de Ajuda"
              description="Encontre respostas para suas dúvidas"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Fale Conosco"
              description="Entre em contato com nossa equipe"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Avaliar App"
              description="Deixe sua avaliação na loja"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
            <SettingItem
              title="Termos de Uso"
              description="Leia nossos termos e condições"
              type="button"
              onPress={() => alert('Funcionalidade em desenvolvimento')}
            />
          </Card>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-lg font-bold text-toca-text-primary mb-4">Zona de Perigo</h3>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
            >
              Sair da Conta
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Excluir Conta
            </Button>
          </div>
        </div>

        <p className="text-center text-toca-text-secondary text-sm">
          Toca Aqui v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;