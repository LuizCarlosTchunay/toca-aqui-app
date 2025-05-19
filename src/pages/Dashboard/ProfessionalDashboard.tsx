
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, CheckCheck, Clock, AlertTriangle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import ImageUploader from "@/components/ImageUploader";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
    case "confirmada":
      return "bg-green-500/20 text-green-500 border-green-500/50";
    case "pending":
    case "pendente":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    case "rejected":
    case "recusada":
      return "bg-red-500/20 text-red-500 border-red-500/50";
    default:
      return "bg-blue-500/20 text-blue-500 border-blue-500/50";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
    case "confirmada":
      return <CheckCheck size={14} />;
    case "pending":
    case "pendente":
      return <Clock size={14} />;
    case "rejected":
    case "recusada":
      return <AlertTriangle size={14} />;
    default:
      return null;
  }
};

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get professional profile data
  const { data: professionalData } = useQuery({
    queryKey: ['professionalProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching professional profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  // Fetch upcoming bookings
  const { data: upcomingBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['professionalReservations', professionalData?.id],
    queryFn: async () => {
      if (!professionalData?.id) return [];
      
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          id, 
          status, 
          data_reserva,
          eventos(id, titulo, data, local)
        `)
        .eq('profissional_id', professionalData.id)
        .order('data_reserva', { ascending: true });
        
      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
      
      return data.map(booking => ({
        id: booking.id,
        event: booking.eventos?.titulo || "Evento sem título",
        date: booking.eventos?.data || "",
        location: booking.eventos?.local || "",
        city: booking.eventos?.local?.split(',')[0] || "",
        state: booking.eventos?.local?.split(',')[1] || "",
        status: booking.status,
        payment: "pending", // Default until we implement payment status
        value: 0 // Default until we implement pricing
      }));
    },
    enabled: !!professionalData?.id
  });
  
  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['professionalApplications', professionalData?.id],
    queryFn: async () => {
      if (!professionalData?.id) return [];
      
      const { data, error } = await supabase
        .from('candidaturas')
        .select(`
          id,
          status,
          data_candidatura,
          eventos(id, titulo, data, local)
        `)
        .eq('profissional_id', professionalData.id)
        .order('data_candidatura', { ascending: false });
        
      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
      
      return data.map(app => ({
        id: app.id,
        event: app.eventos?.titulo || "Evento sem título",
        date: app.eventos?.data || "",
        location: app.eventos?.local || "",
        city: app.eventos?.local?.split(',')[0] || "",
        state: app.eventos?.local?.split(',')[1] || "",
        status: app.status || "pendente",
        applied: app.data_candidatura || ""
      }));
    },
    enabled: !!professionalData?.id
  });

  // Format the professional data for the profile section
  const professional = professionalData ? {
    name: professionalData.nome_artistico || "Profissional",
    image: "", // Will be handled by ImageUploader
    city: professionalData.cidade || "",
    state: professionalData.estado || "",
    hourlyRate: professionalData.cache_hora || 0,
    eventRate: professionalData.cache_evento || 0,
    services: professionalData.servicos || professionalData.instrumentos || [],
  } : {
    name: "Profissional",
    image: "",
    city: "",
    state: "",
    hourlyRate: 0,
    eventRate: 0,
    services: [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Profissional</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Seus Próximos Eventos</span>
                <Badge className="bg-toca-accent border-toca-accent">
                  {upcomingBookings.filter(b => b.status === 'confirmada').length} confirmados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.event}</h3>
                          <div className="flex items-center gap-2 text-sm text-toca-text-secondary mt-1">
                            <Calendar size={14} />
                            <span>{booking.date}</span>
                          </div>
                          <div className="text-sm text-toca-text-secondary mt-1">
                            {booking.city}, {booking.state}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status === "confirmada" ? "Confirmado" : "Pendente"}
                            </span>
                          </Badge>
                          <div className="text-sm text-toca-text-secondary mt-1">
                            {booking.payment === "paid" ? "Pagamento recebido" : "Pagamento pendente"}
                          </div>
                          {booking.value > 0 && (
                            <div className="font-medium text-toca-accent mt-1">
                              R${booking.value}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-toca-accent p-0 h-auto mt-2" 
                        onClick={() => navigate(`/reservas/${booking.id}`)}
                      >
                        Ver detalhes <ChevronRight size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-toca-text-secondary mb-4">Você ainda não tem reservas confirmadas.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-toca-card border-toca-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Suas Candidaturas</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                  onClick={() => navigate("/minhas-candidaturas")}
                >
                  Ver todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{application.event}</h3>
                          <div className="flex items-center gap-2 text-sm text-toca-text-secondary mt-1">
                            <Calendar size={14} />
                            <span>{application.date}</span>
                          </div>
                          <div className="text-sm text-toca-text-secondary mt-1">
                            {application.city}, {application.state}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(application.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {application.status === "confirmada" ? "Aprovada" : 
                               application.status === "recusada" ? "Recusada" : "Em análise"}
                            </span>
                          </Badge>
                          <div className="text-xs text-toca-text-secondary mt-1">
                            Enviada em {new Date(application.applied).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-toca-accent p-0 h-auto mt-2" 
                        onClick={() => navigate(`/eventos/${application.id}`)}
                      >
                        Ver evento <ChevronRight size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-toca-text-secondary mb-4">Você ainda não enviou candidaturas.</p>
                  <Button 
                    className="bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/eventos")}
                  >
                    Explorar eventos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle>Seu Perfil Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  {professionalData?.id && (
                    <ImageUploader 
                      size="md"
                      bucketName="profile_images"
                      objectPath={`professionals/${professionalData.id}`}
                      onImageChange={(file, url) => {
                        // Image change is handled by ImageUploader component
                        console.log("Profile image updated");
                      }}
                    />
                  )}
                </div>
                
                <h3 className="font-bold text-lg mb-1">{professional.name}</h3>
                <div className="text-sm text-toca-text-secondary mb-4">
                  {professional.city && professional.state 
                    ? `${professional.city}, ${professional.state}` 
                    : "Adicione sua localização"}
                </div>

                {/* Display services if any */}
                {professional.services && professional.services.length > 0 && (
                  <div className="w-full mb-4">
                    <h4 className="text-sm text-toca-text-secondary mb-2">Serviços:</h4>
                    <div className="flex flex-wrap gap-1">
                      {professional.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} className="bg-toca-background/70 text-white text-xs">
                          {service}
                        </Badge>
                      ))}
                      {professional.services.length > 3 && (
                        <Badge className="bg-toca-background/70 text-white text-xs">
                          +{professional.services.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <div className="text-center p-2 bg-toca-background rounded">
                    <div className="text-xs text-toca-text-secondary">Por hora</div>
                    <div className="font-semibold text-toca-accent">
                      {professional.hourlyRate ? `R$${professional.hourlyRate}` : "N/A"}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-toca-background rounded">
                    <div className="text-xs text-toca-text-secondary">Por evento</div>
                    <div className="font-semibold text-toca-accent">
                      {professional.eventRate ? `R$${professional.eventRate}` : "N/A"}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-toca-accent hover:bg-toca-accent-hover mb-2"
                  onClick={() => navigate("/editar-perfil")}
                >
                  Editar perfil
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-toca-border"
                  onClick={() => professionalData?.id && navigate(`/profissional/${professionalData.id}`)}
                >
                  Ver como visitante
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-toca-card border-toca-border">
            <CardHeader>
              <CardTitle>Eventos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Fetch recommended events from the database in the future */}
              <div className="text-center py-10">
                <p className="text-toca-text-secondary mb-4">Eventos recomendados aparecerão aqui.</p>
                <Button 
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  onClick={() => navigate("/eventos")}
                >
                  Ver eventos disponíveis
                </Button>
              </div>
              
              <Button 
                variant="link" 
                className="w-full text-toca-accent mt-4"
                onClick={() => navigate("/eventos")}
              >
                Ver mais eventos <ChevronRight size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
