import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            subgeneros,
            bio,
            cidade,
            estado,
            cache_hora,
            cache_evento
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
          services: professionalData.instrumentos || [],
          genres: professionalData.subgeneros || [],
          hourlyRate: professionalData.cache_hora || 0,
          eventRate: professionalData.cache_evento || 0,
          image: imageUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Default image
          city: professionalData.cidade || "",
          state: professionalData.estado || "",
          bio: professionalData.bio || ""
        };
      } catch (error) {
        console.error("Error fetching professional:", error);
        throw error;
      }
    },
    enabled: !!id
  });

  // Fetch portfolio items
  const { data: portfolio = [] } = useQuery({
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
        
        return data.map(item => item.tipo || "Item de portfólio");
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
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-4 border-toca-accent mb-4">
                    <AvatarImage 
                      src={professional.image} 
                      alt={professional.name}
                    />
                    <AvatarFallback className="text-4xl font-bold text-toca-accent bg-toca-accent/20">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">{professional.artisticName}</h1>
                  <div className="text-toca-text-secondary mb-2">{professional.name}</div>
                  
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="text-white font-medium mr-1">{professional.rating}</span>
                    <span className="text-toca-text-secondary">({professional.reviewCount} avaliações)</span>
                  </div>
                  
                  {(professional.city || professional.state) && (
                    <div className="flex items-center text-toca-text-secondary mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{[professional.city, professional.state].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Clock size={14} className="inline mr-1" /> Por hora
                      </div>
                      <div className="font-semibold text-toca-accent">{formatCurrency(professional.hourlyRate || 0)}</div>
                    </div>
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Calendar size={14} className="inline mr-1" /> Por evento
                      </div>
                      <div className="font-semibold text-toca-accent">{formatCurrency(professional.eventRate || 0)}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate(`/reservar/${professional.id}`)}
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle className="text-lg">Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professional.services && professional.services.map((service, index) => (
                    <Badge key={index} className="bg-toca-background border-toca-border text-white">
                      {service}
                    </Badge>
                  ))}
                  {(!professional.services || professional.services.length === 0) && (
                    <p className="text-toca-text-secondary">Nenhum serviço cadastrado</p>
                  )}
                </div>
                
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
          
          <div className="lg:col-span-2">
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
            
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <ul className="space-y-2">
                    {portfolio.map((item, index) => (
                      <li key={index} className="p-3 bg-toca-background rounded-md text-white">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-toca-text-secondary py-6">
                    Este profissional ainda não adicionou itens ao portfólio.
                  </p>
                )}
              </CardContent>
            </Card>
            
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
