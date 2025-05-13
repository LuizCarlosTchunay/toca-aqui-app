
import React, { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Music, Film, Camera, Disc, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const professionals = [
  {
    id: "1",
    name: "João Silva",
    artisticName: "DJ Pulse",
    type: "DJ",
    rating: 4.8,
    instruments: [],
    services: ["DJ", "Produção Musical", "Mixagem"],
    genres: ["Eletrônica", "House", "EDM"],
    hourlyRate: 150,
    eventRate: 1200,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    city: "São Paulo",
    state: "SP",
  },
  {
    id: "2",
    name: "Maria Santos",
    artisticName: "Maria Santos",
    type: "Fotógrafo",
    rating: 4.9,
    instruments: [],
    services: ["Fotografia", "Edição", "Cobertura de Eventos"],
    hourlyRate: 200,
    eventRate: 1500,
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: "3",
    name: "Carlos Mendes",
    artisticName: "Mendes Trio",
    type: "Músico",
    rating: 4.7,
    instruments: ["Violão", "Voz", "Piano"],
    services: ["Shows ao Vivo", "Eventos Corporativos", "Casamentos"],
    genres: ["MPB", "Pop", "Jazz"],
    hourlyRate: 180,
    eventRate: 1300,
    city: "São Paulo",
    state: "SP",
  },
  {
    id: "4",
    name: "Ana Ferreira",
    artisticName: "Ana Films",
    type: "Filmmaker",
    rating: 4.6,
    instruments: [],
    services: ["Videografia", "Edição", "Documentários", "Clipes"],
    hourlyRate: 250,
    eventRate: 2000,
    city: "Curitiba",
    state: "PR",
  },
  {
    id: "5",
    name: "Pedro Souza",
    artisticName: "Pedro Sound",
    type: "Técnico de Som",
    rating: 4.5,
    instruments: [],
    services: ["Sonorização de Eventos", "Mixagem ao Vivo", "Montagem de Equipamentos"],
    hourlyRate: 120,
    eventRate: 950,
    city: "São Paulo",
    state: "SP",
  },
  {
    id: "6",
    name: "Juliana Costa",
    artisticName: "Ju Lights",
    type: "Técnico de Luz",
    rating: 4.4,
    instruments: [],
    services: ["Iluminação para Eventos", "Desenho de Luz", "Operação de Mesa"],
    hourlyRate: 130,
    eventRate: 900,
    city: "Rio de Janeiro",
    state: "RJ",
  }
];

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
        (professional.instruments?.some(instrument => instrument.toLowerCase().includes(searchLower)) || false)
      );
    }
    
    // Active type filter
    if (activeType && matches) {
      matches = matches && professional.type.toLowerCase() === activeType.toLowerCase();
    }
    
    // City filter
    if (filters.city && filters.city !== "all" && matches) {
      matches = matches && professional.city.toLowerCase() === filters.city.toLowerCase();
    }
    
    // State filter
    if (filters.state && filters.state !== "all" && matches) {
      matches = matches && professional.state.toLowerCase() === filters.state.toLowerCase();
    }
    
    // Min price filter
    if (filters.minPrice && matches) {
      const minPrice = parseInt(filters.minPrice);
      matches = matches && !isNaN(minPrice) && (professional.hourlyRate >= minPrice || professional.eventRate >= minPrice);
    }
    
    // Max price filter
    if (filters.maxPrice && matches) {
      const maxPrice = parseInt(filters.maxPrice);
      matches = matches && !isNaN(maxPrice) && (professional.hourlyRate <= maxPrice || professional.eventRate <= maxPrice);
    }
    
    // Rating filter
    if (filters.rating && filters.rating !== "any" && matches) {
      const rating = parseInt(filters.rating);
      matches = matches && !isNaN(rating) && professional.rating >= rating;
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
                <Select
                  value={filters.city}
                  onValueChange={(value) => setFilters({ ...filters, city: value })}
                >
                  <SelectTrigger className="bg-toca-background border-toca-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Curitiba">Curitiba</SelectItem>
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
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                  </SelectContent>
                </Select>
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
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((professional) => (
            <ProfileCard
              key={professional.id}
              professional={professional}
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
