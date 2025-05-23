import React, { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Music, Film, Camera, Disc, Users, ChevronLeft, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  bio?: string;
}

const ExploreProfessionals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('tipo') || "";
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState(initialType);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  const { data: professionals = [], isLoading, isError } = useQuery({
    queryKey: ['professionals', activeType],
    queryFn: async () => {
      let query = supabase
        .from("profissionais")
        .select(`
          id,
          user_id,
          nome_artistico,
          tipo_profissional,
          instrumentos,
          servicos,
          subgeneros,
          bio,
          cidade,
          estado,
          cache_hora,
          cache_evento,
          instagram_url,
          youtube_url
        `);
      
      // Apply type filter if active, making sure to normalize for "Músico" variations
      if (activeType) {
        if (activeType === "Músico") {
          // Handle both "Músico" and "Musico" when filtering
          query = query.or('tipo_profissional.eq.Músico,tipo_profissional.eq.Musico');
        } else {
          query = query.eq('tipo_profissional', activeType);
        }
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar profissionais:", error);
        throw error;
      }

      return data.map((item) => {
        return {
          id: item.id,
          name: item.nome_artistico || "Sem nome",
          artisticName: item.nome_artistico,
          type: item.tipo_profissional || "",
          rating: 4.5, // Default rating until we implement a rating system
          instruments: item.instrumentos || [],
          services: item.servicos || [], 
          genres: item.subgeneros || [],
          hourlyRate: item.cache_hora || 0,
          eventRate: item.cache_evento || 0,
          image: "", // Will be handled by the ProfileCard component
          city: item.cidade || "",
          state: item.estado || "",
          bio: item.bio || "",
        };
      });
    }
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter professionals based on search term and filters
  const filteredProfessionals = professionals.filter(professional => {
    let matches = true;
    
    // Search term filter - improved to search across all relevant fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      const fieldsToSearch = [
        professional.name,
        professional.artisticName,
        professional.type,
        professional.city,
        professional.state,
        professional.bio
      ];
      
      // Include arrays like instruments, services, genres in search
      const arrayFields = [
        ...(professional.instruments || []),
        ...(professional.services || []),
        ...(professional.genres || [])
      ];
      
      // Check if any string field contains the search term
      const stringMatches = fieldsToSearch.some(field => 
        field ? field.toLowerCase().includes(searchLower) : false
      );
      
      // Check if any array item contains the search term
      const arrayMatches = arrayFields.some(item => 
        item ? item.toLowerCase().includes(searchLower) : false
      );
      
      matches = matches && (stringMatches || arrayMatches);
    }
    
    // City filter
    if (filters.city && matches) {
      matches = matches && professional.city ? 
        professional.city.toLowerCase().includes(filters.city.toLowerCase()) : false;
    }
    
    // State filter
    if (filters.state && matches) {
      matches = matches && professional.state ? 
        professional.state.toLowerCase().includes(filters.state.toLowerCase()) : false;
    }
    
    // Min price filter
    if (filters.minPrice && matches) {
      const minPrice = parseInt(filters.minPrice);
      
      if (!isNaN(minPrice)) {
        // Check if either hourly rate or event rate matches the criteria
        const hourlyRateMatch = professional.hourlyRate ? professional.hourlyRate >= minPrice : false;
        const eventRateMatch = professional.eventRate ? professional.eventRate >= minPrice : false;
        
        matches = matches && (hourlyRateMatch || eventRateMatch);
      }
    }
    
    // Max price filter
    if (filters.maxPrice && matches) {
      const maxPrice = parseInt(filters.maxPrice);
      
      if (!isNaN(maxPrice)) {
        // Only apply to professionals who have defined rates
        if (professional.hourlyRate || professional.eventRate) {
          const hourlyRateMatch = professional.hourlyRate ? 
            professional.hourlyRate <= maxPrice : true;
          const eventRateMatch = professional.eventRate ? 
            professional.eventRate <= maxPrice : true;
          
          matches = matches && (hourlyRateMatch || eventRateMatch);
        }
      }
    }
    
    // Rating filter
    if (filters.rating && filters.rating !== "any" && matches) {
      const minRating = parseInt(filters.rating);
      matches = matches && professional.rating ? professional.rating >= minRating : false;
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
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-toca-text-secondary mt-4">Carregando profissionais...</p>
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
                instruments: professional.instruments || [],
                services: professional.services || [],
                genres: professional.genres || [],
                hourlyRate: professional.hourlyRate || 0,
                eventRate: professional.eventRate || 0,
                image: professional.image,
                city: professional.city || "",
                state: professional.state || "",
                bio: professional.bio || "",
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
