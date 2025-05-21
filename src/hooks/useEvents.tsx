
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Event, EventFilters } from "@/types/events";

export const useEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<EventFilters>({
    city: "",
    state: "",
    date: "",
    service: "",
  });

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("eventos")
          .select("*")
          .eq("status", "aberto");

        if (error) {
          console.error("Erro ao buscar eventos:", error);
          throw error;
        }

        return data.map((event) => ({
          id: event.id,
          name: event.titulo || "",
          description: event.descricao || "",
          date: event.data || "",
          time: "", // Time is not stored separately in our schema
          location: event.local || "",
          city: event.local?.split(",")[0]?.trim() || "", 
          state: event.local?.split(",")[1]?.trim() || "", 
          required_services: event.servicos_requeridos || [],
          image: "" // Will be handled by the EventCard component
        }));
      } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
    },
  });

  // Filter events based on search term and filters
  const filteredEvents = (events || []).filter(event => {
    let matches = true;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matches = matches && (
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.city.toLowerCase().includes(searchLower) ||
        event.state.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }
    
    // City filter
    if (filters.city) {
      matches = matches && event.city.toLowerCase().includes(filters.city.toLowerCase());
    }
    
    // State filter
    if (filters.state) {
      matches = matches && event.state.toLowerCase().includes(filters.state.toLowerCase());
    }
    
    // Date filter
    if (filters.date) {
      matches = matches && event.date === filters.date;
    }
    
    // Service filter
    if (filters.service && filters.service !== "all") {
      matches = matches && event.required_services.some(
        service => service.toLowerCase() === filters.service.toLowerCase()
      );
    }
    
    return matches;
  });

  return {
    events: filteredEvents,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters
  };
};
