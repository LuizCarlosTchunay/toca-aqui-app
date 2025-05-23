
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { Loader2 } from "lucide-react";

const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    requiredServices: "",
  });
  const [eventImage, setEventImage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !user) return;

      try {
        const { data: event, error } = await supabase
          .from("eventos")
          .select("*")
          .eq("id", eventId)
          .eq("contratante_id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (event) {
          setFormData({
            title: event.titulo || "",
            description: event.descricao || "",
            date: event.data ? parseISO(event.data) : new Date(),
            location: event.local || "",
            requiredServices: event.servicos_requeridos ? event.servicos_requeridos.join(", ") : "",
          });
          setEventImage(event.imagem_url || undefined);
        }
      } catch (err: any) {
        console.error("Erro ao carregar evento:", err);
        toast.error("Erro ao carregar dados do evento");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, navigate]);

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
    setEventImage(imageUrl);
  };

  const handleUpdateEvent = async () => {
    if (!user || !eventId) {
      toast.error("Erro de autenticação");
      return;
    }
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.requiredServices) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format date as ISO string for database compatibility
      const formattedDate = format(formData.date, "yyyy-MM-dd");

      // Convert comma-separated services to array
      const servicesArray = formData.requiredServices.split(",").map(item => item.trim()).filter(item => item);
      
      const { error } = await supabase
        .from("eventos")
        .update({
          titulo: formData.title,
          descricao: formData.description,
          data: formattedDate,
          local: formData.location,
          servicos_requeridos: servicesArray,
          imagem_url: eventImage,
        })
        .eq("id", eventId)
        .eq("contratante_id", user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Evento atualizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro ao atualizar evento:", err);
      toast.error(err?.message || "Ocorreu um erro ao atualizar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-toca-accent mr-2" />
          <span className="text-toca-text-primary">Carregando evento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Editar Evento</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateEvent();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="eventImage">Imagem do Evento</Label>
                <ImageUploader
                  currentImage={eventImage}
                  onImageChange={handleImageChange}
                  bucketName="event_images"
                  objectPath={user ? `events/${user.id}-${eventId}-${Date.now()}.jpg` : undefined}
                  size="lg"
                  className="mb-4"
                >
                  <p className="text-sm text-toca-text-secondary mt-2">
                    Altere a imagem de capa do seu evento (opcional)
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
                  {isSubmitting ? "Atualizando..." : "Atualizar Evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
