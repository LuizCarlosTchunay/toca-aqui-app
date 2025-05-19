
import React, { useState, useEffect } from "react";
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
import { Instagram, Youtube } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfessionalId, setExistingProfessionalId] = useState<string | null>(null);
  const [otherType, setOtherType] = useState<string>("");
  const [profileData, setProfileData] = useState({
    artisticName: "",
    profileType: "dj",
    bio: "",
    city: "",
    state: "",
    hourlyRate: "",
    eventRate: "",
    instagramUrl: "", // New field for Instagram URL
    youtubeUrl: "",   // New field for YouTube URL
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        toast.error("Você precisa estar logado para editar seu perfil");
        navigate("/");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get professional profile if exists
        const { data, error } = await supabase
          .from('profissionais')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setExistingProfessionalId(data.id);
          
          // Check if the profile type is one of the predefined ones or custom
          const predefinedTypes = ["dj", "musico", "baterista", "guitarrista", "baixista", "voz e violão", "duo", "trio", "banda", "fotografo", "filmmaker", "tecnico_som", "tecnico_luz"];
          const isPredefined = predefinedTypes.includes(data.tipo_profissional?.toLowerCase() || "");
          
          // Update state with existing data
          setProfileData({
            artisticName: data.nome_artistico || "",
            profileType: isPredefined ? data.tipo_profissional || "dj" : "outro",
            bio: data.bio || "",
            city: data.cidade || "",
            state: data.estado || "",
            hourlyRate: data.cache_hora?.toString() || "",
            eventRate: data.cache_evento?.toString() || "",
            instagramUrl: data.instagram_url || "", // Load Instagram URL
            youtubeUrl: data.youtube_url || "",     // Load YouTube URL
          });
          
          if (!isPredefined && data.tipo_profissional) {
            setOtherType(data.tipo_profissional);
          }
          
          // Try to get profile image
          try {
            const { data: imageData } = supabase.storage
              .from('profile_images')
              .getPublicUrl(`professionals/${data.id}`);
            
            if (imageData?.publicUrl) {
              const checkImage = await fetch(imageData.publicUrl, { method: 'HEAD' })
                .then(res => res.ok)
                .catch(() => false);
                
              if (checkImage) {
                setProfileImageUrl(imageData.publicUrl);
              }
            }
          } catch (imgError) {
            console.error("Error fetching profile image:", imgError);
          }
        }
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast.error("Erro ao carregar dados do perfil: " + (error.message || "Tente novamente"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };
  
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
    
    setIsLoading(true);
    
    try {
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
        instagram_url: profileData.instagramUrl, // Save Instagram URL
        youtube_url: profileData.youtubeUrl     // Save YouTube URL
      };
      
      if (existingProfessionalId) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profissionais')
          .update(profileDataToSave)
          .eq('id', existingProfessionalId);
        
        if (updateError) throw updateError;
      } else {
        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profissionais')
          .insert({
            user_id: user.id,
            ...profileDataToSave
          })
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        professionalId = newProfile?.id || null;
        
        // Update user to have professional profile
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
        
        if (userUpdateError) throw userUpdateError;
      }
      
      // Upload profile image if provided
      if (profileImage && professionalId) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `professionals/${professionalId}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile_images')
          .upload(fileName, profileImage, {
            upsert: true,
            contentType: profileImage.type
          });
        
        if (uploadError) throw uploadError;
      }
      
      toast.success("Perfil atualizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar o perfil: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (imageFile: File, imageUrl?: string) => {
    setProfileImage(imageFile);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  // Simple URL validator function
  const isValidUrl = (url: string) => {
    if (!url) return true; // Empty URLs are valid (optional)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

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
                  <SelectContent>
                    <SelectItem value="dj">DJ</SelectItem>
                    <SelectItem value="musico">Músico</SelectItem>
                    <SelectItem value="baterista">Baterista</SelectItem>
                    <SelectItem value="guitarrista">Guitarrista</SelectItem>
                    <SelectItem value="baixista">Baixista</SelectItem>
                    <SelectItem value="voz e violão">Voz e Violão</SelectItem>
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
              
              {/* New social media URL fields */}
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">Links para Redes Sociais</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl" className="text-white flex items-center gap-2">
                    <Instagram size={18} className="text-pink-400" />
                    Instagram
                  </Label>
                  <div className="relative">
                    <Input 
                      id="instagramUrl" 
                      value={profileData.instagramUrl}
                      onChange={(e) => handleChange('instagramUrl', e.target.value)}
                      className="bg-toca-background border-toca-border text-white pl-10"
                      placeholder="https://instagram.com/seu_perfil"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400">@</span>
                  </div>
                  {profileData.instagramUrl && !isValidUrl(profileData.instagramUrl) && (
                    <p className="text-sm text-red-500">URL inválida. Inclua http:// ou https://</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-white flex items-center gap-2">
                    <Youtube size={18} className="text-red-500" />
                    YouTube
                  </Label>
                  <Input 
                    id="youtubeUrl" 
                    value={profileData.youtubeUrl}
                    onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                    className="bg-toca-background border-toca-border text-white"
                    placeholder="https://youtube.com/c/seu_canal"
                  />
                  {profileData.youtubeUrl && !isValidUrl(profileData.youtubeUrl) && (
                    <p className="text-sm text-red-500">URL inválida. Inclua http:// ou https://</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="border-toca-border text-white"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
