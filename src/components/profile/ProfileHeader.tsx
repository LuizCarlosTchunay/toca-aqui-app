
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileHeaderProps {
  professional: any;
  profileImage: string | null;
  isNavigating: boolean;
}

const ProfileHeader = ({ professional, profileImage, isNavigating }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  
  // Generate initials for avatar fallback
  const initials = (professional?.nome_artistico || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
    
  // Handle safe navigation
  const handleEditProfileClick = () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    console.log("Navigating to edit profile");
    navigate('/editar-perfil');
  };
  
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

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['my-professional-profile']
      });
      
      toast.success("Imagem de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload: " + (error.message || "Ocorreu um erro ao fazer upload da imagem."));
    }
  };

  return (
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
  );
};

export default ProfileHeader;
