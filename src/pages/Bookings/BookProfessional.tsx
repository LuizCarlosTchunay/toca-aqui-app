
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, CircleDollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const BookProfessional = () => {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState("event");
  
  // Mock data for the professional
  const professional = {
    id: "1",
    name: "João Silva",
    artisticName: "DJ Pulse",
    type: "DJ",
    hourlyRate: 150,
    eventRate: 1200,
    city: "São Paulo",
    state: "SP",
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reserva adicionada ao carrinho!");
    navigate("/checkout");
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
        
        <h1 className="text-2xl font-bold mb-6">Reservar: {professional.artisticName}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-toca-card border-toca-border mb-6">
              <CardHeader>
                <CardTitle>Detalhes da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Reserva</Label>
                    <RadioGroup 
                      defaultValue="event" 
                      className="flex flex-col sm:flex-row gap-4"
                      onValueChange={setBookingType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="event" id="event" />
                        <Label htmlFor="event" className="cursor-pointer">Evento Completo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly" className="cursor-pointer">Por Hora</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {bookingType === "hourly" && (
                    <div className="space-y-2">
                      <Label htmlFor="hours">Quantidade de Horas</Label>
                      <Input 
                        id="hours" 
                        type="number" 
                        min="1"
                        defaultValue="4"
                        className="bg-toca-background border-toca-border text-white w-32"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="selectEvent">Escolha um Evento</Label>
                    <Select>
                      <SelectTrigger className="bg-toca-background border-toca-border text-white">
                        <SelectValue placeholder="Selecione um evento ou crie um novo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Criar Novo Evento</SelectItem>
                        <SelectItem value="1">Festival de Verão</SelectItem>
                        <SelectItem value="2">Casamento Silva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                        <Input 
                          id="date" 
                          type="date" 
                          className="bg-toca-background border-toca-border text-white pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                        <Input 
                          id="time" 
                          type="time" 
                          className="bg-toca-background border-toca-border text-white pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                      <Input 
                        id="location" 
                        placeholder="Endereço do evento" 
                        className="bg-toca-background border-toca-border text-white pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input 
                        id="city" 
                        defaultValue={professional.city}
                        className="bg-toca-background border-toca-border text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select defaultValue={professional.state}>
                        <SelectTrigger className="bg-toca-background border-toca-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="details">Detalhes Adicionais</Label>
                    <Textarea 
                      id="details" 
                      placeholder="Descreva detalhes importantes para o profissional..." 
                      className="bg-toca-background border-toca-border text-white min-h-[120px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(-1)}
                      className="border-toca-border"
                    >
                      Cancelar
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
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-toca-accent/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-toca-accent">DJ</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{professional.artisticName}</h3>
                      <p className="text-sm text-toca-text-secondary">{professional.type}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-toca-border pt-4 space-y-2">
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Data:</span>
                      <span className="text-white">A definir</span>
                    </div>
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Horário:</span>
                      <span className="text-white">A definir</span>
                    </div>
                    <div className="flex justify-between text-toca-text-secondary">
                      <span>Local:</span>
                      <span className="text-white">A definir</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-toca-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">
                        {bookingType === "event" ? "Taxa de evento:" : "Taxa por hora:"}
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(bookingType === "event" ? professional.eventRate : professional.hourlyRate)}
                        {bookingType === "hourly" && <span> / hora</span>}
                      </span>
                    </div>
                    
                    {bookingType === "hourly" && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-toca-text-secondary">Estimativa (4 horas):</span>
                        <span className="text-toca-accent font-semibold">
                          {formatCurrency(professional.hourlyRate * 4)}
                        </span>
                      </div>
                    )}
                    
                    {bookingType === "event" && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-toca-text-secondary">Total:</span>
                        <span className="text-toca-accent font-semibold">
                          {formatCurrency(professional.eventRate)}
                        </span>
                      </div>
                    )}
                  </div>
                  
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
