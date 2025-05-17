import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, ChevronLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  is_public: boolean;
  image?: string;
}

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_public", true);

  if (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }

  return data.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    city: event.city,
    state: event.state,
    required_services: event.required_services || [],
    is_public: event.is_public,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363", // Imagem padrão
  }));
};

const ExploreEvents = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    date: "",
    service: "",
  });

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApply = async (eventId: string) => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      toast.error("Você precisa estar logado para se candidatar a um evento");
      navigate("/login");
      return;
    }

    const userId = session.session.user.id;
    
    // Verificar se o usuário é um profissional
    const { data: professional } = await supabase
      .from("professionals")
      .select("*")
      .eq("id", userId)
      .single();

    if (!professional) {
      toast.error("Você precisa ter um perfil profissional para se candidatar");
      navigate("/editar-perfil");
      return;
    }

    try {
      const { error } = await supabase
        .from("applications")
        .insert({
          event_id: eventId,
          professional_id: userId,
          message: "Estou interessado em trabalhar neste evento.",
        });

      if (error) {
        if (error.code === "23505") {  // Código para violação de uniqueness
          toast.error("Você já se candidatou para este evento");
        } else {
          console.error("Erro ao candidatar-se:", error);
          toast.error("Erro ao enviar candidatura");
        }
      } else {
        toast.success("Candidatura enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao candidatar-se:", error);
      toast.error("Erro ao enviar candidatura");
    }
  };

  // Filter events based on search term and filters
  const filteredEvents = events.filter(event => {
    let matches = true;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matches = matches && (
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.city.toLowerCase().includes(searchLower)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          className="bg-black text-toca-accent hover:bg-gray-800"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Explorar Eventos</h1>
        <div className="w-[80px]"></div> {/* Spacer for alignment */}
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={18} />
            <Input
              placeholder="Buscar eventos..."
              className="bg-toca-card border-toca-border text-white pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
            onClick={toggleFilters}
          >
            <Filter size={18} className="mr-2" /> Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="bg-toca-card border border-toca-border rounded-md p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Cidade</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                  <Input
                    placeholder="Digite a cidade"
                    className="bg-toca-background border-toca-border text-white pl-10"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                  <Input
                    placeholder="Digite o estado"
                    className="bg-toca-background border-toca-border text-white pl-10"
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                  <Input
                    type="date"
                    className="bg-toca-background border-toca-border text-white pl-10"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Serviço</Label>
                <Select
                  value={filters.service}
                  onValueChange={(value) => setFilters({ ...filters, service: value })}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Músico">Músico</SelectItem>
                    <SelectItem value="Fotógrafo">Fotógrafo</SelectItem>
                    <SelectItem value="Filmmaker">Filmmaker</SelectItem>
                    <SelectItem value="Técnico de Som">Técnico de Som</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                className="mr-2 bg-black text-white hover:bg-gray-800"
                onClick={() => setFilters({ city: "", state: "", date: "", service: "" })}
              >
                Limpar
              </Button>
              <Button 
                className="bg-toca-accent hover:bg-toca-accent-hover"
                onClick={toggleFilters}
              >
                Aplicar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary">Carregando eventos...</p>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary">Erro ao carregar eventos. Tente novamente mais tarde.</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
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
                image: event.image
              }}
              onClick={() => navigate(`/eventos/${event.id}`)}
              onApply={() => handleApply(event.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary mb-4">Nenhum evento encontrado com os filtros atuais.</p>
            <Button 
              className="bg-black text-toca-accent hover:bg-gray-900"
              onClick={() => {
                setSearchTerm("");
                setFilters({ city: "", state: "", date: "", service: "" });
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreEvents;
