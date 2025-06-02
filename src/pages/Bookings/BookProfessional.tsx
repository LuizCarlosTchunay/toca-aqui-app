import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  nome_artistico: string;
  tipo_profissional: string;
  cache_hora: number;
  cache_evento: number;
}

const BookProfessional = () => {
  const { id } = useParams<{ id: string }>();
  const professionalId = id as string;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [bookingType, setBookingType] = useState<"event" | "hourly">("event");
  const [hours, setHours] = useState<number>(4);
  const [eventData, setEventData] = useState({
    eventName: "",
    date: "",
    location: "",
  });
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const { data, error } = await supabase
          .from("profissionais")
          .select("*")
          .eq("id", professionalId)
          .single();

        if (error) {
          throw error;
        }

        setProfessional(data as Professional);
      } catch (error) {
        console.error("Error fetching professional:", error);
        toast({
          title: "Erro ao carregar profissional",
          description: "Não foi possível carregar os dados do profissional.",
          variant: "destructive",
        });
      }
    };

    fetchProfessional();
  }, [professionalId, toast]);

  const handleAddToCart = async () => {
    if (!professional) {
      toast.error("Dados do profissional não encontrados");
      return;
    }

    try {
      const eventDetails = {
        name: eventData.eventName || "",
        date: eventData.date || "",
        location: eventData.location || ""
      };

      const success = await addToCart(
        professionalId,
        bookingType as "event" | "hourly",
        hours,
        eventDetails
      );

      if (success) {
        navigate("/carrinho");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast.error("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto bg-toca-card border-toca-border">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Agendar {professional?.nome_artistico}</CardTitle>
          <CardDescription className="text-toca-text-secondary">
            Preencha os detalhes para agendar este profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bookingType" className="text-white">Tipo de Contratação</Label>
              <Select onValueChange={(value) => setBookingType(value as "event" | "hourly")}>
                <SelectTrigger className="bg-toca-input border-toca-border text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-toca-card border-toca-border text-white">
                  <SelectItem value="event" className="text-white">Evento Completo</SelectItem>
                  <SelectItem value="hourly" className="text-white">Por Hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bookingType === "hourly" && (
              <div>
                <Label htmlFor="hours" className="text-white">Número de Horas</Label>
                <Input
                  id="hours"
                  type="number"
                  defaultValue="4"
                  className="bg-toca-input border-toca-border text-white"
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {bookingType === "event" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName" className="text-white">Nome do Evento</Label>
                  <Input
                    type="text"
                    id="eventName"
                    className="bg-toca-input border-toca-border text-white"
                    onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-white">Local do Evento</Label>
                  <Input
                    type="text"
                    id="location"
                    className="bg-toca-input border-toca-border text-white"
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-white">Data do Evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal bg-toca-input border-toca-border text-white",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-toca-card border-toca-border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setEventData({ ...eventData, date: newDate?.toLocaleDateString() || "" });
                      }}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <Button className="bg-toca-accent hover:bg-toca-accent-hover text-white" onClick={handleAddToCart}>
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookProfessional;
