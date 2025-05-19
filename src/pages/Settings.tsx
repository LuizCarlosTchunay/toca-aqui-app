
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema definition for profile form
const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres"),
});

// Schema definition for password form
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingNotifications: true,
    paymentNotifications: true,
    marketingNotifications: false,
  });

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user details
        const { data, error } = await supabase
          .from('users')
          .select('nome, email, telefone')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          profileForm.reset({
            name: data.nome || "",
            email: data.email || "",
            phone: data.telefone || "",
          });
        }

        // Fetch notification settings if they exist
        const { data: notifData, error: notifError } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (notifError && notifError.code !== 'PGRST116') {
          throw notifError;
        }
        
        if (notifData && notifData.settings) {
          setNotificationSettings({
            emailNotifications: notifData.settings.emailNotifications ?? true,
            bookingNotifications: notifData.settings.bookingNotifications ?? true,
            paymentNotifications: notifData.settings.paymentNotifications ?? true,
            marketingNotifications: notifData.settings.marketingNotifications ?? false,
          });
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast.error("Erro ao carregar dados: " + (error.message || "Tente novamente"));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && !loading) {
      loadUserData();
    }
  }, [user, loading]);

  // Handle profile form submission
  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    if (!user) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update profile data in database
      const { error } = await supabase
        .from('users')
        .update({
          nome: data.name,
          email: data.email,
          telefone: data.phone,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password form submission
  const handleSavePassword = async (data: z.infer<typeof passwordSchema>) => {
    if (!user) {
      toast.error("Você precisa estar logado para atualizar sua senha");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update user password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      // Reset form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast.success("Senha atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast.error("Erro ao atualizar senha: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle notification form submission
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para atualizar suas preferências");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if settings already exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('user_settings')
          .update({
            settings: notificationSettings,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            settings: notificationSettings,
          });
        
        if (error) throw error;
      }
      
      toast.success("Preferências de notificação atualizadas!");
    } catch (error: any) {
      console.error("Erro ao atualizar notificações:", error);
      toast.error("Erro ao atualizar preferências: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <FormControl>
                            <Input 
                              id="name"
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <FormControl>
                            <Input 
                              id="email"
                              type="email" 
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <FormControl>
                            <Input 
                              id="phone"
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-toca-accent hover:bg-toca-accent-hover"
                        disabled={isLoading}
                      >
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handleSavePassword)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="current-password">Senha Atual</Label>
                          <FormControl>
                            <Input 
                              id="current-password"
                              type="password"
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <FormControl>
                            <Input 
                              id="new-password"
                              type="password"
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                          <FormControl>
                            <Input 
                              id="confirm-password"
                              type="password"
                              {...field}
                              className="bg-toca-background border-toca-border text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-toca-accent hover:bg-toca-accent-hover"
                        disabled={isLoading}
                      >
                        {isLoading ? "Atualizando..." : "Atualizar Senha"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por e-mail</Label>
                        <p className="text-sm text-toca-text-secondary">Receber notificações por e-mail</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          emailNotifications: checked
                        }))}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações de reservas</Label>
                        <p className="text-sm text-toca-text-secondary">Avisos sobre novas reservas ou alterações</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.bookingNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          bookingNotifications: checked
                        }))}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações de pagamentos</Label>
                        <p className="text-sm text-toca-text-secondary">Avisos sobre pagamentos recebidos ou pendentes</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.paymentNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          paymentNotifications: checked
                        }))}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações de marketing</Label>
                        <p className="text-sm text-toca-text-secondary">Receber novidades e promoções</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.marketingNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          marketingNotifications: checked
                        }))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-toca-accent hover:bg-toca-accent-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvando..." : "Salvar Preferências"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
