
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
  return (
    <Card 
      className={`bg-toca-card border-toca-border hover:border-toca-accent transition-all overflow-hidden ${className}`}
    >
      <div 
        className="aspect-[3/1] relative overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={event.image || "https://images.unsplash.com/photo-1527576539890-dfa815648363"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold text-white">{event.name}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-toca-accent border-toca-accent text-white">
              {formatDate(event.date)}
            </Badge>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-toca-text-secondary mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-toca-border"></div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{event.time}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-toca-text-secondary mb-3">
          <MapPin size={14} />
          <span>{event.city}, {event.state}</span>
        </div>
        
        <p className="text-sm text-toca-text-secondary mb-3 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {event.services.slice(0, 3).map((service, i) => (
            <Badge key={i} variant="outline" className="border-toca-border text-white text-xs">
              {service}
            </Badge>
          ))}
          {event.services.length > 3 && (
            <Badge variant="outline" className="border-toca-border text-white text-xs">
              +{event.services.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full bg-toca-accent hover:bg-toca-accent-hover"
          onClick={(e) => {
            e.stopPropagation();
            onApply?.();
          }}
        >
          Me candidatar
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
