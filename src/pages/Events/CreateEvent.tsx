
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ImageUploader from "@/components/ImageUploader";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    services: [] as string[],
  });

  console.log("CreateEvent - Current imageUrl state:", imageUrl);

  // Input validation and sanitization
  const validateForm = () => {
    if (!formData.title.trim() || formData.title.length > 200) {
      toast.error("Título é obrigatório e deve ter no máximo 200 caracteres");
      return false;
    }
    
    if (formData.description.length > 1000) {
      toast.error("Descrição deve ter no máximo 1000 caracteres");
      return false;
    }
    
    if (!formData.date) {
      toast.error("Data do evento é obrigatória");
      return false;
    }
    
    if (!formData.location.trim() || formData.location.length > 200) {
      toast.error("Local é obrigatório e deve ter no máximo 200 caracteres");
      return false;
    }
    
    // Check if date is not in the past
    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      toast.error("Data do evento não pode ser no passado");
      return false;
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleImageUpload = (imageFile: File, imageUrl?: string) => {
    console.log("CreateEvent - Image uploaded, received file:", imageFile.name);
    console.log("CreateEvent - Image uploaded, received URL:", imageUrl);
    if (imageUrl) {
      setImageUrl(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para criar um evento");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("CreateEvent - Submitting event with imageUrl:", imageUrl);
      console.log("CreateEvent - Full form data:", formData);

      // Sanitize input data
      const sanitizedData = {
        titulo: formData.title.trim(),
        descricao: formData.description.trim(),
        data: formData.date,
        local: formData.location.trim(),
        servicos_requeridos: formData.services,
        contratante_id: user.id,
        imagem_url: imageUrl || null,
      };

      // RLS will automatically ensure the event is created with the correct user ID
      const { data, error } = await supabase
        .from("eventos")
        .insert(sanitizedData)
        .select()
        .single();

      if (error) {
        console.error("CreateEvent - Error creating event:", error);
        throw error;
      }

      console.log("CreateEvent - Event created successfully:", data);
      console.log("CreateEvent - Event saved with imagem_url:", data.imagem_url);

      toast.success("Evento criado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("CreateEvent - Error:", error);
      toast.error("Erro ao criar evento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableServices = [
    "DJ", "Músico", "Fotógrafo", "Filmmaker", "Técnico de Som", "Iluminação"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-black text-toca-accent hover:bg-gray-800"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar ao Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-white mb-2">Criar Novo Evento</h1>
        <p className="text-toca-text-secondary">Preencha as informações do seu evento</p>
      </div>

      <Card className="bg-toca-card border-toca-border">
        <CardHeader>
          <CardTitle className="text-white">Detalhes do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Título do Evento *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-toca-background border-toca-border text-white"
                  placeholder="Digite o título do evento"
                  maxLength={200}
                  required
                />
                <div className="text-xs text-toca-text-secondary mt-1">
                  {formData.title.length}/200 caracteres
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-toca-background border-toca-border text-white min-h-[100px]"
                  placeholder="Descreva seu evento..."
                  maxLength={1000}
                />
                <div className="text-xs text-toca-text-secondary mt-1">
                  {formData.description.length}/1000 caracteres
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-white flex items-center gap-2">
                    <Calendar size={16} />
                    Data do Evento *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-toca-background border-toca-border text-white"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-white flex items-center gap-2">
                  <MapPin size={16} />
                  Local *
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-toca-background border-toca-border text-white"
                  placeholder="Cidade, Estado"
                  maxLength={200}
                  required
                />
                <div className="text-xs text-toca-text-secondary mt-1">
                  {formData.location.length}/200 caracteres
                </div>
              </div>

              <div>
                <Label className="text-white flex items-center gap-2 mb-3">
                  <ImageIcon size={16} />
                  Imagem de Capa do Evento
                </Label>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  bucketName="event_images"
                  className="w-full"
                />
                {imageUrl && (
                  <div className="mt-2 p-2 bg-toca-background rounded border border-toca-border">
                    <p className="text-sm text-toca-text-secondary">
                      Imagem carregada: {imageUrl.substring(imageUrl.lastIndexOf('/') + 1)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white flex items-center gap-2 mb-3">
                  <Users size={16} />
                  Serviços Necessários
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-3 text-sm rounded-md border transition-all ${
                        formData.services.includes(service)
                          ? "bg-toca-accent text-white border-toca-accent"
                          : "bg-toca-background text-toca-text-secondary border-toca-border hover:border-toca-accent"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-toca-accent hover:bg-toca-accent-hover text-white"
              >
                {isLoading ? "Criando..." : "Criar Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
