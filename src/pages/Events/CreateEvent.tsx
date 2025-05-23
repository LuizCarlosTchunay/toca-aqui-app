
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    requiredServices: "",
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date: date,
      });
    }
  };

  const handleImageChange = (imageFile: File, imageUrl?: string) => {
    setEventImage(imageFile);
    if (imageUrl) {
      setEventImageUrl(imageUrl);
    }
  };

  const handleCreateEvent = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para criar um evento");
      return;
    }
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.requiredServices) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = "";
      
      // Upload image if provided
      if (eventImage) {
        const fileExt = eventImage.name.split('.').pop();
        const fileName = `event-${Date.now()}.${fileExt}`;
        
        // Create storage bucket if it doesn't exist
        try {
          await supabase.storage.createBucket('event_images', {
            public: true
          });
        } catch (e) {
          // Bucket likely already exists
          console.log("Bucket may already exist");
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event_images')
          .upload(fileName, eventImage, {
            upsert: true,
            contentType: eventImage.type
          });
          
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.error("Erro ao fazer upload da imagem. Continuando sem imagem...");
        } else {
          // Get the public URL of the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from('event_images')
            .getPublicUrl(fileName);
            
          if (publicUrlData) {
            imageUrl = publicUrlData.publicUrl;
          }
        }
      }

      // Format date as ISO string for database compatibility
      const formattedDate = format(formData.date, "yyyy-MM-dd");

      // Convert comma-separated services to array
      const servicesArray = formData.requiredServices.split(",").map(item => item.trim()).filter(item => item);
      
      const eventData = {
        contratante_id: user.id,
        titulo: formData.title,
        descricao: formData.description,
        data: formattedDate,
        local: formData.location,
        servicos_requeridos: servicesArray,
        status: "aberto",
        ...(imageUrl && { imagem_url: imageUrl })
      };
      
      const { data, error } = await supabase
        .from("eventos")
        .insert(eventData)
        .select("*")
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Evento criado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro ao criar evento:", err);
      toast.error(err?.message || "Ocorreu um erro ao criar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Criar Novo Evento</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateEvent();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Imagem de Capa do Evento</Label>
                <ImageUploader 
                  currentImage={eventImageUrl}
                  onImageChange={handleImageChange}
                  size="lg"
                  bucketName="event_images"
                  className="mb-4"
                >
                  <p className="text-sm text-toca-text-secondary mt-2">
                    Adicione uma imagem para a capa do seu evento (opcional)
                  </p>
                </ImageUploader>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Digite o título do evento"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Evento</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva os detalhes do evento"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data do Evento</Label>
                <DatePicker
                  id="date"
                  onSelect={handleDateChange}
                  defaultDate={formData.date}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local do Evento</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Onde o evento acontecerá?"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredServices">Serviços Requeridos</Label>
                <Input
                  id="requiredServices"
                  name="requiredServices"
                  placeholder="Quais serviços você precisa? (separados por vírgula)"
                  value={formData.requiredServices}
                  onChange={handleChange}
                  required
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="border-toca-border text-white"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando Evento..." : "Criar Evento"}
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
