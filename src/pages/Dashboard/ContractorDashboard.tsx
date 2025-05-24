import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCard from "@/components/ProfileCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, Music, Film, Camera, Disc, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch upcoming events
  const { data: upcomingEvents = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['userEvents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("Fetching events for user:", user.id);
      
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("contratante_id", user.id)
        .order("data", { ascending: true })
        .limit(3);
      
      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }
      
      console.log("Raw events data:", data);
      
      return data.map(event => {
        const mappedEvent = {
          id: event.id,
          name: event.titulo || "",
          description: event.descricao || "",
          date: event.data || "",
          time: "", 
          location: event.local || "",
          city: event.local?.split(",")[0] || "",
          state: event.local?.split(",")[1] || "",
          services: event.servicos_requeridos || [],
          image: event.imagem_url
        };
        console.log("Mapped event:", mappedEvent);
        return mappedEvent;
      });
    },
    enabled: !!user
  });

  // Function to handle the delete dialog opening
  const handleOpenDeleteDialog = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };

  // Function to delete an event
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);

    try {
      // Delete any applications (candidaturas) associated with this event
      const { error: applicationsError } = await supabase
        .from("candidaturas")
        .delete()
        .eq("evento_id", eventToDelete);

      if (applicationsError) {
        console.error("Error deleting applications:", applicationsError);
        toast.error("Erro ao excluir candidaturas relacionadas. Por favor, tente novamente.");
        setIsDeleting(false);
        return;
      }

      // Now delete the event
      const { error } = await supabase
        .from("eventos")
        .delete()
        .eq("id", eventToDelete);

      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Erro ao excluir evento. Por favor, tente novamente.");
        setIsDeleting(false);
        return;
      }

      toast.success("Evento excluído com sucesso!");
      
      // Update the UI by filtering out the deleted event
      refetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Erro ao excluir evento. Por favor, tente novamente.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // Fetch recommended professionals
  const { data: recommendedProfessionals = [], isLoading: professionalsLoading } = useQuery({
    queryKey: ['recommendedProfessionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profissionais")
        .select(`
          id,
          nome_artistico,
          tipo_profissional,
          instrumentos,
          cidade,
          estado,
          cache_hora,
          cache_evento
        `)
        .order("id", { ascending: false })
        .limit(2);
      
      if (error) {
        console.error("Error fetching professionals:", error);
        return [];
      }
      
      return data.map(pro => ({
        id: pro.id,
        name: pro.nome_artistico || "Profissional",
        artisticName: pro.nome_artistico || "Profissional",
        type: pro.tipo_profissional || "Músico",
        rating: 4.7, 
        services: pro.instrumentos || [],
        hourlyRate: pro.cache_hora,
        eventRate: pro.cache_evento,
        city: pro.cidade || "",
        state: pro.estado || "",
      }));
    }
  });

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
              {eventsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      className="cursor-pointer"
                      onClick={() => navigate(`/eventos/${event.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-white mb-4">Você ainda não tem eventos.</p>
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
              {professionalsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : recommendedProfessionals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedProfessionals.map((professional) => (
                    <ProfileCard
                      key={professional.id}
                      professional={professional}
                      onClick={() => navigate(`/profissional/${professional.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-toca-text-secondary mb-4">Nenhum profissional encontrado.</p>
                  <Button 
                    className="bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/explorar")}
                  >
                    Explorar profissionais
                  </Button>
                </div>
              )}
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
              {eventsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
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

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita e removerá todas as candidaturas associadas ao evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Excluindo...
                </>
              ) : (
                "Excluir evento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractorDashboard;
