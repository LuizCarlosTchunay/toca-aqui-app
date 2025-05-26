import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { createNotification } from "@/utils/notifications";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  required_services: string[];
  image?: string;
  contratante_id?: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  // Array de imagens específicas para eventos
  const eventImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop", // Concerto com luzes
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop", // Festa com DJ
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop", // Evento musical
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop", // Concerto ao vivo
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=400&fit=crop", // Festa com luzes coloridas
    "https://images.unsplash.com/photo-1571266028243-d220bee1dfab?w=800&h=400&fit=crop", // Evento noturno
  ];

  // Fetch event details
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      try {
        if (!id) throw new Error("ID do evento não fornecido");

        const { data, error } = await supabase
          .from("eventos")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar evento:", error);
          throw error;
        }

        // Se não há imagem definida, usar uma aleatória baseada no nome do evento
        const getEventImage = () => {
          if (data.imagem_url && data.imagem_url !== "https://images.unsplash.com/photo-1527576539890-dfa815648363") {
            return data.imagem_url;
          }
          
          // Usar hash simples do nome para ter consistência
          const hash = data.titulo.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
          return eventImages[hash % eventImages.length];
        };

        return {
          id: data.id,
          name: data.titulo || "",
          description: data.descricao || "",
          date: data.data || "",
          time: "", // Time is not stored separately in our schema
          location: data.local || "",
          city: data.local?.split(",")[0]?.trim() || "", 
          state: data.local?.split(",")[1]?.trim() || "", 
          required_services: data.servicos_requeridos || [],
          contratante_id: data.contratante_id,
          image: getEventImage()
        };
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    },
    enabled: !!id,
  });

  // Get user professional profile (if exists)
  const { data: professionalProfile } = useQuery({
    queryKey: ['userProfessionalProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profissionais')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
          console.error('Error fetching professional profile:', error);
        }
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });

  // Handle apply to event
  const handleApply = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para se candidatar a um evento");
      navigate("/login");
      return;
    }

    if (!professionalProfile) {
      toast.error("Você precisa ter um perfil profissional para se candidatar");
      navigate("/editar-perfil");
      return;
    }

    if (!event) {
      toast.error("Erro ao identificar o evento");
      return;
    }

    try {
      setIsApplying(true);
      
      // Check if user already applied to this event
      const { data: existingApplication, error: checkError } = await supabase
        .from("candidaturas")
        .select("id")
        .eq("evento_id", event.id)
        .eq("profissional_id", professionalProfile.id)
        .single();
        
      if (!checkError && existingApplication) {
        toast.error("Você já se candidatou para este evento");
        setIsApplying(false);
        return;
      }

      const { error } = await supabase
        .from("candidaturas")
        .insert({
          evento_id: event.id,
          profissional_id: professionalProfile.id,
          mensagem: "Estou interessado em trabalhar neste evento."
        });

      if (error) {
        console.error("Erro ao candidatar-se:", error);
        toast.error("Erro ao enviar candidatura");
      } else {
        toast.success("Candidatura enviada com sucesso!");
        
        // Create notification for event owner
        if (event.contratante_id) {
          await createNotification(
            event.contratante_id,
            "application",
            "Nova candidatura recebida",
            `Um profissional se candidatou para o evento "${event.name}"`,
            `/eventos/${event.id}`
          );
        }
      }
    } catch (error) {
      console.error("Erro ao candidatar-se:", error);
      toast.error("Erro ao enviar candidatura");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-toca-text-secondary">Carregando detalhes do evento...</p>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="bg-black text-toca-accent hover:bg-gray-800"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={18} className="mr-1" /> Voltar
            </Button>
          </div>
          <p className="text-center text-toca-text-secondary py-16">Erro ao carregar detalhes do evento. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="bg-toca-background/50 text-white hover:bg-toca-background/80 border border-toca-border"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} className="mr-1" /> Voltar
          </Button>
        </div>
        
        <Card className="bg-gradient-to-br from-toca-card to-toca-card/80 border-toca-border overflow-hidden shadow-2xl">
          {/* Event Image Header com o novo design */}
          <div className="aspect-video relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 z-10"></div>
            
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex flex-col justify-end p-8">
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white font-semibold px-4 py-2 text-sm">
                  {formatDate(event.date)}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-white leading-tight mb-2">{event.name}</h1>
              
              {/* Elemento decorativo */}
              <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse"></div>
              </div>
            </div>
            
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50 z-30"></div>
          </div>
          
          <CardContent className="p-8">
            {/* Event Details com novo design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  Descrição do Evento
                </h2>
                <div className="bg-toca-background/30 rounded-lg p-6 mb-8">
                  <p className="text-white whitespace-pre-line leading-relaxed">
                    {event.description || "Nenhuma descrição disponível para este evento."}
                  </p>
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <Users size={24} className="text-purple-400" />
                  Serviços Necessários
                </h2>
                <div className="flex flex-wrap gap-3">
                  {event.required_services && event.required_services.length > 0 ? (
                    event.required_services.map((service, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition-colors px-4 py-2"
                      >
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-toca-text-secondary">Nenhum serviço especificado</p>
                  )}
                </div>
              </div>
              
              <div>
                <Card className="bg-gradient-to-br from-toca-background to-toca-background/80 border-toca-border shadow-lg sticky top-8">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-toca-accent rounded-full animate-pulse"></div>
                      Detalhes do Evento
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-toca-background/50 rounded-lg p-4">
                        <Calendar className="text-purple-400 flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold text-white">Data</h4>
                          <p className="text-toca-text-secondary">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center gap-4 bg-toca-background/50 rounded-lg p-4">
                          <Clock className="text-blue-400 flex-shrink-0" size={24} />
                          <div>
                            <h4 className="font-semibold text-white">Horário</h4>
                            <p className="text-toca-text-secondary">{event.time}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 bg-toca-background/50 rounded-lg p-4">
                        <MapPin className="text-green-400 flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold text-white">Local</h4>
                          <p className="text-toca-text-secondary">{event.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-6"
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          Processando...
                        </>
                      ) : (
                        "🎯 Me candidatar ao evento"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
