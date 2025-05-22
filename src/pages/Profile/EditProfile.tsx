
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { X, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PortfolioManager from "@/components/PortfolioManager";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [existingProfessionalId, setExistingProfessionalId] = useState<string | null>(null);
  const [otherType, setOtherType] = useState<string>("");
  const [loadedData, setLoadedData] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  
  // State for services management
  const [newService, setNewService] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  
  const [profileData, setProfileData] = useState({
    artisticName: "",
    profileType: "musico",
    bio: "",
    city: "",
    state: "",
    hourlyRate: "",
    eventRate: "",
  });
  
  // Use useCallback for fetchProfileData to prevent re-creation on every render
  const fetchProfileData = useCallback(async () => {
    if (!user) {
      console.log("No user found, redirecting to home");
      // Delay setting isNavigating to true until we're sure we need to navigate
      setTimeout(() => {
        toast.error("Você precisa estar logado para editar seu perfil");
        setIsNavigating(true);
        setTimeout(() => {
          navigate("/");
        }, 50);
      }, 0);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Fetching professional profile data for editing");
      // Get professional profile if exists
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching professional profile:", error);
        throw error;
      }
      
      if (data) {
        console.log("Found professional profile:", data.id);
        setExistingProfessionalId(data.id);
        
        // Check if the profile type is one of the predefined ones or custom
        const predefinedTypes = ["dj", "musico", "duo", "trio", "banda", "fotografo", "filmmaker", "tecnico_som", "tecnico_luz"];
        const isPredefined = predefinedTypes.includes(data.tipo_profissional?.toLowerCase() || "");
        
        // Load services from database
        setServices(data.servicos || data.instrumentos || []);
        
        // Update state with existing data
        setProfileData({
          artisticName: data.nome_artistico || "",
          profileType: isPredefined ? data.tipo_profissional || "musico" : "outro",
          bio: data.bio || "",
          city: data.cidade || "",
          state: data.estado || "",
          hourlyRate: data.cache_hora?.toString() || "",
          eventRate: data.cache_evento?.toString() || "",
        });
        
        if (!isPredefined && data.tipo_profissional) {
          setOtherType(data.tipo_profissional);
        }
        
        // Try to get profile image
        try {
          console.log("Fetching profile image");
          const { data: imageData } = supabase.storage
            .from('profile_images')
            .getPublicUrl(`professionals/${data.id}`);
          
          if (imageData?.publicUrl) {
            // Add cache busting
            const imageUrl = imageData.publicUrl + '?t=' + new Date().getTime();
            
            const checkImage = await fetch(imageData.publicUrl, { method: 'HEAD' })
              .then(res => res.ok)
              .catch(() => false);
              
            if (checkImage) {
              console.log("Profile image found");
              setProfileImageUrl(imageUrl);
            } else {
              console.log("Profile image not found or not accessible");
            }
          }
        } catch (imgError) {
          console.error("Error fetching profile image:", imgError);
          // Continue without image - don't throw
        }
      } else {
        console.log("No professional profile found, creating new");
      }
      
      // Mark that we've loaded data successfully
      setLoadedData(true);
    } catch (error: any) {
      console.error("Error loading profile data:", error);
      toast.error("Erro ao carregar dados do perfil: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Only fetch profile data once on component mount
    fetchProfileData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      setIsLoading(false);
      setIsSaving(false);
      setIsNavigating(false);
    };
  }, [fetchProfileData]);

  const handleChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };
  
  // Add a new service to the list
  const handleAddService = () => {
    if (!newService.trim()) return;
    
    if (!services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    } else {
      toast.error("Este serviço já foi adicionado");
    }
  };
  
  // Remove a service from the list
  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  // Navigation handler with safety checks
  const handleNavigate = (path: string) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    console.log(`Navigating to ${path}`);
    
    // Use requestAnimationFrame to ensure UI updates before navigation
    requestAnimationFrame(() => {
      setTimeout(() => {
        navigate(path, { replace: true });
      }, 50);
    });
  };
  
  // Memoize the submit handler to prevent recreating on every render
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para salvar seu perfil");
      return;
    }
    
    // Validation
    if (!profileData.artisticName) {
      toast.error("Nome artístico é obrigatório");
      return;
    }
    
    // Prevent multiple submissions
    if (isSaving || isNavigating) {
      console.log("Already saving or navigating, preventing duplicate submission");
      return;
    }
    
    setIsLoading(true);
    setIsSaving(true);
    
    try {
      console.log("Saving profile data");
      let professionalId = existingProfessionalId;
      let finalProfileType = profileData.profileType === "outro" ? otherType : profileData.profileType;
      
      const profileDataToSave = {
        nome_artistico: profileData.artisticName,
        tipo_profissional: finalProfileType,
        bio: profileData.bio,
        cidade: profileData.city,
        estado: profileData.state,
        cache_hora: profileData.hourlyRate ? parseFloat(profileData.hourlyRate) : null,
        cache_evento: profileData.eventRate ? parseFloat(profileData.eventRate) : null,
        servicos: services,
        user_id: user.id,
      };
      
      if (existingProfessionalId) {
        console.log("Updating existing profile:", existingProfessionalId);
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profissionais')
          .update(profileDataToSave)
          .eq('id', existingProfessionalId);
        
        if (updateError) throw updateError;
      } else {
        console.log("Creating new professional profile");
        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profissionais')
          .insert({
            ...profileDataToSave,
            user_id: user.id
          })
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        professionalId = newProfile?.id || null;
        
        if (!professionalId) {
          throw new Error("Falha ao obter o ID do perfil criado");
        }
        
        console.log("Created new profile:", professionalId);
        setExistingProfessionalId(professionalId);
        
        // Update user to have professional profile
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
        
        if (userUpdateError) throw userUpdateError;
      }
      
      // Upload profile image if provided
      if (profileImage && professionalId) {
        try {
          console.log("Uploading profile image");
          
          const fileName = `professionals/${professionalId}`;
          
          const { error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(fileName, profileImage, {
              upsert: true,
              contentType: profileImage.type
            });
          
          if (uploadError) throw uploadError;
          console.log("Profile image uploaded successfully");
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          // Continue even if image upload fails
          toast.error("Erro ao fazer upload da imagem, mas o perfil foi salvo");
        }
      }
      
      console.log("Profile saved successfully");
      toast.success("Perfil atualizado com sucesso!");
      
      // Set profile saved flag to true
      setProfileSaved(true);
      
      // NO NAVIGATION - Just update the state
      setIsLoading(false);
      setIsSaving(false);
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar o perfil: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  const handleImageChange = (imageFile: File, imageUrl?: string) => {
    console.log("Profile image selected");
    setProfileImage(imageFile);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!user && loadedData) {
      console.log("No authenticated user found, redirecting to login");
      toast.error("Você precisa estar logado para acessar esta página");
      
      // Use requestAnimationFrame to ensure UI updates before navigation
      requestAnimationFrame(() => {
        setIsNavigating(true);
        setTimeout(() => {
          navigate("/login");
        }, 50);
      });
    }
  }, [user, navigate, loadedData]);

  // Update the portfolio manager reference when profile is saved
  useEffect(() => {
    if (profileSaved && existingProfessionalId) {
      // Refresh the component to show portfolio manager
      setProfileSaved(false);
    }
  }, [profileSaved, existingProfessionalId]);

  if (isLoading && !loadedData) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-toca-text-secondary">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} currentRole="profissional" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Editar Perfil Profissional</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <ImageUploader 
                  currentImage={profileImageUrl}
                  onImageChange={handleImageChange}
                  size="lg"
                  bucketName="profile_images"
                  objectPath={existingProfessionalId ? `professionals/${existingProfessionalId}` : undefined}
                />
              </div>
              
              {/* Basic profile fields */}
              <div className="space-y-2">
                <Label htmlFor="artisticName" className="text-white">Nome Artístico</Label>
                <Input 
                  id="artisticName" 
                  value={profileData.artisticName}
                  onChange={(e) => handleChange('artisticName', e.target.value)}
                  className="bg-toca-background border-toca-border text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileType" className="text-white">Tipo de Profissional</Label>
                <Select 
                  value={profileData.profileType}
                  onValueChange={(value) => handleChange('profileType', value)}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-toca-background border-toca-border text-white z-50">
                    <SelectItem value="musico">Músico</SelectItem>
                    <SelectItem value="dj">DJ</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="trio">Trio</SelectItem>
                    <SelectItem value="banda">Banda</SelectItem>
                    <SelectItem value="fotografo">Fotógrafo</SelectItem>
                    <SelectItem value="filmmaker">Filmmaker</SelectItem>
                    <SelectItem value="tecnico_som">Técnico de Som</SelectItem>
                    <SelectItem value="tecnico_luz">Técnico de Luz</SelectItem>
                    <SelectItem value="outro">Outro (especifique)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {profileData.profileType === "outro" && (
                <div className="space-y-2">
                  <Label htmlFor="otherType" className="text-white">Especifique o tipo</Label>
                  <Input 
                    id="otherType" 
                    value={otherType}
                    onChange={(e) => setOtherType(e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                    placeholder="Insira seu tipo de profissão"
                    required={profileData.profileType === "outro"}
                  />
                </div>
              )}
              
              {/* Services Management Section */}
              <div className="space-y-4">
                <Label htmlFor="services" className="text-white text-lg">Serviços Oferecidos</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-toca-background rounded-md border border-toca-border">
                  {services.length > 0 ? (
                    services.map((service, index) => (
                      <Badge 
                        key={index} 
                        className="bg-toca-accent/20 hover:bg-toca-accent/30 text-white flex items-center gap-1"
                      >
                        {service}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveService(service)}
                          className="ml-1 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-toca-text-secondary text-sm">Nenhum serviço adicionado ainda. Adicione seus serviços abaixo.</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    id="newService" 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Ex: DJ para festas, Música para casamentos..."
                    className="bg-toca-background border-toca-border text-white flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddService}
                    className="bg-toca-accent hover:bg-toca-accent-hover"
                  >
                    <Plus size={16} className="mr-1" /> Adicionar
                  </Button>
                </div>
                <p className="text-xs text-toca-text-secondary">
                  Pressione Enter ou clique em Adicionar para incluir um serviço. Estes serviços ficarão visíveis no seu perfil.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Biografia</Label>
                <Textarea 
                  id="bio" 
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="bg-toca-background border-toca-border text-white min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">Cidade</Label>
                  <Input 
                    id="city" 
                    value={profileData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">Estado</Label>
                  <Input 
                    id="state" 
                    value={profileData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-white">Cachê por Hora (R$)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    value={profileData.hourlyRate}
                    onChange={(e) => handleChange('hourlyRate', e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventRate" className="text-white">Cachê por Evento (R$)</Label>
                  <Input 
                    id="eventRate" 
                    type="number" 
                    value={profileData.eventRate}
                    onChange={(e) => handleChange('eventRate', e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleNavigate("/dashboard")}
                  className="border-toca-border text-white"
                  disabled={isLoading || isSaving || isNavigating}
                >
                  {isNavigating ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde...
                    </span>
                  ) : "Cancelar"}
                </Button>
                <Button 
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  disabled={isLoading || isSaving || isNavigating}
                >
                  {(isLoading || isSaving) ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Portfolio Manager - only show once we have a professional ID */}
        {existingProfessionalId && (
          <div className="mt-8">
            <PortfolioManager 
              professionalId={existingProfessionalId} 
              onUpdate={() => {
                // Optional callback when portfolio is updated
                toast.success("Portfólio atualizado!");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
