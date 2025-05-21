
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import EventCard from "@/components/EventCard";
import { PlusCircle } from "lucide-react";

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("eventos")
          .select("*")
          .order("data", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Eventos</h1>
          
          {user && (
            <Link to="/criar-evento">
              <Button className="bg-toca-accent hover:bg-toca-accent-hover">
                <PlusCircle size={18} className="mr-2" />
                Criar Evento
              </Button>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-toca-accent"></div>
          </div>
        ) : (
          <>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link to={`/eventos/${event.id}`} key={event.id}>
                    <EventCard event={event} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-toca-text-secondary mb-4">Nenhum evento encontrado</h3>
                {user && (
                  <Link to="/criar-evento">
                    <Button className="bg-toca-accent hover:bg-toca-accent-hover">
                      Criar seu primeiro evento
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
