
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

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    artisticName: "DJ Pulse",
    profileType: "dj",
    bio: "DJ com experiência em eventos corporativos e casamentos. Especialista em música eletrônica e house.",
    city: "São Paulo",
    state: "SP",
    hourlyRate: "150",
    eventRate: "1200",
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
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
          // Update state with existing data
          setProfileData({
            artisticName: data.nome_artistico || "DJ Pulse",
            profileType: data.tipo_profissional || "dj",
            bio: data.bio || "DJ com experiência em eventos corporativos e casamentos. Especialista em música eletrônica e house.",
            city: data.cidade || "São Paulo",
            state: data.estado || "SP",
            hourlyRate: data.cache_hora?.toString() || "150",
            eventRate: data.cache_evento?.toString() || "1200",
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

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
    
    setIsLoading(true);
    
    try {
      // Check if user already has a professional profile
      const { data: existingProfile, error: checkError } = await supabase
        .from('profissionais')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      let profileId;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profissionais')
          .update({
            nome_artistico: profileData.artisticName,
            tipo_profissional: profileData.profileType,
            bio: profileData.bio,
            cidade: profileData.city,
            estado: profileData.state,
            cache_hora: parseFloat(profileData.hourlyRate),
            cache_evento: parseFloat(profileData.eventRate)
          })
          .eq('id', existingProfile.id);
        
        if (updateError) throw updateError;
        profileId = existingProfile.id;
        
        // Also update user to have professional profile
        await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
      } else {
        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profissionais')
          .insert({
            user_id: user.id,
            nome_artistico: profileData.artisticName,
            tipo_profissional: profileData.profileType,
            bio: profileData.bio,
            cidade: profileData.city,
            estado: profileData.state,
            cache_hora: parseFloat(profileData.hourlyRate),
            cache_evento: parseFloat(profileData.eventRate)
          })
          .select();
        
        if (insertError) throw insertError;
        if (newProfile && newProfile[0]) profileId = newProfile[0].id;
        
        // Also update user to have professional profile
        await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
      }
      
      // Upload profile image if provided
      if (profileImage && profileId) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${profileId}.${fileExt}`;
        
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
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar o perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (imageFile: File) => {
    setProfileImage(imageFile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="profissional" />
      
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
                  currentImage=""
                  onImageChange={handleImageChange}
                  size="lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artisticName" className="text-white">Nome Artístico</Label>
                <Input 
                  id="artisticName" 
                  value={profileData.artisticName}
                  onChange={(e) => handleChange('artisticName', e.target.value)}
                  className="bg-toca-background border-toca-border text-white"
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
                    <SelectItem value="fotografo">Fotógrafo</SelectItem>
                    <SelectItem value="filmmaker">Filmmaker</SelectItem>
                    <SelectItem value="tecnico_som">Técnico de Som</SelectItem>
                    <SelectItem value="tecnico_luz">Técnico de Luz</SelectItem>
                  </SelectContent>
                </Select>
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
