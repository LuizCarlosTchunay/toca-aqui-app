import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Edit, Star, Calendar, Clock, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";
import PortfolioManager from "@/components/PortfolioManager";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfessional, setIsProfessional] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  // Fetch professional data if the user is a professional
  const { data: professional, isLoading, refetch } = useQuery({
    queryKey: ['my-professional-profile', user?.id, refreshKey],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        console.log("Fetching professional profile data");
        // First check if user has a professional profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('tem_perfil_profissional')
          .eq('id', user.id)
          .maybeSingle();
  
        if (userError) {
          console.error("Error fetching user data:", userError);
          throw userError;
        }
        
        if (!userData?.tem_perfil_profissional) {
          console.log("User does not have a professional profile");
          setIsProfessional(false);
          return null;
        }
  
        setIsProfessional(true);
        console.log("User is a professional, fetching profile");
  
        // Fetch professional profile
        const { data: profData, error: profError } = await supabase
          .from('profissionais')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
  
        if (profError) {
          console.error("Error fetching professional data:", profError);
          throw profError;
        }
        
        if (!profData) {
          console.log("No professional data found");
          return null;
        }

        console.log("Professional data fetched successfully:", profData.id);
  
        // Try to get the profile image
        try {
          console.log("Fetching profile image");
          const { data: imageData } = await supabase.storage
            .from('profile_images')
            .getPublicUrl(`professionals/${profData.id}`);
            
          if (imageData?.publicUrl) {
            // Add cache busting parameter
            const imageUrl = `${imageData.publicUrl}?t=${new Date().getTime()}`;
            
            // Check if image exists by making a head request
            const imgExists = await fetch(imageData.publicUrl, { method: 'HEAD' })
              .then(res => res.ok)
              .catch(() => false);
              
            if (imgExists) {
              console.log("Profile image found");
              setProfileImage(imageUrl);
            } else {
              console.log("Profile image not found or not accessible");
            }
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
          // Continue without image - don't throw
        }
  
        return profData;
      } catch (error) {
        console.error("Error in professional profile query:", error);
        // Don't throw the error to prevent React Query from retrying indefinitely
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 10000, // 10 seconds
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Refresh data after any update
  const refreshProfileData = () => {
    console.log("Refreshing profile data");
    setRefreshKey(prev => prev + 1);
    
    // Use a timeout to ensure the refetch happens after state update
    setTimeout(() => {
      refetch().catch(error => {
        console.error("Error refetching profile data:", error);
      });
    }, 100);
  };

  // Handle safe navigation
  const handleEditProfileClick = () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    console.log("Navigating to edit profile");
    
    // Use setTimeout to ensure the UI stays responsive
    setTimeout(() => {
      navigate('/editar-perfil');
    }, 50);
  };

  // Redirect to create professional profile if user is not a professional
  useEffect(() => {
    if (!user) return; // Wait for auth to complete
    
    if (!isLoading && !professional && !isProfessional) {
      console.log("User is not a professional, redirecting to edit profile");
      // Use safer navigation approach
      setIsNavigating(true);
      setTimeout(() => {
        navigate('/editar-perfil');
      }, 50);
    }
  }, [user, professional, isLoading, navigate, isProfessional]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!professional?.id) {
      toast.error("Você precisa ter um perfil profissional para fazer upload de imagem.");
      return;
    }

    try {
      console.log("Uploading profile image");
      
      const { error } = await supabase.storage
        .from('profile_images')
        .upload(`professionals/${professional.id}`, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      // Update the profile image URL with cache busting
      const { data } = await supabase.storage
        .from('profile_images')
        .getPublicUrl(`professionals/${professional.id}`);

      if (data?.publicUrl) {
        const imageUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
        setProfileImage(imageUrl);
        
        toast.success("Imagem de perfil atualizada com sucesso!");
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ['my-professional-profile']
        });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload: " + (error.message || "Ocorreu um erro ao fazer upload da imagem."));
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      toast.error("Você precisa estar logado para acessar esta página");
      
      // Use safer navigation
      setIsNavigating(true);
      setTimeout(() => {
        navigate("/login");
      }, 50);
    }
  }, [user, isLoading, navigate]);

  // Clean up function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or references
      queryClient.cancelQueries({
        queryKey: ['my-professional-profile']
      });
    };
  }, [queryClient]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-toca-accent" />
          </div>
          <p className="text-center text-toca-text-secondary">Carregando perfil...</p>
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
                        onLoad={() => setIsImgLoaded(true)}
                        onError={() => setIsImgLoaded(false)}
                      />
                      <AvatarFallback className="text-4xl font-bold text-toca-accent bg-toca-accent/20">
                        {initials || "MP"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                      <ImageUploader onImageChange={handleImageUpload}>
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
                    onClick={handleEditProfileClick}
                    disabled={isNavigating}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {isNavigating ? "Carregando..." : "Editar Perfil"}
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
            
            {professional?.servicos?.length > 0 && (
              <Card className="bg-toca-card border-toca-border shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.servicos.map((service, index) => (
                      <Badge key={index} className="bg-toca-background border-toca-border text-white">
                        {service}
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
                          onClick={handleEditProfileClick}
                          disabled={isNavigating}
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
                  <PortfolioManager 
                    professionalId={professional.id} 
                    onUpdate={refreshProfileData} 
                  />
                ) : (
                  <Card className="bg-toca-card border-toca-border shadow-md">
                    <CardContent className="py-12">
                      <div className="text-center text-toca-text-secondary">
                        <p>Você precisa completar seu perfil profissional antes de adicionar itens ao portfólio.</p>
                        <Button 
                          variant="default" 
                          className="mt-4 bg-toca-accent hover:bg-toca-accent-hover"
                          onClick={handleEditProfileClick}
                          disabled={isNavigating}
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
