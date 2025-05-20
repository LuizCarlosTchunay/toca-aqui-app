import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Star, Clock, Link as LinkIcon, ExternalLink, Instagram, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProfileCard from "@/components/ProfileCard";

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
  
  // Fetch professional data
  const { data: professional, isLoading, isError } = useQuery({
    queryKey: ['professional', id],
    queryFn: async () => {
      if (!id) throw new Error("ID do profissional não fornecido");

      try {
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
              imageUrl = imageData.publicUrl;
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
    enabled: !!id
  });

  // Fetch portfolio items
  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ['portfolio', id],
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
    enabled: !!id
  });

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
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = (professional?.artisticName || professional?.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

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
          {/* Profile sidebar - Use ProfileCard component with expanded=true */}
          <div>
            <ProfileCard 
              professional={professional} 
              className="mb-6" 
              expanded={true} // Always show expanded view in profile page
            />
            
            {/* Services card */}
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle className="text-lg">Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Services list */}
                <div className="flex flex-wrap gap-2">
                  {(professional.services && professional.services.length > 0) ? (
                    professional.services.map((service, index) => (
                      <Badge key={index} className="bg-toca-background border-toca-border text-white">
                        {service}
                      </Badge>
                    ))
                  ) : professional.instruments && professional.instruments.length > 0 ? (
                    professional.instruments.map((instrument, index) => (
                      <Badge key={index} className="bg-toca-background border-toca-border text-white">
                        {instrument}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-toca-text-secondary">Nenhum serviço cadastrado</p>
                  )}
                </div>
                
                {/* Genres list */}
                {professional.genres && professional.genres.length > 0 && (
                  <>
                    <h4 className="text-white font-medium mt-4 mb-2">Gêneros</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.genres.map((genre, index) => (
                        <Badge key={index} className="bg-toca-background border-toca-border text-white">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* About card */}
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-toca-text-primary">
                  {professional.bio || `${professional.artisticName} ainda não adicionou uma descrição ao perfil.`}
                </p>
              </CardContent>
            </Card>
            
            {/* Portfolio card */}
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioItems && portfolioItems.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {portfolioItems && portfolioItems.map((item, index) => (
                        <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <Card className="bg-toca-background border-toca-border overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-white font-medium truncate">
                                      {item.tipo || "Item de portfólio"}
                                    </h3>
                                    <a 
                                      href={item.url || "#"} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-toca-accent hover:text-toca-accent-hover"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  </div>
                                  
                                  {item.url && (
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm text-toca-accent hover:underline flex items-center"
                                    >
                                      <LinkIcon size={12} className="mr-1" />
                                      {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
                                    </a>
                                  )}
                                  
                                  {item.descricao && (
                                    <p className="text-sm text-toca-text-secondary mt-2">
                                      {item.descricao}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 lg:-left-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
                    <CarouselNext className="-right-4 lg:-right-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
                  </Carousel>
                ) : (
                  <div className="text-center text-toca-text-secondary py-6">
                    {professional.instagram || professional.youtube ? (
                      <div>
                        <p className="mb-3">Este profissional ainda não adicionou itens ao portfólio, mas você pode conferir suas redes sociais:</p>
                        <div className="flex justify-center gap-4">
                          {professional.instagram && (
                            <a 
                              href={professional.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 transition-colors"
                            >
                              <Instagram size={24} />
                            </a>
                          )}
                          {professional.youtube && (
                            <a 
                              href={professional.youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              <Youtube size={24} />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>Este profissional ainda não adicionou itens ao portfólio.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Reviews card */}
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-toca-text-secondary py-6">
                  Este profissional ainda não possui avaliações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
