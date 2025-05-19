
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Edit, Star, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ImageUploader from "@/components/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import PortfolioManager from "@/components/PortfolioManager";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfessional, setIsProfessional] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Fetch professional data if the user is a professional
  const { data: professional, isLoading } = useQuery({
    queryKey: ['my-professional-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // First check if user has a professional profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tem_perfil_profissional')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) throw userError;
      
      if (!userData?.tem_perfil_profissional) {
        setIsProfessional(false);
        return null;
      }

      setIsProfessional(true);

      // Fetch professional profile
      const { data: profData, error: profError } = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profError) throw profError;
      if (!profData) return null;

      // Try to get the profile image
      try {
        const { data: imageData } = await supabase.storage
          .from('profile_images')
          .getPublicUrl(`professionals/${profData.id}`);
          
        if (imageData?.publicUrl) {
          // Check if image exists by making a head request
          const imgExists = await fetch(imageData.publicUrl, { method: 'HEAD' })
            .then(res => res.ok)
            .catch(() => false);
            
          if (imgExists) {
            setProfileImage(imageData.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }

      return profData;
    },
    enabled: !!user?.id,
  });

  // Redirect to create professional profile if user is not a professional
  useEffect(() => {
    if (user && !isLoading && !professional && !isProfessional) {
      navigate('/editar-perfil');
    }
  }, [user, professional, isLoading, navigate, isProfessional]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!professional?.id) {
      toast({
        title: "Erro",
        description: "Você precisa ter um perfil profissional para fazer upload de imagem.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('profile_images')
        .upload(`professionals/${professional.id}`, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      // Update the profile image URL
      const { data } = await supabase.storage
        .from('profile_images')
        .getPublicUrl(`professionals/${professional.id}`);

      if (data?.publicUrl) {
        setProfileImage(data.publicUrl);
        
        toast({
          title: "Sucesso",
          description: "Imagem de perfil atualizada com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao fazer upload da imagem.",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = (professional?.nome_artistico || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile sidebar */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-toca-card border-toca-border shadow-md mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="w-32 h-32 border-4 border-toca-accent">
                      <AvatarImage 
                        src={profileImage || ""}
                        alt={professional?.nome_artistico || "Profile"}
                      />
                      <AvatarFallback className="text-4xl font-bold text-toca-accent bg-toca-accent/20">
                        {initials || "MP"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                      <ImageUploader onImageUpload={handleImageUpload}>
                        <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
                          <Edit className="h-5 w-5 text-white" />
                        </Button>
                      </ImageUploader>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {professional?.nome_artistico || "Meu Perfil"}
                  </h1>
                  
                  {professional?.tipo_profissional && (
                    <Badge className="mb-3 bg-toca-accent text-white border-none">
                      {professional.tipo_profissional}
                    </Badge>
                  )}
                  
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="text-white font-medium mr-1">4.5</span>
                    <span className="text-toca-text-secondary">(0 avaliações)</span>
                  </div>
                  
                  {(professional?.cidade || professional?.estado) && (
                    <div className="flex items-center text-toca-text-secondary mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>
                        {[professional.cidade, professional.estado]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Clock size={14} className="inline mr-1" /> Por hora
                      </div>
                      <div className="font-semibold text-toca-accent">
                        {formatCurrency(professional?.cache_hora || 0)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Calendar size={14} className="inline mr-1" /> Por evento
                      </div>
                      <div className="font-semibold text-toca-accent">
                        {formatCurrency(professional?.cache_evento || 0)}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                    onClick={() => navigate('/editar-perfil')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {professional?.instrumentos?.length > 0 && (
              <Card className="bg-toca-card border-toca-border shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.instrumentos.map((instrumento, index) => (
                      <Badge key={index} className="bg-toca-background border-toca-border text-white">
                        {instrumento}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {professional?.subgeneros?.length > 0 && (
              <Card className="bg-toca-card border-toca-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Gêneros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.subgeneros.map((genero, index) => (
                      <Badge key={index} className="bg-toca-background border-toca-border text-white">
                        {genero}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main content */}
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-toca-card border-toca-border mb-6 w-full">
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 data-[state=active]:bg-toca-accent data-[state=active]:text-white"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio" 
                  className="flex-1 data-[state=active]:bg-toca-accent data-[state=active]:text-white"
                >
                  Portfólio
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-toca-card border-toca-border shadow-md">
                  <CardHeader>
                    <CardTitle>Sobre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {professional?.bio ? (
                      <p className="text-toca-text-primary whitespace-pre-line">
                        {professional.bio}
                      </p>
                    ) : (
                      <div className="text-center py-8 text-toca-text-secondary">
                        <p>Você ainda não adicionou uma descrição ao seu perfil.</p>
                        <Button 
                          variant="link" 
                          className="text-toca-accent mt-2"
                          onClick={() => navigate('/editar-perfil')}
                        >
                          Adicionar Bio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio">
                {professional?.id ? (
                  <PortfolioManager professionalId={professional.id} />
                ) : (
                  <Card className="bg-toca-card border-toca-border shadow-md">
                    <CardContent className="py-12">
                      <div className="text-center text-toca-text-secondary">
                        <p>Você precisa completar seu perfil profissional antes de adicionar itens ao portfólio.</p>
                        <Button 
                          variant="default" 
                          className="mt-4 bg-toca-accent hover:bg-toca-accent-hover"
                          onClick={() => navigate('/editar-perfil')}
                        >
                          Completar Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
