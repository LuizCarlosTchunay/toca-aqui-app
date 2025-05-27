
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSafeState } from "@/hooks/useSafeState";
import { toast } from "sonner";

export interface ProfileData {
  artisticName: string;
  profileType: string;
  bio: string;
  city: string;
  state: string;
  hourlyRate: string;
  eventRate: string;
}

export const useProfessionalProfile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, safeSetProfileImageUrl] = useSafeState<string | undefined>(undefined);
  const [isLoading, safeSetIsLoading] = useSafeState(false);
  const [isSaving, safeSetIsSaving] = useSafeState(false);
  const [isNavigating, safeSetIsNavigating] = useSafeState(false);
  const [existingProfessionalId, setExistingProfessionalId] = useState<string | null>(null);
  const [otherType, setOtherType] = useState<string>("");
  const [loadedData, safeSetLoadedData] = useSafeState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  
  const [services, setServices] = useState<string[]>([]);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    artisticName: "",
    profileType: "musico",
    bio: "",
    city: "",
    state: "",
    hourlyRate: "",
    eventRate: "",
  });
  
  // Enhanced fetchProfileData
  const fetchProfileData = useCallback(async () => {
    if (!user) {
      console.log("[Profile] No user found");
      return;
    }
    
    safeSetIsLoading(true);
    
    try {
      console.log("[Profile] Fetching professional profile data");
      
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("[Profile] Error fetching professional profile:", error);
        throw error;
      }
      
      if (data) {
        console.log("[Profile] Found professional profile:", data.id);
        setExistingProfessionalId(data.id);
        
        const predefinedTypes = ["dj", "musico", "duo", "trio", "banda", "fotografo", "filmmaker", "tecnico_som", "tecnico_luz"];
        const isPredefined = predefinedTypes.includes(data.tipo_profissional?.toLowerCase() || "");
        
        setServices(data.servicos || data.instrumentos || []);
        
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
        
        // Enhanced image fetching
        try {
          console.log("[Profile] Fetching profile image");
          const { data: imageData } = supabase.storage
            .from('profile_images')
            .getPublicUrl(`professionals/${data.id}`);
          
          if (imageData?.publicUrl) {
            const imageUrl = imageData.publicUrl + '?t=' + new Date().getTime();
            
            try {
              const checkImage = await fetch(imageData.publicUrl, { method: 'HEAD' })
                .then(res => res.ok)
                .catch(() => false);
              
              if (checkImage) {
                console.log("[Profile] Profile image found");
                safeSetProfileImageUrl(imageUrl);
              } else {
                console.log("[Profile] Profile image not found");
              }
            } catch (fetchError) {
              console.log("[Profile] Image fetch failed, continuing without image");
            }
          }
        } catch (imgError) {
          console.error("[Profile] Error fetching profile image:", imgError);
        }
      } else {
        console.log("[Profile] No professional profile found");
      }
      
      safeSetLoadedData(true);
    } catch (error: any) {
      console.error("[Profile] Error loading profile data:", error);
      toast.error("Erro ao carregar dados do perfil: " + (error.message || "Tente novamente"));
    } finally {
      safeSetIsLoading(false);
    }
  }, [user, safeSetIsLoading, safeSetProfileImageUrl, safeSetLoadedData]);

  const handleImageChange = useCallback((imageFile: File, imageUrl?: string) => {
    console.log("[Profile] Image selected");
    setProfileImage(imageFile);
    if (imageUrl) {
      safeSetProfileImageUrl(imageUrl);
    }
  }, [safeSetProfileImageUrl]);

  const handleChange = useCallback((field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Enhanced save profile data
  const saveProfileData = useCallback(async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar seu perfil");
      return false;
    }
    
    if (!profileData.artisticName) {
      toast.error("Nome artístico é obrigatório");
      return false;
    }
    
    if (isSaving || isNavigating) {
      console.log("[Profile] Already saving or navigating");
      return false;
    }
    
    safeSetIsLoading(true);
    safeSetIsSaving(true);
    
    try {
      console.log("[Profile] Saving profile data");
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
        console.log("[Profile] Updating existing profile:", existingProfessionalId);
        const { error: updateError } = await supabase
          .from('profissionais')
          .update(profileDataToSave)
          .eq('id', existingProfessionalId);
        
        if (updateError) throw updateError;
      } else {
        console.log("[Profile] Creating new professional profile");
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
        
        console.log("[Profile] Created new profile:", professionalId);
        setExistingProfessionalId(professionalId);
        
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
        
        if (userUpdateError) throw userUpdateError;
      }
      
      // Image upload
      if (profileImage && professionalId) {
        try {
          console.log("[Profile] Uploading profile image");
          
          const fileName = `professionals/${professionalId}`;
          
          const { error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(fileName, profileImage, {
              upsert: true,
              contentType: profileImage.type
            });
          
          if (uploadError) throw uploadError;
          console.log("[Profile] Profile image uploaded successfully");
        } catch (imageError) {
          console.error("[Profile] Error uploading image:", imageError);
          toast.error("Erro ao fazer upload da imagem, mas o perfil foi salvo");
        }
      }
      
      console.log("[Profile] Profile saved successfully");
      toast.success("Perfil atualizado com sucesso!");
      
      setProfileSaved(true);
      return true;
      
    } catch (error: any) {
      console.error("[Profile] Error saving profile:", error);
      toast.error("Erro ao salvar o perfil: " + (error.message || "Tente novamente"));
      return false;
    } finally {
      safeSetIsLoading(false);
      safeSetIsSaving(false);
    }
  }, [user, profileData, otherType, services, existingProfessionalId, profileImage, isSaving, isNavigating, safeSetIsLoading, safeSetIsSaving]);

  // Load profile data
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Auth check
  useEffect(() => {
    if (!user && loadedData) {
      console.log("[Profile] No authenticated user found");
      toast.error("Você precisa estar logado para acessar esta página");
    }
  }, [user, loadedData]);

  return {
    user,
    profileData,
    setProfileData,
    profileImage,
    profileImageUrl,
    isLoading,
    isSaving,
    isNavigating,
    services,
    setServices,
    existingProfessionalId,
    loadedData,
    profileSaved,
    otherType,
    setOtherType,
    handleChange,
    handleImageChange,
    saveProfileData,
  };
};
