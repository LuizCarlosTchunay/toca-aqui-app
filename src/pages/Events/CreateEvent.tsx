
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Evento criado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="contratante" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Evento</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle>Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Evento</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Casamento Silva, Festival de Verão, etc." 
                  className="bg-toca-background border-toca-border text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva os detalhes do seu evento..." 
                  className="bg-toca-background border-toca-border text-white min-h-[120px]"
                  required
                />
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
                  <Input 
                    id="time" 
                    type="time" 
                    className="bg-toca-background border-toca-border text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                  <Input 
                    id="location" 
                    placeholder="Nome do local" 
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
                    placeholder="Nome da cidade" 
                    className="bg-toca-background border-toca-border text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select required>
                    <SelectTrigger className="bg-toca-background border-toca-border text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Serviços Necessários</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dj" />
                    <Label htmlFor="dj" className="text-sm cursor-pointer">DJ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="musico" />
                    <Label htmlFor="musico" className="text-sm cursor-pointer">Músico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fotografo" />
                    <Label htmlFor="fotografo" className="text-sm cursor-pointer">Fotógrafo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filmmaker" />
                    <Label htmlFor="filmmaker" className="text-sm cursor-pointer">Filmmaker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tecnico_som" />
                    <Label htmlFor="tecnico_som" className="text-sm cursor-pointer">Técnico de Som</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tecnico_luz" />
                    <Label htmlFor="tecnico_luz" className="text-sm cursor-pointer">Técnico de Luz</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isPublic" 
                  checked={isPublic} 
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)} 
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Tornar evento público (profissionais poderão se candidatar)
                </Label>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="border-toca-border"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                >
                  Criar Evento
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
