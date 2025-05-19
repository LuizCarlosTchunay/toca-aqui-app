
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Mail, Phone, Calendar, UserPlus, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProfessional, setIsProfessional] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Usuário",
    email: "",
    phone: "",
    createdAt: "",
    city: "",
    state: "",
    bio: "",
    image: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (userError) throw userError;
        
        if (userData) {
          setIsProfessional(userData.tem_perfil_profissional || false);
          
          // Format created date
          const createdDate = new Date(userData.data_cadastro || Date.now());
          const month = createdDate.toLocaleString('pt-BR', { month: 'long' });
          const year = createdDate.getFullYear();
          
          setUserData(prev => ({
            ...prev,
            name: userData.nome || "Usuário",
            email: userData.email || "",
            phone: userData.telefone || "",
            createdAt: `${month} ${year}`,
          }));
          
          // Check if user has a professional profile
          if (userData.tem_perfil_profissional) {
            const { data: profData, error: profError } = await supabase
              .from('profissionais')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (profError) throw profError;
            
            if (profData) {
              setUserData(prev => ({
                ...prev,
                city: profData.cidade || "",
                state: profData.estado || "",
                bio: profData.bio || "Sem biografia",
              }));
              
              // Try to get profile image
              try {
                const { data } = supabase.storage
                  .from('profile_images')
                  .getPublicUrl(`${profData.id}`);
                
                if (data?.publicUrl) {
                  setUserData(prev => ({
                    ...prev,
                    image: data.publicUrl
                  }));
                }
              } catch (imgError) {
                console.error("Error fetching profile image:", imgError);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleBecomeProfessional = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para se tornar um profissional");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update user status
      const { error } = await supabase
        .from('users')
        .update({ tem_perfil_profissional: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsProfessional(true);
      toast.success("Parabéns! Agora você é um profissional. Complete seu perfil para aparecer na aba Explorar.");
      navigate("/editar-perfil");
    } catch (error) {
      console.error("Error updating professional status:", error);
      toast.error("Erro ao atualizar status de profissional");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageChange = (imageFile: File) => {
    setProfileImage(imageFile);
    setImagePreview(URL.createObjectURL(imageFile));
  };
  
  const handleSavePhoto = async () => {
    if (!profileImage || !user) {
      toast.error("Selecione uma imagem para continuar");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get professional id
      const { data: profData, error: profError } = await supabase
        .from('profissionais')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profError) throw profError;
      
      if (!profData) {
        throw new Error("Perfil profissional não encontrado");
      }
      
      // Upload image
      const fileExt = profileImage.name.split('.').pop();
      const fileName = `${profData.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(fileName, profileImage, {
          upsert: true,
          contentType: profileImage.type
        });
      
      if (uploadError) throw uploadError;
      
      toast.success("Foto de perfil atualizada com sucesso!");
      setShowPhotoDialog(false);
      
      // Update local state with new image
      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        setUserData(prev => ({
          ...prev,
          image: data.publicUrl
        }));
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Erro ao atualizar foto de perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6 bg-black text-toca-accent hover:bg-gray-800"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="w-32 h-32 border-2 border-toca-accent">
                      <AvatarImage src={imagePreview || userData.image} />
                      <AvatarFallback className="text-4xl bg-toca-accent/20 text-toca-accent">
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full border-toca-accent bg-toca-card text-toca-accent hover:bg-toca-accent hover:text-white"
                      onClick={() => setShowPhotoDialog(true)}
                    >
                      <Camera size={16} />
                    </Button>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">{userData.name}</h1>
                  {(userData.city || userData.state) && (
                    <div className="flex items-center text-toca-text-secondary mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{userData.city}, {userData.state}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover mb-3"
                    onClick={() => navigate("/editar-perfil")}
                    disabled={isLoading}
                  >
                    Editar Perfil
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full bg-black text-white hover:bg-gray-800 mb-3"
                    onClick={() => navigate("/configuracoes")}
                    disabled={isLoading}
                  >
                    Configurações
                  </Button>

                  {!isProfessional && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full bg-toca-background border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                          disabled={isLoading}
                        >
                          <UserPlus size={16} className="mr-2" /> Tornar-se Profissional
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-toca-card border-toca-border text-white">
                        <DialogHeader>
                          <DialogTitle className="text-toca-accent">Tornar-se um Profissional</DialogTitle>
                          <DialogDescription className="text-toca-text-secondary">
                            Como profissional, você poderá oferecer seus serviços, candidatar-se a eventos e aparecer na aba Explorar.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 text-toca-text-primary">
                          <p className="mb-2">Ao se tornar um profissional, você precisará:</p>
                          <ul className="list-disc pl-5 space-y-1 text-toca-text-secondary">
                            <li>Completar seu perfil profissional</li>
                            <li>Adicionar seus serviços e preços</li>
                            <li>Enviar documentos para verificação</li>
                          </ul>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleBecomeProfessional} 
                            className="bg-toca-accent hover:bg-toca-accent-hover"
                            disabled={isLoading}
                          >
                            {isLoading ? "Processando..." : "Continuar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {isProfessional && (
                    <Button 
                      variant="outline" 
                      className="w-full bg-toca-background border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                      onClick={() => navigate("/perfil-profissional")}
                      disabled={isLoading}
                    >
                      Ver Perfil Profissional
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Email</div>
                  <div className="flex items-center text-white">
                    <Mail size={16} className="mr-2 text-toca-text-secondary" />
                    {userData.email || "Não informado"}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Telefone</div>
                  <div className="flex items-center text-white">
                    <Phone size={16} className="mr-2 text-toca-text-secondary" />
                    {userData.phone || "Não informado"}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Membro desde</div>
                  <div className="flex items-center text-white">
                    <Calendar size={16} className="mr-2 text-toca-text-secondary" />
                    {userData.createdAt || "Recentemente"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-toca-text-primary">{userData.bio || "Adicione uma biografia ao editar seu perfil profissional."}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="p-3 text-center text-toca-text-secondary">Carregando atividades...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 border border-toca-border rounded-md">
                      <h4 className="font-medium text-white">Evento criado</h4>
                      <div className="text-xs text-toca-text-secondary mb-1">Festival de Verão</div>
                      <div className="text-sm text-toca-text-primary">15/01/2025</div>
                    </div>
                    
                    <div className="p-3 border border-toca-border rounded-md">
                      <h4 className="font-medium text-white">Profissional contratado</h4>
                      <div className="text-xs text-toca-text-secondary mb-1">DJ Pulse</div>
                      <div className="text-sm text-toca-text-primary">10/01/2025</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Photo Change Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="bg-toca-card border-toca-border text-white">
          <DialogHeader>
            <DialogTitle className="text-toca-accent">Alterar Foto de Perfil</DialogTitle>
            <DialogDescription className="text-toca-text-secondary">
              Selecione uma nova foto para o seu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ImageUploader
              currentImage={userData.image}
              onImageChange={handleImageChange}
              size="lg"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              className="border-toca-border text-white"
              onClick={() => setShowPhotoDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-toca-accent hover:bg-toca-accent-hover"
              onClick={handleSavePhoto}
              disabled={isLoading || !profileImage}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProfile;
