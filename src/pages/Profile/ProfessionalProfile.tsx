
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import AboutSection from "@/components/profile/AboutSection";
import PortfolioSection from "@/components/profile/PortfolioSection";
import ReviewsSection from "@/components/profile/ReviewsSection";

// Portfolio item type
interface PortfolioItem {
  id: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string | null;
}

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch professional data
  const { data: professional, isLoading, isError, refetch } = useQuery({
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
          services: professionalData.servicos || [], // Add services
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
    retry: 2,
    staleTime: 30000 // 30 seconds
  });

  // Fetch portfolio items
  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
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
    retry: 2,
    staleTime: 30000 // 30 seconds
  });

  // Force refresh data if any errors occur
  useEffect(() => {
    if (isError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetch();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, retryCount, refetch]);

  const handleBookProfessional = () => {
    if (!user) {
      toast.error("Você precisa estar logado para reservar um profissional");
      navigate("/login", { state: { redirectBack: `/profissional/${id}` } });
      return;
    }
    
    navigate(`/reservar/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-toca-text-secondary">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (isError || !professional) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-toca-text-secondary">Erro ao carregar perfil. Tente novamente mais tarde.</p>
          <Button 
            className="mx-auto mt-4 block bg-toca-accent hover:bg-toca-accent-hover"
            onClick={() => {
              setRetryCount(prev => prev + 1);
              refetch();
            }}
          >
            Tentar novamente
          </Button>
          <Button 
            className="mx-auto mt-4 block"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <ProfileSidebar 
            professional={professional}
            onBookClick={handleBookProfessional}
          />
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* About card */}
            <AboutSection 
              bio={professional.bio} 
              name={professional.artisticName || professional.name} 
            />
            
            {/* Portfolio card */}
            <PortfolioSection 
              portfolioItems={portfolioItems || []}
              instagram={professional.instagram}
              youtube={professional.youtube}
            />
            
            {/* Reviews card */}
            <ReviewsSection professionalId={professional.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
