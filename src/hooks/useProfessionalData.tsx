
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export interface Professional {
  id: string;
  name: string;
  artisticName?: string;
  type: string;
  rating: number;
  reviewCount: number;
  instruments?: string[];
  services?: string[];
  genres?: string[];
  hourlyRate?: number;
  eventRate?: number;
  image?: string;
  city: string;
  state: string;
  bio?: string;
  instagram?: string;
  youtube?: string;
}

export interface PortfolioItem {
  id: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string | null;
}

export const useProfessionalData = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [retryCount, setRetryCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Safety check for ID parameter
  useEffect(() => {
    if (!id) {
      console.error("Missing professional ID parameter");
      toast.error("ID do profissional não encontrado");
      navigate("/explorar", { replace: true });
    }
  }, [id, navigate]);
  
  // Fetch professional data
  const { 
    data: professional, 
    isLoading: isProfessionalLoading, 
    isError: isProfessionalError,
    refetch: refetchProfessional
  } = useQuery({
    queryKey: ['professional', id, retryCount],
    queryFn: async () => {
      if (!id) throw new Error("ID do profissional não fornecido");

      try {
        // Ensure storage bucket exists to avoid errors
        try {
          await supabase.storage.createBucket('profile_images', {
            public: true
          });
        } catch (e) {
          console.log("Bucket may already exist");
        }
        
        // Get professional details
        const { data: professionalData, error } = await supabase
          .from("profissionais")
          .select(`
            id,
            user_id,
            nome_artistico,
            tipo_profissional,
            instrumentos,
            servicos,
            subgeneros,
            bio,
            cidade,
            estado,
            cache_hora,
            cache_evento,
            instagram_url,
            youtube_url
          `)
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar profissional:", error);
          throw error;
        }
        
        // Try to get the profile image URL from storage
        const { data: imageData } = await supabase.storage
          .from('profile_images')
          .getPublicUrl(`professionals/${id}`);
          
        // Check if image exists
        let imageUrl: string | undefined;
        if (imageData?.publicUrl) {
          try {
            const response = await fetch(imageData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              // Add cache busting to prevent stale images
              imageUrl = imageData.publicUrl + '?t=' + new Date().getTime();
            }
          } catch (err) {
            console.log("Image may not exist");
          }
        }

        return {
          id: professionalData.id,
          name: professionalData.nome_artistico || "Sem nome",
          artisticName: professionalData.nome_artistico || "Sem nome artístico",
          type: professionalData.tipo_profissional || "Músico",
          rating: 4.5, // Default rating until we implement a rating system
          reviewCount: 0, // Default count until we implement reviews
          instruments: professionalData.instrumentos || [],
          services: professionalData.servicos || [], 
          genres: professionalData.subgeneros || [],
          hourlyRate: professionalData.cache_hora || 0,
          eventRate: professionalData.cache_evento || 0,
          image: imageUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Default image
          city: professionalData.cidade || "",
          state: professionalData.estado || "",
          bio: professionalData.bio || "",
          instagram: professionalData.instagram_url,
          youtube: professionalData.youtube_url
        };
      } catch (error) {
        console.error("Error fetching professional:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });

  // Fetch portfolio items
  const { 
    data: portfolioItems = [], 
    isLoading: isPortfolioLoading 
  } = useQuery<PortfolioItem[]>({
    queryKey: ['portfolio', id, retryCount],
    queryFn: async () => {
      if (!id) return [];
      
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .eq("profissional_id", id);
          
        if (error) {
          console.error("Erro ao buscar portfólio:", error);
          return [];
        }
        
        // Map the portfolio items and ensure descricao exists
        return (data || []).map(item => ({
          id: item.id,
          profissional_id: item.profissional_id,
          tipo: item.tipo,
          url: item.url,
          descricao: item.descricao
        })) as PortfolioItem[];
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        return [];
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000 // 30 seconds
  });

  // Force refresh data if any errors occur
  useEffect(() => {
    if (isProfessionalError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetchProfessional();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isProfessionalError, retryCount, refetchProfessional]);

  const handleGoBack = () => {
    setIsNavigating(true);
    navigate(-1);
  };

  const handleBookProfessional = () => {
    setIsNavigating(true);
    navigate(`/reservar/${id}`);
  };

  return {
    id,
    professional,
    portfolioItems,
    isProfessionalLoading,
    isPortfolioLoading,
    isProfessionalError,
    isNavigating,
    retryCount,
    setRetryCount,
    refetchProfessional,
    handleGoBack,
    handleBookProfessional
  };
};
