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

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    requiredServices: [],
  });
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

  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from("eventos")
        .insert({
          contratante_id: user?.id,
          titulo: formData.title,
          descricao: formData.description,
          data: formData.date,
          local: formData.location,
          servicos_requeridos: formData.requiredServices,
          status: "aberto"
        })
        .select("*")
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Evento criado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      toast.error("Ocorreu um erro ao criar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-toca-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-toca-card rounded-lg border border-toca-border shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Criar Novo Evento
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateEvent();
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
                className="bg-toca-background border-toca-border text-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data do Evento</Label>
              <DatePicker
                id="date"
                name="date"
                onSelect={handleDateChange}
                defaultDate={formData.date}
                required
                className="bg-toca-background border-toca-border text-white"
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
                placeholder="Quais serviços você precisa?"
                value={formData.requiredServices.join(", ")}
                onChange={handleChange}
                required
                className="bg-toca-background border-toca-border text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando Evento..." : "Criar Evento"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
