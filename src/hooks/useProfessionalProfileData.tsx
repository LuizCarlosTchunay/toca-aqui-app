
import { useState, useEffect, useCallback } from "react";
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
          return null; // Don't throw to prevent infinite retries
        }
        
        if (!profData) {
          console.log("No professional data found");
          return null;
        }

        console.log("Professional data fetched successfully:", profData.id);
  
        // Try to get the profile image with better error handling
        try {
          console.log("Fetching profile image");
          const { data: imageData } = await supabase.storage
            .from('profile_images')
            .getPublicUrl(`professionals/${profData.id}`);
            
          if (imageData?.publicUrl) {
            // Add cache busting parameter
            const imageUrl = `${imageData.publicUrl}?t=${new Date().getTime()}`;
            
            // Check if image exists by making a head request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            try {
              const imgExists = await fetch(imageData.publicUrl, { 
                method: 'HEAD',
                signal: controller.signal 
              }).then(res => res.ok).catch(() => false);
              
              clearTimeout(timeoutId);
              
              if (imgExists) {
                console.log("Profile image found");
                setProfileImage(imageUrl);
              } else {
                console.log("Profile image not found or not accessible");
                setProfileImage(null);
              }
            } catch (fetchError) {
              clearTimeout(timeoutId);
              console.log("Image fetch failed, continuing without image");
              setProfileImage(null);
            }
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
          // Continue without image - don't throw
          setProfileImage(null);
        }
  
        return profData;
      } catch (error) {
        console.error("Error in professional profile query:", error);
        return null; // Return null instead of throwing to prevent infinite retries
      }
    },
    enabled: !!user?.id,
    staleTime: 10000, // 10 seconds
    retry: (failureCount, error) => {
      // Only retry network errors, not data errors
      if (failureCount >= 2) return false;
      return error?.message?.includes('network') || error?.message?.includes('fetch');
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Refresh data after any update
  const refreshProfileData = useCallback(() => {
    console.log("Refreshing profile data");
    setRefreshKey(prev => prev + 1);
    
    // Use a timeout to ensure the refetch happens after state update
    const timeoutId = setTimeout(() => {
      refetch().catch(error => {
        console.error("Error refetching profile data:", error);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  // Handle safe navigation with better error handling
  const handleNavigation = useCallback((path: string) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    console.log(`Navigating to ${path}`);
    
    try {
      // Use requestAnimationFrame for better browser compatibility
      requestAnimationFrame(() => {
        try {
          navigate(path);
        } catch (navError) {
          console.error("Navigation error:", navError);
          // Fallback to window.location
          window.location.href = path;
        } finally {
          // Reset navigation state after a delay
          setTimeout(() => setIsNavigating(false), 1000);
        }
      });
    } catch (error) {
      console.error("Animation frame error:", error);
      // Direct fallback
      try {
        navigate(path);
      } catch (navError) {
        window.location.href = path;
      }
      setIsNavigating(false);
    }
  }, [isNavigating, navigate]);

  // Redirect to create professional profile if user is not a professional
  useEffect(() => {
    if (!user) return; // Wait for auth to complete
    
    let timeoutId: NodeJS.Timeout;
    
    if (!isLoading && !professional && !isProfessional) {
      console.log("User is not a professional, redirecting to edit profile");
      
      timeoutId = setTimeout(() => {
        try {
          handleNavigation('/editar-perfil');
        } catch (error) {
          console.error("Redirect error:", error);
          window.location.href = '/editar-perfil';
        }
      }, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, professional, isLoading, isProfessional, handleNavigation]);

  // Redirect to login if not authenticated with better error handling
  useEffect(() => {
    if (!user && !isLoading) {
      console.log("User not authenticated, redirecting to login");
      
      toast.error("Você precisa estar logado para acessar esta página");
      
      const timeoutId = setTimeout(() => {
        try {
          handleNavigation("/login");
        } catch (error) {
          console.error("Login redirect error:", error);
          window.location.href = "/login";
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [user, isLoading, handleNavigation]);

  // Clean up function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or references
      queryClient.cancelQueries({
        queryKey: ['my-professional-profile']
      }).catch(error => {
        console.error("Error canceling queries:", error);
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
