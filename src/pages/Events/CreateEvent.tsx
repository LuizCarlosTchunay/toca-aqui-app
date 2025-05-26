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
    console.log("Image changed:", { imageFile, imageUrl });
    setEventImage(imageFile);
    if (imageUrl) {
      setEventImageUrl(imageUrl);
      console.log("Image URL set to:", imageUrl);
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
      
      let finalImageUrl = "";
      
      // Upload image if provided
      if (eventImage) {
        console.log("Uploading event image:", eventImage);
        
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(eventImage.type)) {
          toast.error("Formato de imagem não suportado. Use JPG, PNG ou WebP.");
          setIsSubmitting(false);
          return;
        }
        
        if (eventImage.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error("Imagem muito grande. Máximo 5MB.");
          setIsSubmitting(false);
          return;
        }
        
        const fileExt = eventImage.name.split('.').pop()?.toLowerCase();
        const fileName = `event-${user.id}-${Date.now()}.${fileExt}`;
        
        console.log("Uploading file:", fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event_images')
          .upload(fileName, eventImage, {
            cacheControl: '3600',
            upsert: false,
          });
          
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue without image instead of failing
          toast.error("Erro ao fazer upload da imagem. Evento será criado sem imagem.");
        } else {
          console.log("Upload successful:", uploadData);
          
          // Get the public URL of the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from('event_images')
            .getPublicUrl(fileName);
            
          if (publicUrlData?.publicUrl) {
            finalImageUrl = publicUrlData.publicUrl;
            console.log("Final image URL:", finalImageUrl);
          }
        }
      } else if (eventImageUrl) {
        // Use the URL if it was already uploaded through ImageUploader
        finalImageUrl = eventImageUrl;
        console.log("Using existing image URL:", finalImageUrl);
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
        ...(finalImageUrl && { imagem_url: finalImageUrl })
      };
      
      console.log("Creating event with data:", eventData);
      
      const { data, error } = await supabase
        .from("eventos")
        .insert(eventData)
        .select("*")
        .single();
      
      if (error) {
        console.error("Error creating event:", error);
        throw error;
      }
      
      console.log("Event created successfully:", data);
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
                    Adicione uma imagem para a capa do seu evento (JPG, PNG ou WebP - máx. 5MB)
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
