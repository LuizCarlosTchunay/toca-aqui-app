
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Mail, Phone, Calendar, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const MyProfile = () => {
  const navigate = useNavigate();
  const [isProfessional, setIsProfessional] = useState(false);
  
  // Mock user data
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    createdAt: "Janeiro 2024",
    city: "São Paulo",
    state: "SP",
    bio: "Apaixonado por música e eventos culturais.",
    image: ""
  };

  const handleBecomeProfessional = () => {
    // In a real app, we would make an API call to update the user's status
    setIsProfessional(true);
    toast.success("Parabéns! Agora você é um profissional e pode aparecer na aba Explorar.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6 bg-black text-toca-accent hover:bg-gray-800"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="text-4xl bg-toca-accent/20 text-toca-accent">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
                  <div className="flex items-center text-toca-text-secondary mb-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{user.city}, {user.state}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover mb-3"
                    onClick={() => navigate("/editar-perfil")}
                  >
                    Editar Perfil
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full bg-black text-white hover:bg-gray-800 mb-3"
                    onClick={() => navigate("/configuracoes")}
                  >
                    Configurações
                  </Button>

                  {!isProfessional && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full bg-toca-background border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                        >
                          <UserPlus size={16} className="mr-2" /> Tornar-se Profissional
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-toca-card border-toca-border text-white">
                        <DialogHeader>
                          <DialogTitle className="text-toca-accent">Tornar-se um Profissional</DialogTitle>
                          <DialogDescription className="text-toca-text-secondary">
                            Como profissional, você poderá oferecer seus serviços, candidatar-se a eventos e aparecer na aba Explorar.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 text-toca-text-primary">
                          <p className="mb-2">Ao se tornar um profissional, você precisará:</p>
                          <ul className="list-disc pl-5 space-y-1 text-toca-text-secondary">
                            <li>Completar seu perfil profissional</li>
                            <li>Adicionar seus serviços e preços</li>
                            <li>Enviar documentos para verificação</li>
                          </ul>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleBecomeProfessional} className="bg-toca-accent hover:bg-toca-accent-hover">
                            Continuar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {isProfessional && (
                    <Button 
                      variant="outline" 
                      className="w-full bg-toca-background border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                      onClick={() => navigate("/perfil-profissional")}
                    >
                      Ver Perfil Profissional
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Email</div>
                  <div className="flex items-center text-white">
                    <Mail size={16} className="mr-2 text-toca-text-secondary" />
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Telefone</div>
                  <div className="flex items-center text-white">
                    <Phone size={16} className="mr-2 text-toca-text-secondary" />
                    {user.phone}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-toca-text-secondary mb-1">Membro desde</div>
                  <div className="flex items-center text-white">
                    <Calendar size={16} className="mr-2 text-toca-text-secondary" />
                    {user.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-toca-text-primary">{user.bio}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-toca-card border-toca-border">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-toca-border rounded-md">
                    <h4 className="font-medium text-white">Evento criado</h4>
                    <div className="text-xs text-toca-text-secondary mb-1">Festival de Verão</div>
                    <div className="text-sm text-toca-text-primary">15/01/2025</div>
                  </div>
                  
                  <div className="p-3 border border-toca-border rounded-md">
                    <h4 className="font-medium text-white">Profissional contratado</h4>
                    <div className="text-xs text-toca-text-secondary mb-1">DJ Pulse</div>
                    <div className="text-sm text-toca-text-primary">10/01/2025</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
