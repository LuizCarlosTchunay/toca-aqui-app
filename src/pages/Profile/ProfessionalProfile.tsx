
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  
  // Mock data for the professional profile
  const professional = {
    id: "1",
    name: "João Silva",
    artisticName: "DJ Pulse",
    type: "DJ",
    rating: 4.8,
    reviewCount: 24,
    services: ["DJ", "Produção Musical", "Mixagem"],
    genres: ["Eletrônica", "House", "EDM"],
    hourlyRate: 150,
    eventRate: 1200,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    city: "São Paulo",
    state: "SP",
    bio: "DJ com mais de 10 anos de experiência em eventos corporativos, casamentos e festas. Especialista em música eletrônica, house e EDM. Equipamento de som próprio.",
    portfolio: ["Evento Corporativo XYZ", "Casamento Silva", "Festival de Verão 2024"]
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-toca-accent/20 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-toca-accent">DJ</span>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">{professional.artisticName}</h1>
                  <div className="text-toca-text-secondary mb-2">{professional.name}</div>
                  
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="text-white font-medium mr-1">{professional.rating}</span>
                    <span className="text-toca-text-secondary">({professional.reviewCount} avaliações)</span>
                  </div>
                  
                  <div className="flex items-center text-toca-text-secondary mb-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{professional.city}, {professional.state}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Clock size={14} className="inline mr-1" /> Por hora
                      </div>
                      <div className="font-semibold text-toca-accent">{formatCurrency(professional.hourlyRate)}</div>
                    </div>
                    <div className="text-center p-3 bg-toca-background rounded-md">
                      <div className="text-xs text-toca-text-secondary mb-1">
                        <Calendar size={14} className="inline mr-1" /> Por evento
                      </div>
                      <div className="font-semibold text-toca-accent">{formatCurrency(professional.eventRate)}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                    onClick={() => navigate("/reservar")}
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle className="text-lg">Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professional.services.map((service, index) => (
                    <Badge key={index} className="bg-toca-background border-toca-border text-white">
                      {service}
                    </Badge>
                  ))}
                </div>
                
                {professional.genres && (
                  <>
                    <h4 className="text-white font-medium mt-4 mb-2">Gêneros</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.genres.map((genre, index) => (
                        <Badge key={index} className="bg-toca-background border-toca-border text-white">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-toca-text-primary">{professional.bio}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {professional.portfolio.map((item, index) => (
                    <li key={index} className="p-3 bg-toca-background rounded-md text-white">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                {professional.reviewCount > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">Maria Oliveira</h4>
                          <div className="text-xs text-toca-text-secondary">Evento: Casamento</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="text-yellow-500 mr-1" size={14} />
                          <span className="text-white">5.0</span>
                        </div>
                      </div>
                      <p className="text-toca-text-primary text-sm">
                        Excelente profissional! Animou nossa festa do início ao fim. Recomendo!
                      </p>
                    </div>
                    
                    <div className="p-4 border border-toca-border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">Carlos Mendes</h4>
                          <div className="text-xs text-toca-text-secondary">Evento: Aniversário</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="text-yellow-500 mr-1" size={14} />
                          <span className="text-white">4.5</span>
                        </div>
                      </div>
                      <p className="text-toca-text-primary text-sm">
                        Muito bom, só atrasou um pouco mas o serviço foi de qualidade.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-toca-border text-toca-text-secondary"
                    >
                      Ver todas as avaliações
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-toca-text-secondary py-6">
                    Este profissional ainda não possui avaliações.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
