
import React, { useState } from "react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data
const events = [
  {
    id: "1",
    name: "Festival de Verão",
    description: "Um grande festival de música e artes para celebrar o verão.",
    date: "2025-01-15",
    time: "14:00",
    location: "Parque Municipal",
    city: "São Paulo",
    state: "SP",
    services: ["Músico", "DJ", "Técnico de Som"],
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
  },
  {
    id: "2",
    name: "Feira Cultural",
    description: "Uma feira de artes e cultura com apresentações ao vivo.",
    date: "2025-07-20",
    time: "10:00",
    location: "Centro de Exposições",
    city: "Rio de Janeiro",
    state: "RJ",
    services: ["Fotógrafo", "Filmmaker", "Músico"],
  },
  {
    id: "3",
    name: "Casamento Silva",
    description: "Cerimônia e recepção de casamento para 150 convidados.",
    date: "2025-06-15",
    time: "19:00",
    location: "Buffet Estrela",
    city: "São Paulo",
    state: "SP",
    services: ["DJ", "Fotógrafo", "Filmmaker"],
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
  },
  {
    id: "4",
    name: "Aniversário Empresarial",
    description: "Celebração do aniversário de 10 anos da empresa.",
    date: "2025-06-22",
    time: "20:00",
    location: "Hotel Continental",
    city: "São Paulo",
    state: "SP",
    services: ["Músico", "Técnico de Som", "DJ"],
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
  },
];

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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApply = (eventId: string) => {
    toast.success("Candidatura enviada com sucesso!");
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
    if (filters.city && matches) {
      matches = matches && event.city.toLowerCase() === filters.city.toLowerCase();
    }
    
    // State filter
    if (filters.state && matches) {
      matches = matches && event.state.toLowerCase() === filters.state.toLowerCase();
    }
    
    // Date filter
    if (filters.date && matches) {
      matches = matches && event.date === filters.date;
    }
    
    // Service filter
    if (filters.service && matches) {
      matches = matches && event.services.some(
        service => service.toLowerCase() === filters.service.toLowerCase()
      );
    }
    
    return matches;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Explorar Eventos</h1>

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
                <Select
                  value={filters.city}
                  onValueChange={(value) => setFilters({ ...filters, city: value })}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => setFilters({ ...filters, state: value })}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="">Todos</SelectItem>
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
                className="mr-2"
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
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/eventos/${event.id}`)}
              onApply={() => handleApply(event.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary mb-4">Nenhum evento encontrado com os filtros atuais.</p>
            <Button 
              className="bg-toca-accent hover:bg-toca-accent-hover"
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
