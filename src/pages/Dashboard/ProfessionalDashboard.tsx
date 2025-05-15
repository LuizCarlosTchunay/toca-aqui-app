
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, CheckCheck, Clock, AlertTriangle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const upcomingBookings = [
  {
    id: "1",
    event: "Casamento Silva",
    date: "15/06/2025",
    time: "19:00",
    location: "Buffet Estrela",
    city: "São Paulo",
    state: "SP",
    status: "confirmed",
    payment: "paid",
    value: 1500
  },
  {
    id: "2",
    event: "Aniversário Empresarial",
    date: "22/06/2025",
    time: "20:00",
    location: "Hotel Continental",
    city: "São Paulo",
    state: "SP",
    status: "pending",
    payment: "pending",
    value: 1200
  }
];

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
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
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
    case "confirmed":
      return <CheckCheck size={14} />;
    case "pending":
      return <Clock size={14} />;
    case "rejected":
      return <AlertTriangle size={14} />;
    default:
      return null;
  }
};

const ProfessionalDashboard = () => {
  const navigate = useNavigate();

  // Mock user data for the professional
  const professional = {
    name: "DJ Pulse",
    image: "", // In a real app, this would be a URL to the user's profile image
    city: "São Paulo",
    state: "SP",
    hourlyRate: 150,
    eventRate: 1200
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
                <Badge className="bg-toca-accent border-toca-accent">2 confirmados</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.event}</h3>
                          <div className="flex items-center gap-2 text-sm text-toca-text-secondary mt-1">
                            <Calendar size={14} />
                            <span>{booking.date} às {booking.time}</span>
                          </div>
                          <div className="text-sm text-toca-text-secondary mt-1">
                            {booking.city}, {booking.state}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status === "confirmed" ? "Confirmado" : "Pendente"}
                            </span>
                          </Badge>
                          <div className="text-sm text-toca-text-secondary mt-1">
                            {booking.payment === "paid" ? "Pagamento recebido" : "Pagamento pendente"}
                          </div>
                          <div className="font-medium text-toca-accent mt-1">
                            R${booking.value}
                          </div>
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
              {applications.length > 0 ? (
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
                              {application.status === "confirmed" ? "Aprovada" : 
                               application.status === "rejected" ? "Recusada" : "Em análise"}
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
                  <Avatar className="w-20 h-20 border-2 border-toca-accent">
                    <AvatarImage src={professional.image} />
                    <AvatarFallback className="text-2xl bg-toca-accent/20 text-toca-accent">
                      {professional.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full border-toca-accent bg-toca-card text-toca-accent hover:bg-toca-accent hover:text-white"
                    onClick={() => navigate("/editar-perfil")}
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{professional.name}</h3>
                <div className="text-sm text-toca-text-secondary mb-4">{professional.city}, {professional.state}</div>
                
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <div className="text-center p-2 bg-toca-background rounded">
                    <div className="text-xs text-toca-text-secondary">Por hora</div>
                    <div className="font-semibold text-toca-accent">R${professional.hourlyRate}</div>
                  </div>
                  <div className="text-center p-2 bg-toca-background rounded">
                    <div className="text-xs text-toca-text-secondary">Por evento</div>
                    <div className="font-semibold text-toca-accent">R${professional.eventRate}</div>
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
                  onClick={() => navigate("/perfil-profissional")}
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
              <div className="space-y-3">
                <div className="p-3 border border-toca-border rounded-md">
                  <h4 className="font-medium">Festival de Verão</h4>
                  <div className="text-sm text-toca-text-secondary mt-1 mb-2">
                    15/01/2025 • São Paulo
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/eventos/1")}
                  >
                    Ver detalhes
                  </Button>
                </div>
                
                <div className="p-3 border border-toca-border rounded-md">
                  <h4 className="font-medium">Feira Cultural</h4>
                  <div className="text-sm text-toca-text-secondary mt-1 mb-2">
                    20/07/2025 • Rio de Janeiro
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/eventos/2")}
                  >
                    Ver detalhes
                  </Button>
                </div>
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
