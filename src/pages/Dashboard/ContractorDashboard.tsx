
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCard from "@/components/ProfileCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, Music, Film, Camera, Disc } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data
const recommendedProfessionals = [
  {
    id: "1",
    name: "João Silva",
    artisticName: "DJ Pulse",
    type: "DJ",
    rating: 4.8,
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
    services: ["Fotografia", "Edição", "Cobertura de Eventos"],
    hourlyRate: 200,
    eventRate: 1500,
    city: "Rio de Janeiro",
    state: "RJ",
  },
];

const upcomingEvents = [
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
];

const ContractorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Contratante</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Seus Próximos Eventos</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                  onClick={() => navigate("/criar-evento")}
                >
                  <Plus size={16} className="mr-1" /> Criar Evento
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{event.name}</h3>
                        <span className="text-toca-accent text-sm">{event.date}</span>
                      </div>
                      <div className="text-sm text-toca-text-secondary mb-2">
                        {event.city}, {event.state}
                      </div>
                      <Button 
                        variant="link" 
                        className="text-toca-accent p-0 h-auto" 
                        onClick={() => navigate(`/eventos/${event.id}`)}
                      >
                        Ver detalhes <ChevronRight size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-toca-text-secondary mb-4">Você ainda não tem eventos.</p>
                  <Button 
                    className="bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/criar-evento")}
                  >
                    <Plus size={16} className="mr-1" /> Criar seu primeiro evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-toca-card border-toca-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profissionais Recomendados</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                  onClick={() => navigate("/explorar")}
                >
                  Ver todos
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedProfessionals.map((professional) => (
                  <ProfileCard
                    key={professional.id}
                    professional={professional}
                    onClick={() => navigate(`/profissional/${professional.id}`)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle>Serviços em Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex-col h-auto py-6 border-toca-border hover:border-toca-accent"
                  onClick={() => navigate("/explorar?tipo=musico")}
                >
                  <Music size={24} className="mb-2 text-toca-accent" />
                  <span>Músicos</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-toca-border hover:border-toca-accent"
                  onClick={() => navigate("/explorar?tipo=dj")}
                >
                  <Disc size={24} className="mb-2 text-toca-accent" />
                  <span>DJs</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-toca-border hover:border-toca-accent"
                  onClick={() => navigate("/explorar?tipo=fotografo")}
                >
                  <Camera size={24} className="mb-2 text-toca-accent" />
                  <span>Fotógrafos</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-toca-border hover:border-toca-accent"
                  onClick={() => navigate("/explorar?tipo=filmmaker")}
                >
                  <Film size={24} className="mb-2 text-toca-accent" />
                  <span>Filmmakers</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-toca-card border-toca-border">
            <CardHeader>
              <CardTitle>Eventos Públicos</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <>
                  <EventCard 
                    event={upcomingEvents[0]} 
                    onClick={() => navigate(`/eventos/${upcomingEvents[0].id}`)}
                    onApply={() => {
                      toast.success("Candidatura enviada com sucesso!");
                    }}
                  />
                  <Button 
                    variant="link" 
                    className="w-full text-toca-accent mt-2"
                    onClick={() => navigate("/eventos")}
                  >
                    Ver todos os eventos <ChevronRight size={16} />
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-toca-text-secondary">Nenhum evento disponível.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
