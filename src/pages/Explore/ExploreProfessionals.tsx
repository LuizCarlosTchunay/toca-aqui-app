
import React, { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Music, Film, Camera, Disc, Users, ChevronLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Professional {
  id: string;
  name: string;
  artisticName?: string;
  type: string;
  rating?: number;
  instruments?: string[];
  services?: string[];
  genres?: string[];
  hourlyRate?: number;
  eventRate?: number;
  image?: string;
  city?: string;
  state?: string;
}

const fetchProfessionals = async () => {
  const { data, error } = await supabase
    .from("professionals")
    .select(`
      id,
      profiles!inner(
        full_name,
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
    `);

  if (error) {
    console.error("Erro ao buscar profissionais:", error);
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    name: item.profiles.full_name,
    artisticName: item.artistic_name,
    type: item.type,
    rating: item.rating,
    services: item.services ? Object.values(item.services) : [],
    genres: item.genres,
    hourlyRate: item.hourly_rate,
    eventRate: item.event_rate,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Imagem padrão
    city: item.profiles.city,
    state: item.profiles.state,
  }));
};

const ExploreProfessionals = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  const { data: professionals = [], isLoading, isError } = useQuery({
    queryKey: ['professionals'],
    queryFn: fetchProfessionals
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter professionals based on search term, active type, and filters
  const filteredProfessionals = professionals.filter(professional => {
    let matches = true;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matches = matches && (
        professional.name.toLowerCase().includes(searchLower) ||
        (professional.artisticName?.toLowerCase().includes(searchLower) || false) ||
        professional.type.toLowerCase().includes(searchLower) ||
        (professional.services?.some(service => service.toLowerCase().includes(searchLower)) || false) ||
        (professional.genres?.some(genre => genre.toLowerCase().includes(searchLower)) || false)
      );
    }
    
    // Active type filter
    if (activeType && matches) {
      matches = matches && professional.type.toLowerCase() === activeType.toLowerCase();
    }
    
    // City filter
    if (filters.city && matches && professional.city) {
      matches = matches && professional.city.toLowerCase().includes(filters.city.toLowerCase());
    }
    
    // State filter
    if (filters.state && matches && professional.state) {
      matches = matches && professional.state.toLowerCase().includes(filters.state.toLowerCase());
    }
    
    // Min price filter
    if (filters.minPrice && matches) {
      const minPrice = parseInt(filters.minPrice);
      matches = matches && !isNaN(minPrice) && ((professional.hourlyRate && professional.hourlyRate >= minPrice) || (professional.eventRate && professional.eventRate >= minPrice));
    }
    
    // Max price filter
    if (filters.maxPrice && matches) {
      const maxPrice = parseInt(filters.maxPrice);
      matches = matches && !isNaN(maxPrice) && ((professional.hourlyRate && professional.hourlyRate <= maxPrice) || (professional.eventRate && professional.eventRate <= maxPrice));
    }
    
    // Rating filter
    if (filters.rating && filters.rating !== "any" && matches) {
      const rating = parseInt(filters.rating);
      matches = matches && !isNaN(rating) && (professional.rating !== undefined && professional.rating >= rating);
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
        <h1 className="text-2xl font-bold">Explorar Profissionais</h1>
        <div className="w-[80px]"></div> {/* Spacer for alignment */}
      </div>

      <div className="mb-6">
        <div className="flex overflow-x-auto scrollbar-hide pb-4 gap-2 mb-4">
          <Button
            variant={activeType === "" ? "default" : "outline"}
            className={activeType === "" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType("")}
          >
            <Users size={18} className="mr-2" /> Todos
          </Button>
          <Button
            variant={activeType === "Músico" ? "default" : "outline"}
            className={activeType === "Músico" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "Músico" ? "" : "Músico")}
          >
            <Music size={18} className="mr-2" /> Músicos
          </Button>
          <Button
            variant={activeType === "DJ" ? "default" : "outline"}
            className={activeType === "DJ" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "DJ" ? "" : "DJ")}
          >
            <Disc size={18} className="mr-2" /> DJs
          </Button>
          <Button
            variant={activeType === "Fotógrafo" ? "default" : "outline"}
            className={activeType === "Fotógrafo" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "Fotógrafo" ? "" : "Fotógrafo")}
          >
            <Camera size={18} className="mr-2" /> Fotógrafos
          </Button>
          <Button
            variant={activeType === "Filmmaker" ? "default" : "outline"}
            className={activeType === "Filmmaker" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "Filmmaker" ? "" : "Filmmaker")}
          >
            <Film size={18} className="mr-2" /> Filmmakers
          </Button>
          <Button
            variant={activeType === "Técnico de Som" ? "default" : "outline"}
            className={activeType === "Técnico de Som" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "Técnico de Som" ? "" : "Técnico de Som")}
          >
            Técnicos de Som
          </Button>
          <Button
            variant={activeType === "Técnico de Luz" ? "default" : "outline"}
            className={activeType === "Técnico de Luz" ? "bg-toca-accent hover:bg-toca-accent-hover" : "bg-black text-white hover:bg-gray-800"}
            onClick={() => setActiveType(activeType === "Técnico de Luz" ? "" : "Técnico de Luz")}
          >
            Técnicos de Luz
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={18} />
            <Input
              placeholder="Buscar profissionais..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <Label>Preço mínimo</Label>
                <Input
                  type="number"
                  placeholder="R$"
                  className="bg-toca-background border-toca-border text-white"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>

              <div>
                <Label>Preço máximo</Label>
                <Input
                  type="number"
                  placeholder="R$"
                  className="bg-toca-background border-toca-border text-white"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>

              <div>
                <Label>Avaliação mínima</Label>
                <Select
                  value={filters.rating}
                  onValueChange={(value) => setFilters({ ...filters, rating: value })}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="5">5 estrelas</SelectItem>
                    <SelectItem value="4">4+ estrelas</SelectItem>
                    <SelectItem value="3">3+ estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                className="mr-2 bg-black text-white hover:bg-gray-800"
                onClick={() => setFilters({ city: "", state: "", minPrice: "", maxPrice: "", rating: "" })}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary">Carregando profissionais...</p>
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary">Erro ao carregar profissionais. Tente novamente mais tarde.</p>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((professional) => (
            <ProfileCard
              key={professional.id}
              professional={{
                id: professional.id,
                name: professional.name,
                artisticName: professional.artisticName || professional.name,
                type: professional.type,
                rating: professional.rating || 0,
                instruments: professional.genres || [],
                services: professional.services || [],
                genres: professional.genres || [],
                hourlyRate: professional.hourlyRate || 0,
                eventRate: professional.eventRate || 0,
                image: professional.image,
                city: professional.city || "",
                state: professional.state || "",
              }}
              onClick={() => navigate(`/profissional/${professional.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-toca-text-secondary mb-4">Nenhum profissional encontrado com os filtros atuais.</p>
            <Button 
              className="bg-black text-toca-accent hover:bg-gray-900"
              onClick={() => {
                setSearchTerm("");
                setActiveType("");
                setFilters({ city: "", state: "", minPrice: "", maxPrice: "", rating: "" });
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

export default ExploreProfessionals;
