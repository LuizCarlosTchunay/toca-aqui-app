
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

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  eventType: string;
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

      // Buscar avaliações
      const { data: avaliacoes, error: avaliacoesError } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("profissional_id", id);

      if (avaliacoesError) {
        console.error("Erro ao buscar avaliações:", avaliacoesError);
      }

      const reviewCount = avaliacoes ? avaliacoes.length : 0;
      
      // Buscar portfolio
      const { data: portfolioItems, error: portfolioError } = await supabase
        .from("portfolio")
        .select("*")
        .eq("profissional_id", id);
        
      if (portfolioError) {
        console.error("Erro ao buscar portfólio:", portfolioError);
      }

      const portfolioList = portfolioItems ? portfolioItems.map(item => item.tipo || 'Item de portfólio') : [];

      return {
        id: data.id,
        name: data.nome_artistico || "Sem nome",
        artisticName: data.nome_artistico || "Sem nome artístico",
        type: data.tipo_profissional || "Músico",
        rating: 4.5, // Valor padrão até implementarmos avaliações reais
        reviewCount: reviewCount,
        services: data.instrumentos || [],
        genres: data.subgeneros || [],
        hourlyRate: data.cache_hora || 0,
        eventRate: data.cache_evento || 0,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Imagem padrão
        city: data.cidade || "",
        state: data.estado || "",
        bio: data.bio || "",
        portfolio: portfolioList.length > 0 ? portfolioList : ["Evento Corporativo XYZ", "Casamento Silva", "Festival de Verão 2024"] // Mock se não houver dados reais
      };
    },
    enabled: !!id
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
          *,
          users!contratante_id (nome)
        `)
        .eq("profissional_id", id)
        .limit(2);

      if (error) {
        console.error("Erro ao buscar avaliações:", error);
        return [];
      }

      if (!data) return [];

      return data.map(review => ({
        id: review.id,
        reviewerName: review.users?.nome || "Usuário",
        rating: review.nota || 5,
        comment: review.comentario || "Ótimo profissional!",
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
                {professional.reviewCount && professional.reviewCount > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-4 bg-toca-background rounded-md">
                        <div className="flex justify-between mb-2">
                          <div className="font-semibold text-white">{review.reviewerName}</div>
                          <div className="flex items-center">
                            <Star className="text-yellow-500 mr-1" size={14} />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-toca-text-secondary text-sm">{review.comment}</p>
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
