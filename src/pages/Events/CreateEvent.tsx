import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: "",
    state: "",
    services: {
      dj: false,
      musico: false,
      fotografo: false,
      filmmaker: false,
      tecnico_som: false,
      tecnico_luz: false,
    }
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Você precisa estar logado para criar um evento");
        navigate("/login");
        return;
      }
      setUserId(data.session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Você precisa estar logado para criar um evento");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    // Transformar serviços marcados em um array
    const requiredServices = Object.entries(formData.services)
      .filter(([_, isSelected]) => isSelected)
      .map(([service, _]) => {
        switch (service) {
          case "dj": return "DJ";
          case "musico": return "Músico";
          case "fotografo": return "Fotógrafo";
          case "filmmaker": return "Filmmaker";
          case "tecnico_som": return "Técnico de Som";
          case "tecnico_luz": return "Técnico de Luz";
          default: return service;
        }
      });

    try {
      const { error } = await supabase
        .from("events")
        .insert({
          creator_id: userId,
          name: formData.name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          city: formData.city,
          state: formData.state,
          is_public: isPublic,
          required_services: requiredServices,
        });

      if (error) {
        console.error("Erro ao criar evento:", error);
        toast.error("Erro ao criar evento. Tente novamente.");
      } else {
        toast.success("Evento criado com sucesso!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!userId} currentRole="contratante" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Criar Novo Evento</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome do Evento</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Casamento Silva, Festival de Verão, etc." 
                  className="bg-toca-background border-toca-border text-white"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva os detalhes do seu evento..." 
                  className="bg-toca-background border-toca-border text-white min-h-[120px]"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">Data</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                    <Input 
                      id="date" 
                      type="date" 
                      className="bg-toca-background border-toca-border text-white pl-10"
                      required
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white">Horário</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    className="bg-toca-background border-toca-border text-white"
                    required
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Local</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                  <Input 
                    id="location" 
                    placeholder="Nome do local" 
                    className="bg-toca-background border-toca-border text-white pl-10"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">Cidade</Label>
                  <Input 
                    id="city" 
                    placeholder="Nome da cidade" 
                    className="bg-toca-background border-toca-border text-white"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">Estado</Label>
                  <Input 
                    id="state" 
                    placeholder="Digite o estado" 
                    className="bg-toca-background border-toca-border text-white"
                    required
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Serviços Necessários</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dj" 
                      checked={formData.services.dj}
                      onCheckedChange={(checked) => handleServiceChange("dj", checked as boolean)}
                    />
                    <Label htmlFor="dj" className="text-sm cursor-pointer text-white">DJ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="musico" 
                      checked={formData.services.musico}
                      onCheckedChange={(checked) => handleServiceChange("musico", checked as boolean)}
                    />
                    <Label htmlFor="musico" className="text-sm cursor-pointer text-white">Músico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fotografo" 
                      checked={formData.services.fotografo}
                      onCheckedChange={(checked) => handleServiceChange("fotografo", checked as boolean)}
                    />
                    <Label htmlFor="fotografo" className="text-sm cursor-pointer text-white">Fotógrafo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filmmaker" 
                      checked={formData.services.filmmaker}
                      onCheckedChange={(checked) => handleServiceChange("filmmaker", checked as boolean)}
                    />
                    <Label htmlFor="filmmaker" className="text-sm cursor-pointer text-white">Filmmaker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tecnico_som" 
                      checked={formData.services.tecnico_som}
                      onCheckedChange={(checked) => handleServiceChange("tecnico_som", checked as boolean)}
                    />
                    <Label htmlFor="tecnico_som" className="text-sm cursor-pointer text-white">Técnico de Som</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tecnico_luz" 
                      checked={formData.services.tecnico_luz}
                      onCheckedChange={(checked) => handleServiceChange("tecnico_luz", checked as boolean)}
                    />
                    <Label htmlFor="tecnico_luz" className="text-sm cursor-pointer text-white">Técnico de Luz</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isPublic" 
                  checked={isPublic} 
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)} 
                />
                <Label htmlFor="isPublic" className="cursor-pointer text-white">
                  Tornar evento público (profissionais poderão se candidatar)
                </Label>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando..." : "Criar Evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
