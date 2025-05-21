
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    state: string;
    services: string[];
    image?: string;
  };
  className?: string;
  onClick?: () => void;
  onApply?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  className = "",
  onClick,
  onApply,
}) => {
  // Default image if not provided
  const imageUrl = event.image || "https://images.unsplash.com/photo-1527576539890-dfa815648363";

  return (
    <Card 
      className={`bg-toca-card border-toca-border hover:border-toca-accent transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(234,56,76,0.6)] ${className}`}
    >
      <div 
        className="aspect-[3/1] relative overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={imageUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">{event.name}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-toca-accent border-toca-accent text-white shadow-[0_0_5px_rgba(234,56,76,0.7)]">
              {formatDate(event.date)}
            </Badge>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 relative">
        <div className="flex items-center gap-2 text-sm text-white mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-toca-accent" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <>
              <div className="w-1 h-1 rounded-full bg-toca-accent"></div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-toca-accent" />
                <span>{event.time}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-sm text-white mb-3">
          <MapPin size={14} className="text-toca-accent" />
          <span>{event.city && event.state ? `${event.city}, ${event.state}` : event.location}</span>
        </div>
        
        <p className="text-sm text-white/90 mb-3 line-clamp-2">
          {event.description || "Sem descrição disponível"}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {event.services && event.services.slice(0, 3).map((service, i) => (
            <Badge key={i} variant="outline" className="border-toca-accent text-white text-xs">
              {service}
            </Badge>
          ))}
          {event.services && event.services.length > 3 && (
            <Badge variant="outline" className="border-toca-accent text-white text-xs">
              +{event.services.length - 3}
            </Badge>
          )}
        </div>
        
        {onApply && (
          <Button 
            className="w-full bg-toca-accent hover:bg-toca-accent-hover transition-all duration-300 shadow-[0_0_10px_rgba(234,56,76,0.5)] hover:shadow-[0_0_15px_rgba(234,56,76,0.8)]"
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
          >
            Me candidatar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
