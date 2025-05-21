
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Event } from "@/types/events";
import { useQuery } from "@tanstack/react-query";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  onResetFilters: () => void;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events,
  isLoading,
  isError,
  onResetFilters 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleApply = async (eventId: string) => {
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

    try {
      // Check if user already applied to this event
      const { data: existingApplication, error: checkError } = await supabase
        .from("candidaturas")
        .select("id")
        .eq("evento_id", eventId)
        .eq("profissional_id", professionalProfile.id)
        .single();
        
      if (!checkError && existingApplication) {
        toast.error("Você já se candidatou para este evento");
        return;
      }

      const { error } = await supabase
        .from("candidaturas")
        .insert({
          evento_id: eventId,
          profissional_id: professionalProfile.id,
          mensagem: "Estou interessado em trabalhar neste evento."
        });

      if (error) {
        console.error("Erro ao candidatar-se:", error);
        toast.error("Erro ao enviar candidatura");
      } else {
        toast.success("Candidatura enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao candidatar-se:", error);
      toast.error("Erro ao enviar candidatura");
    }
  };

  if (isLoading) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-toca-text-secondary mt-4">Carregando eventos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-toca-text-secondary">Erro ao carregar eventos. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-toca-text-secondary mb-4">Nenhum evento encontrado com os filtros atuais.</p>
        <Button 
          className="bg-black text-toca-accent hover:bg-gray-900"
          onClick={onResetFilters}
        >
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={{
            id: event.id,
            name: event.name,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            city: event.city,
            state: event.state,
            services: event.required_services,
            image: event.image || "https://images.unsplash.com/photo-1527576539890-dfa815648363" // Default image
          }}
          onClick={() => navigate(`/eventos/${event.id}`)}
          onApply={() => handleApply(event.id)}
        />
      ))}
    </div>
  );
};

export default EventsList;
