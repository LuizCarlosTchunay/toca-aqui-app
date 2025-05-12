
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, Clock, AlertTriangle, CheckCheck } from "lucide-react";

const MyApplications = () => {
  const navigate = useNavigate();
  
  // Mock data for applications
  const applications = [
    {
      id: "1",
      event: "Festival de Verão",
      date: "15/01/2025",
      location: "Parque Municipal",
      city: "São Paulo",
      state: "SP",
      status: "pending",
      applied: "03/05/2025"
    },
    {
      id: "2",
      event: "Feira Cultural",
      date: "20/07/2025",
      location: "Centro de Exposições",
      city: "Rio de Janeiro",
      state: "RJ",
      status: "rejected",
      applied: "01/05/2025"
    },
    {
      id: "3",
      event: "Aniversário Corporativo",
      date: "22/06/2025",
      location: "Hotel Continental",
      city: "São Paulo",
      state: "SP",
      status: "approved",
      applied: "10/05/2025"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCheck size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "rejected":
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovada";
      case "pending":
        return "Em análise";
      case "rejected":
        return "Recusada";
      default:
        return "Desconhecido";
    }
  };

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
                          {application.city}, {application.state}
                        </div>
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
                    <Button 
                      variant="link" 
                      className="text-toca-accent p-0 h-auto mt-2" 
                      onClick={() => navigate(`/eventos/${application.id}`)}
                    >
                      Ver evento
                    </Button>
                    
                    {application.status === "pending" && (
                      <Button 
                        variant="outline" 
                        className="ml-4 text-red-400 border-red-400 hover:bg-red-400/10"
                        size="sm" 
                      >
                        Cancelar candidatura
                      </Button>
                    )}
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
    </div>
  );
};

export default MyApplications;
