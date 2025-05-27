
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  
  // Enhanced fetchProfileData with Chrome compatibility
  const fetchProfileData = useCallback(async () => {
    if (!user) {
      console.log("No user found, redirecting to home");
      
      // Chrome-safe timeout handling
      const timeoutId = setTimeout(() => {
        toast.error("Você precisa estar logado para editar seu perfil");
        setIsNavigating(true);
        
        // Chrome-compatible navigation
        setTimeout(() => {
          try {
            navigate("/");
          } catch (error) {
            console.error("Navigation error:", error);
            window.location.href = "/";
          }
        }, 100);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
    
    setIsLoading(true);
    
    try {
      console.log("Fetching professional profile data for editing");
      
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
        
        // Enhanced image fetching with Chrome compatibility
        try {
          console.log("Fetching profile image");
          const { data: imageData } = supabase.storage
            .from('profile_images')
            .getPublicUrl(`professionals/${data.id}`);
          
          if (imageData?.publicUrl) {
            const imageUrl = imageData.publicUrl + '?t=' + new Date().getTime();
            
            // Chrome-compatible image check with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            try {
              const checkImage = await fetch(imageData.publicUrl, { 
                method: 'HEAD',
                signal: controller.signal 
              }).then(res => res.ok).catch(() => false);
              
              clearTimeout(timeoutId);
              
              if (checkImage) {
                console.log("Profile image found");
                setProfileImageUrl(imageUrl);
              } else {
                console.log("Profile image not found or not accessible");
              }
            } catch (fetchError) {
              clearTimeout(timeoutId);
              console.log("Image fetch failed, continuing without image");
            }
          }
        } catch (imgError) {
          console.error("Error fetching profile image:", imgError);
        }
      } else {
        console.log("No professional profile found, creating new");
      }
      
      setLoadedData(true);
    } catch (error: any) {
      console.error("Error loading profile data:", error);
      toast.error("Erro ao carregar dados do perfil: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  const handleImageChange = useCallback((imageFile: File, imageUrl?: string) => {
    console.log("Profile image selected");
    setProfileImage(imageFile);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  }, []);

  const handleChange = useCallback((field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Chrome-compatible navigation handler
  const handleNavigate = useCallback((path: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    console.log(`Navigating to ${path}`);
    
    // Chrome-specific handling with fallbacks
    try {
      // Use setTimeout for better Chrome compatibility
      setTimeout(() => {
        try {
          navigate(path, { replace: true });
        } catch (navError) {
          console.error("Navigation error:", navError);
          window.location.href = path;
        } finally {
          setTimeout(() => setIsNavigating(false), 1000);
        }
      }, 50);
    } catch (error) {
      console.error("Navigation setup error:", error);
      window.location.href = path;
      setIsNavigating(false);
    }
  }, [isNavigating, navigate]);

  // Enhanced save profile data with Chrome compatibility
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
      console.log("Already saving or navigating, preventing duplicate submission");
      return false;
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
        const { error: updateError } = await supabase
          .from('profissionais')
          .update(profileDataToSave)
          .eq('id', existingProfessionalId);
        
        if (updateError) throw updateError;
      } else {
        console.log("Creating new professional profile");
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
        
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ tem_perfil_profissional: true })
          .eq('id', user.id);
        
        if (userUpdateError) throw userUpdateError;
      }
      
      // Enhanced image upload with Chrome compatibility
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
          toast.error("Erro ao fazer upload da imagem, mas o perfil foi salvo");
        }
      }
      
      console.log("Profile saved successfully");
      toast.success("Perfil atualizado com sucesso!");
      
      setProfileSaved(true);
      return true;
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar o perfil: " + (error.message || "Tente novamente"));
      return false;
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  }, [user, profileData, otherType, services, existingProfessionalId, profileImage, isSaving, isNavigating]);

  // Effect to load profile data with cleanup
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const loadData = async () => {
      cleanup = await fetchProfileData();
    };
    
    loadData();
    
    return () => {
      if (cleanup) cleanup();
      setIsLoading(false);
      setIsSaving(false);
      setIsNavigating(false);
    };
  }, [fetchProfileData]);

  // Enhanced auth check with Chrome compatibility
  useEffect(() => {
    if (!user && loadedData) {
      console.log("No authenticated user found, redirecting to login");
      toast.error("Você precisa estar logado para acessar esta página");
      
      const timeoutId = setTimeout(() => {
        setIsNavigating(true);
        setTimeout(() => {
          try {
            navigate("/login");
          } catch (error) {
            console.error("Login redirect error:", error);
            window.location.href = "/login";
          }
        }, 100);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [user, navigate, loadedData]);

  // Portfolio manager update effect
  useEffect(() => {
    if (profileSaved && existingProfessionalId) {
      setProfileSaved(false);
    }
  }, [profileSaved, existingProfessionalId]);

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
    handleNavigate,
    saveProfileData,
  };
};
