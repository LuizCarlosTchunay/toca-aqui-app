
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

  const handleImageChange = (imageFile: File, imageUrl?: string) => {
    console.log("Profile image selected");
    setProfileImage(imageFile);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
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

  // Save profile data to database
  const saveProfileData = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar seu perfil");
      return false;
    }
    
    // Validation
    if (!profileData.artisticName) {
      toast.error("Nome artístico é obrigatório");
      return false;
    }
    
    // Prevent multiple submissions
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
      setIsLoading(false);
      setIsSaving(false);
      return true;
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Erro ao salvar o perfil: " + (error.message || "Tente novamente"));
      return false;
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  // Effect to check if user is authenticated and load profile data
  useEffect(() => {
    fetchProfileData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      setIsLoading(false);
      setIsSaving(false);
      setIsNavigating(false);
    };
  }, [fetchProfileData]);

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
