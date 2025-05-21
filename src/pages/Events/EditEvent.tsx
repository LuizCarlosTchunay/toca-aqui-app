
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    requiredServices: "",
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("eventos")
          .select("*")
          .eq("id", id)
          .eq("contratante_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          toast.error("Erro ao carregar o evento");
          navigate("/dashboard");
          return;
        }

        if (!data) {
          toast.error("Evento não encontrado ou você não tem permissão para editá-lo");
          navigate("/dashboard");
          return;
        }

        // Parse date from string to Date object
        let eventDate = new Date();
        try {
          if (data.data) {
            eventDate = parse(data.data, "yyyy-MM-dd", new Date());
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }

        setFormData({
          title: data.titulo || "",
          description: data.descricao || "",
          date: eventDate,
          location: data.local || "",
          requiredServices: data.servicos_requeridos ? data.servicos_requeridos.join(", ") : "",
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Erro ao carregar o evento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

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

  const handleUpdateEvent = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para editar um evento");
      return;
    }

    if (!id) {
      toast.error("ID do evento não encontrado");
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
        })
        .eq("id", id)
        .eq("contratante_id", user.id);
      
      if (error) throw error;
      
      toast.success("Evento atualizado com sucesso!");
      navigate(`/eventos/${id}`);
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
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-toca-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Editar Evento</h1>
        
        <Card className="bg-toca-card border-toca-border hover:border-toca-accent transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(234,56,76,0.4)]">
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
                  className="bg-toca-background border-toca-border text-white resize-none min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data do Evento</Label>
                <DatePicker
                  id="date"
                  defaultDate={formData.date}
                  onSelect={handleDateChange}
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
                  onClick={() => navigate(`/eventos/${id}`)}
                  className="border-toca-accent text-white hover:bg-toca-accent/10"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover shadow-[0_0_10px_rgba(234,56,76,0.5)] hover:shadow-[0_0_15px_rgba(234,56,76,0.8)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Salvar Alterações
                    </>
                  )}
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
