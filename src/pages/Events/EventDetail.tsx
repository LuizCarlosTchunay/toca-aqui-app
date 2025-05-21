
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
import ProfileCardNeonBorder from "@/components/profile/ProfileCardNeonBorder";

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
  const [isHovered, setIsHovered] = useState(false);

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
          image: "https://images.unsplash.com/photo-1527576539890-dfa815648363" // Default image
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
          <p className="text-center text-white">Carregando detalhes do evento...</p>
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
          <p className="text-center text-white py-16">Erro ao carregar detalhes do evento. Tente novamente mais tarde.</p>
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
            variant="outline" 
            className="bg-black text-toca-accent hover:bg-gray-800 border-toca-accent"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} className="mr-1" /> Voltar
          </Button>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="bg-toca-card border-toca-accent overflow-hidden relative">
            <ProfileCardNeonBorder position="top" isVisible={isHovered} />
            <ProfileCardNeonBorder position="right" isVisible={isHovered} />
            <ProfileCardNeonBorder position="bottom" isVisible={isHovered} />
            <ProfileCardNeonBorder position="left" isVisible={isHovered} />
            
            {/* Event Image Header */}
            <div className="aspect-video relative overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{event.name}</h1>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-toca-accent border-toca-accent text-white shadow-[0_0_10px_rgba(234,56,76,0.7)]">
                    {formatDate(event.date)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-2">
                  <h2 className="text-xl font-bold mb-4 text-white">Descrição</h2>
                  <p className="text-white/90 whitespace-pre-line mb-6">
                    {event.description || "Nenhuma descrição disponível para este evento."}
                  </p>
                  
                  <h2 className="text-xl font-bold mb-4 text-white">Serviços Necessários</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.required_services && event.required_services.length > 0 ? (
                      event.required_services.map((service, i) => (
                        <Badge key={i} variant="outline" className="border-toca-accent text-white shadow-[0_0_5px_rgba(234,56,76,0.3)]">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-white/70">Nenhum serviço especificado</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Card className="bg-black/40 border-toca-accent shadow-[0_0_15px_rgba(234,56,76,0.4)]">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Detalhes do Evento</h3>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="text-toca-accent animate-pulse mt-1" size={20} />
                        <div>
                          <h4 className="font-medium text-white">Data</h4>
                          <p className="text-white/80">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-start gap-3">
                          <Clock className="text-toca-accent mt-1" size={20} />
                          <div>
                            <h4 className="font-medium text-white">Horário</h4>
                            <p className="text-white/80">{event.time}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="text-toca-accent mt-1" size={20} />
                        <div>
                          <h4 className="font-medium text-white">Local</h4>
                          <p className="text-white/80">{event.location}</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-toca-accent hover:bg-toca-accent-hover mt-4 transition-all duration-300 shadow-[0_0_10px_rgba(234,56,76,0.5)] hover:shadow-[0_0_15px_rgba(234,56,76,0.8)] animate-neon-pulse"
                        onClick={handleApply}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                            Processando...
                          </>
                        ) : (
                          "Me candidatar"
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
    </div>
  );
};

export default EventDetail;
