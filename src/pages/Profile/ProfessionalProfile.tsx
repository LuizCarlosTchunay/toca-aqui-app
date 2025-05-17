
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProfessionalData {
  id: string;
  name: string;
  artisticName?: string;
  type: string;
  rating?: number;
  reviewCount?: number;
  services?: string[];
  genres?: string[];
  hourlyRate?: number;
  eventRate?: number;
  image?: string;
  city?: string;
  state?: string;
  bio?: string;
  portfolio?: string[];
}

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUserId(data.session.user.id);
      }
    };
    checkAuth();
  }, []);

  const { data: professional, isLoading, isError } = useQuery({
    queryKey: ['professional', id],
    queryFn: async () => {
      if (!id) throw new Error("ID do profissional não fornecido");

      const { data, error } = await supabase
        .from("professionals")
        .select(`
          id,
          profiles!inner(
            id,
            full_name,
            biography,
            city,
            state
          ),
          artistic_name,
          type,
          rating,
          services,
          genres,
          hourly_rate,
          event_rate
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar profissional:", error);
        throw error;
      }

      // Buscar reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("reviewed_id", id);

      if (reviewsError) {
        console.error("Erro ao buscar avaliações:", reviewsError);
      }

      return {
        id: data.id,
        name: data.profiles.full_name,
        artisticName: data.artistic_name || data.profiles.full_name,
        type: data.type,
        rating: data.rating || 4.5,
        reviewCount: reviews?.length || 0,
        services: data.services ? Object.values(data.services) : [],
        genres: data.genres || [],
        hourlyRate: data.hourly_rate,
        eventRate: data.event_rate,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Imagem padrão
        city: data.profiles.city,
        state: data.profiles.state,
        bio: data.profiles.biography,
        portfolio: ["Evento Corporativo XYZ", "Casamento Silva", "Festival de Verão 2024"] // Mock para portfolio
      };
    },
    enabled: !!id
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviewer_id(full_name)
        `)
        .eq("reviewed_id", id)
        .limit(2);

      if (error) {
        console.error("Erro ao buscar avaliações:", error);
        return [];
      }

      return data.map(review => ({
        id: review.id,
        reviewerName: review.profiles.full_name,
        rating: review.rating,
        comment: review.comment,
        eventType: "Evento"
      }));
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!currentUserId} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-toca-text-secondary">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (isError || !professional) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!currentUserId} />
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

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!currentUserId} />
      
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
                  <div className="w-32 h-32 rounded-full bg-toca-accent/20 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-toca-accent">{professional.type.substring(0, 2)}</span>
                  </div>
                  
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
                <p className="text-toca-text-primary">{professional.bio || `${professional.artisticName} ainda não adicionou uma descrição ao perfil.`}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                {professional.portfolio && professional.portfolio.length > 0 ? (
                  <ul className="space-y-2">
                    {professional.portfolio.map((item, index) => (
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
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-4 border border-toca-border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-white">{review.reviewerName}</h4>
                            <div className="text-xs text-toca-text-secondary">Evento: {review.eventType}</div>
                          </div>
                          <div className="flex items-center">
                            <Star className="text-yellow-500 mr-1" size={14} />
                            <span className="text-white">{review.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-toca-text-primary text-sm">
                          {review.comment || "Sem comentários."}
                        </p>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-toca-border text-toca-text-secondary"
                    >
                      Ver todas as avaliações
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-toca-text-secondary py-6">
                    Este profissional ainda não possui avaliações.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
