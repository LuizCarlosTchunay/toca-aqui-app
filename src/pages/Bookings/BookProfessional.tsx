import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, CircleDollarSign, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProfessionalTypeIcon from "@/components/profile/ProfessionalTypeIcon";

const BookProfessional = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bookingType, setBookingType] = useState("event");
  const [selectedEvent, setSelectedEvent] = useState("new");
  const [hours, setHours] = useState(4);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    city: "",
    state: "",
    details: ""
  });
  
  // Fetch professional data
  const { data: professional, isLoading, error } = useQuery({
    queryKey: ['professional-booking', id],
    queryFn: async () => {
      if (!id) throw new Error("Professional ID is required");
      
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
        `)
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching professional:", error);
        throw error;
      }
      
      // Return formatted professional data
      return {
        id: data.id,
        name: data.nome_artistico || "Profissional",
        artisticName: data.nome_artistico || "Profissional",
        type: data.tipo_profissional || "Músico",
        hourlyRate: data.cache_hora || 0,
        eventRate: data.cache_evento || 0,
        city: data.cidade || "",
        state: data.estado || "",
        services: data.servicos || [],
      };
    },
    enabled: !!id,
    retry: 1,
  });
  
  // Fetch user's events for dropdown
  const { data: userEvents = [] } = useQuery({
    queryKey: ['user-events'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("eventos")
        .select("id, titulo")
        .eq("contratante_id", user.id)
        .order("data", { ascending: false });
      
      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });
  
  // Update city/state with professional's data when it loads
  useEffect(() => {
    if (professional) {
      setBookingDetails(prev => ({
        ...prev,
        city: professional.city,
        state: professional.state
      }));
    }
  }, [professional]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para reservar um profissional");
      navigate("/login", { state: { redirectBack: `/reservar/${id}` } });
      return;
    }
    
    if (!bookingDetails.date || !bookingDetails.time || !bookingDetails.location) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    if (!professional) {
      toast.error("Não foi possível identificar o profissional selecionado");
      return;
    }
    
    // Create event name from location if using a new event
    const eventName = selectedEvent === "new" ? 
      `Evento em ${bookingDetails.location.split(',')[0]}` : 
      userEvents.find(event => event.id === selectedEvent)?.titulo || "Novo Evento";
    
    // Navigate to checkout with all necessary information
    navigate("/checkout", {
      state: {
        professionalId: id,
        bookingType,
        hours,
        bookingDetails: {
          ...bookingDetails,
          eventName,
          date: bookingDetails.date,
        }
      }
    });
    
    toast.success("Reserva adicionada ao carrinho!");
  };

  const handleAddMoreProfessionals = () => {
    if (!bookingDetails.date || !bookingDetails.time || !bookingDetails.location) {
      toast.error("Por favor, preencha os dados da reserva antes de adicionar mais profissionais");
      return;
    }
    
    // Save current booking details to localStorage for maintaining context
    localStorage.setItem('currentBookingDetails', JSON.stringify({
      bookingDetails,
      bookingType,
      hours,
      selectedEvent
    }));
    
    toast.success("Dados salvos! Agora você pode escolher outro profissional");
    navigate("/explorar");
  };

  // Calculate the estimated price based on booking type and hours
  const calculatePrice = () => {
    if (!professional) return 0;
    
    if (bookingType === "event") {
      return professional.eventRate;
    } else {
      return professional.hourlyRate * hours;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-white">Carregando dados do profissional...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl text-white mb-4">Erro ao carregar dados do profissional</h2>
            <Button 
              variant="outline" 
              className="mb-6 text-toca-text-secondary hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={18} className="mr-1" /> Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <h1 className="text-2xl font-bold mb-6 text-white">
          Reservar: {professional?.artisticName}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle className="text-white">Detalhes da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Tipo de Reserva</Label>
                    <RadioGroup 
                      defaultValue="event" 
                      className="flex flex-col sm:flex-row gap-4"
                      onValueChange={setBookingType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="event" id="event" />
                        <Label htmlFor="event" className="cursor-pointer text-white">Evento Completo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly" className="cursor-pointer text-white">Por Hora</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {bookingType === "hourly" && (
                    <div className="space-y-2">
                      <Label htmlFor="hours" className="text-white">Quantidade de Horas</Label>
                      <Input 
                        id="hours" 
                        type="number" 
                        min="1"
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                        className="bg-toca-background border-toca-border text-white w-32"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="selectEvent" className="text-white">Escolha um Evento</Label>
                    <Select 
                      value={selectedEvent} 
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger className="bg-toca-background border-toca-border text-white">
                        <SelectValue placeholder="Selecione um evento ou crie um novo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Criar Novo Evento</SelectItem>
                        {userEvents.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          value={bookingDetails.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-white">Horário</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                        <Input 
                          id="time" 
                          type="time" 
                          className="bg-toca-background border-toca-border text-white pl-10"
                          value={bookingDetails.time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Local</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                      <Input 
                        id="location" 
                        placeholder="Endereço do evento" 
                        className="bg-toca-background border-toca-border text-white pl-10"
                        value={bookingDetails.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">Cidade</Label>
                      <Input 
                        id="city" 
                        value={bookingDetails.city}
                        onChange={handleInputChange}
                        className="bg-toca-background border-toca-border text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">Estado</Label>
                      <Select 
                        value={bookingDetails.state} 
                        onValueChange={(value) => setBookingDetails(prev => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger className="bg-toca-background border-toca-border text-white">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="ES">ES</SelectItem>
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="DF">DF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="details" className="text-white">Detalhes Adicionais</Label>
                    <Textarea 
                      id="details" 
                      placeholder="Descreva detalhes importantes para o profissional..." 
                      className="bg-toca-background border-toca-border text-white min-h-[120px]"
                      value={bookingDetails.details}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(-1)}
                      className="border-toca-border text-white order-last sm:order-first"
                    >
                      Cancelar
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddMoreProfessionals}
                      className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                    >
                      <Plus size={18} className="mr-1" />
                      Contratar Mais Profissionais
                    </Button>
                    
                    <Button 
                      type="submit"
                      className="bg-toca-accent hover:bg-toca-accent-hover"
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-toca-card border-toca-border sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-toca-accent/20 flex items-center justify-center">
                      <ProfessionalTypeIcon type={professional?.type} size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{professional?.artisticName}</h3>
                      <p className="text-sm text-toca-text-secondary">{professional?.type}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-toca-border pt-4 space-y-2">
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Data:</span>
                      <span className="text-white">{bookingDetails.date || "A definir"}</span>
                    </div>
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Horário:</span>
                      <span className="text-white">{bookingDetails.time || "A definir"}</span>
                    </div>
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Local:</span>
                      <span className="text-white">{bookingDetails.location || "A definir"}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-toca-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">
                        {bookingType === "event" ? "Taxa de evento:" : "Taxa por hora:"}
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(bookingType === "event" ? (professional?.eventRate || 0) : (professional?.hourlyRate || 0))}
                        {bookingType === "hourly" && <span className="text-white"> / hora</span>}
                      </span>
                    </div>
                    
                    {bookingType === "hourly" && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-toca-text-secondary">Estimativa ({hours} horas):</span>
                        <span className="text-toca-accent font-semibold">
                          {formatCurrency((professional?.hourlyRate || 0) * hours)}
                        </span>
                      </div>
                    )}
                    
                    {bookingType === "event" && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-toca-text-secondary">Total:</span>
                        <span className="text-toca-accent font-semibold">
                          {formatCurrency(professional?.eventRate || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {professional && professional.services && professional.services.length > 0 && (
                    <div className="pt-2">
                      <Label className="text-toca-text-secondary mb-2 block">Serviços</Label>
                      <div className="flex flex-wrap gap-1">
                        {professional.services.map((service, index) => (
                          <span key={index} className="text-xs bg-toca-accent/20 text-toca-accent px-2 py-1 rounded-md">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <p className="text-xs text-toca-text-secondary">
                      * O valor final pode variar dependendo de detalhes específicos do evento.
                    </p>
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

export default BookProfessional;
