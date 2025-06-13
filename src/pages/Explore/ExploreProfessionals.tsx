
import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [hasOngoingReservation, setHasOngoingReservation] = useState(false);

  // Check if there's an ongoing reservation
  useEffect(() => {
    const savedBookingDetails = localStorage.getItem('currentBookingDetails');
    if (savedBookingDetails) {
      setHasOngoingReservation(true);
    }
  }, []);

  const { data: professionals = [], isLoading, isError } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
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

  const handleClearOngoingReservation = () => {
    localStorage.removeItem('currentBookingDetails');
    setHasOngoingReservation(false);
  };

  // Filter professionals based on search term only
  const filteredProfessionals = professionals.filter(professional => {
    if (!searchTerm) return true;
    
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
    
    return stringMatches || arrayMatches;
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

      {hasOngoingReservation && (
        <Card className="bg-toca-accent/10 border-toca-accent mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-toca-accent" size={20} />
                <div>
                  <p className="text-white font-medium">Reserva em andamento</p>
                  <p className="text-toca-text-secondary text-sm">
                    Você pode adicionar profissionais à reserva existente ou começar uma nova
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearOngoingReservation}
                className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
              >
                Cancelar Reserva
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={18} />
          <Input
            placeholder="Buscar profissionais..."
            className="bg-toca-card border-toca-border text-white pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            <p className="text-toca-text-secondary mb-4">Nenhum profissional encontrado.</p>
            <Button 
              className="bg-black text-toca-accent hover:bg-gray-900"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreProfessionals;
