
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, Clock, AlertTriangle, CheckCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createNotification } from "@/utils/notifications";

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancellingApplications, setCancellingApplications] = useState<Set<string>>(new Set());

  // Fetch professional data to get professional ID
  const { data: professionalData } = useQuery({
    queryKey: ['professionalProfile', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user found for professional profile");
        return null;
      }
      
      console.log("Fetching professional profile for user:", user.id);
      
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching professional profile:', error);
        return null;
      }
      
      console.log("Professional profile found:", data);
      return data;
    },
    enabled: !!user
  });

  // Fetch real applications from Supabase - ONLY real data
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myRealApplications', professionalData?.id],
    queryFn: async () => {
      if (!professionalData?.id) {
        console.log("No professional ID found, returning empty applications");
        return [];
      }
      
      console.log("Fetching real applications for professional:", professionalData.id);
      
      // First get applications from candidaturas table
      const { data: candidaturas, error: candidaturasError } = await supabase
        .from('candidaturas')
        .select('id, status, data_candidatura, mensagem, evento_id')
        .eq('profissional_id', professionalData.id)
        .order('data_candidatura', { ascending: false });
        
      if (candidaturasError) {
        console.error('Error fetching real applications:', candidaturasError);
        return [];
      }
      
      if (!candidaturas || candidaturas.length === 0) {
        console.log("No real applications found for professional:", professionalData.id);
        return [];
      }
      
      console.log("Found real applications:", candidaturas);
      
      // Get unique event IDs
      const eventoIds = [...new Set(candidaturas.map(c => c.evento_id).filter(Boolean))];
      
      if (eventoIds.length === 0) {
        console.log("No event IDs found in applications");
        return [];
      }
      
      console.log("Fetching events for IDs:", eventoIds);
      
      // Then get events for those applications
      const { data: eventos, error: eventosError } = await supabase
        .from('eventos')
        .select('id, titulo, data, local, contratante_id')
        .in('id', eventoIds);
        
      if (eventosError) {
        console.error('Error fetching events for applications:', eventosError);
        return [];
      }
      
      console.log("Found events for applications:", eventos);
      
      // Combine the real data
      const realApplications = candidaturas.map(app => {
        const evento = eventos?.find(e => e.id === app.evento_id);
        
        if (!evento) {
          console.warn("Event not found for application:", app.id);
          return null;
        }
        
        return {
          id: app.id,
          event: evento.titulo || "Evento sem título",
          date: evento.data ? new Date(evento.data).toLocaleDateString('pt-BR') : "Data não definida",
          location: evento.local || "Local não definido",
          city: evento.local?.split(',')[0]?.trim() || "Cidade não definida",
          state: evento.local?.split(',')[1]?.trim() || "",
          status: app.status || "pendente",
          applied: app.data_candidatura ? new Date(app.data_candidatura).toLocaleDateString('pt-BR') : "Data não definida",
          eventId: evento.id,
          message: app.mensagem || "",
          contractorId: evento.contratante_id || ""
        };
      }).filter(Boolean); // Remove null entries
      
      console.log("Final real applications data:", realApplications);
      return realApplications;
    },
    enabled: !!professionalData?.id
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
      case "aprovada":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "recusada":
      case "cancelada":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmada":
      case "aprovada":
        return <CheckCheck size={14} />;
      case "pendente":
        return <Clock size={14} />;
      case "recusada":
      case "cancelada":
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmada":
      case "aprovada":
        return "Aprovada";
      case "pendente":
        return "Em análise";
      case "recusada":
        return "Recusada";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  const handleCancelApplication = async (applicationId: string, contractorId: string, eventTitle: string) => {
    if (!user || !professionalData) {
      toast.error("Erro: usuário não autenticado");
      return;
    }

    console.log("Cancelling application:", applicationId);

    // Add to cancelling set to show loading state
    setCancellingApplications(prev => new Set(prev).add(applicationId));

    try {
      const { error } = await supabase
        .from('candidaturas')
        .update({ status: 'cancelada' })
        .eq('id', applicationId)
        .eq('profissional_id', professionalData.id); // Extra security check

      if (error) {
        console.error('Error cancelling application:', error);
        toast.error("Erro ao cancelar candidatura");
        return;
      }

      console.log("Application cancelled successfully");

      // Create notification for the contractor
      if (contractorId) {
        console.log("Creating notification for contractor:", contractorId);
        await createNotification(
          contractorId,
          "application",
          "Candidatura cancelada",
          `Um profissional cancelou sua candidatura para o evento "${eventTitle}".`,
          `/eventos/${applications.find(app => app.id === applicationId)?.eventId}`
        );
      }

      // Refresh the applications list
      queryClient.invalidateQueries({ queryKey: ['myRealApplications', professionalData.id] });
      toast.success("Candidatura cancelada com sucesso");

    } catch (err) {
      console.error('Error cancelling application:', err);
      toast.error("Erro ao cancelar candidatura");
    } finally {
      // Remove from cancelling set
      setCancellingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={true} currentRole="profissional" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="profissional" />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar ao dashboard
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Minhas Candidaturas</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle>Candidaturas Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="p-4 border border-toca-border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{application.event}</h3>
                        <div className="flex items-center gap-2 text-sm text-toca-text-secondary mt-1">
                          <Calendar size={14} />
                          <span>{application.date}</span>
                        </div>
                        <div className="text-sm text-toca-text-secondary mt-1">
                          {application.location}
                        </div>
                        {application.message && (
                          <div className="text-sm text-toca-text-secondary mt-2 p-2 bg-toca-background rounded">
                            <strong>Mensagem:</strong> {application.message}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {getStatusText(application.status)}
                          </span>
                        </Badge>
                        <div className="text-xs text-toca-text-secondary mt-1">
                          Enviada em {application.applied}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="link" 
                        className="text-toca-accent p-0 h-auto" 
                        onClick={() => navigate(`/eventos/${application.eventId}`)}
                      >
                        Ver evento
                      </Button>
                      
                      {application.status === "pendente" && (
                        <Button 
                          variant="outline" 
                          className="ml-4 text-red-400 border-red-400 hover:bg-red-400/10"
                          size="sm"
                          disabled={cancellingApplications.has(application.id)}
                          onClick={() => handleCancelApplication(application.id, application.contractorId, application.event)}
                        >
                          {cancellingApplications.has(application.id) ? "Cancelando..." : "Cancelar candidatura"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-toca-text-secondary mb-4">Você ainda não enviou candidaturas reais.</p>
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
    </div>
  );
};

export default MyApplications;
