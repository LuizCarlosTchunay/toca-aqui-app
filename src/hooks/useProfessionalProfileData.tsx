
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfessionalProfileData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfessional, setIsProfessional] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  // Fetch professional data if the user is a professional
  const { 
    data: professional, 
    isLoading, 
    refetch 
  } = useQuery({
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
  const handleNavigation = (path: string) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    console.log(`Navigating to ${path}`);
    
    // Use setTimeout to ensure the UI stays responsive
    setTimeout(() => {
      navigate(path);
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

  return {
    user,
    professional,
    profileImage,
    isLoading,
    isNavigating,
    activeTab,
    isProfessional,
    setActiveTab,
    refreshProfileData,
    handleNavigation
  };
};
