
import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { EventCardDetailsProps } from "./types";

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  date,
  time,
  location,
  city,
  state,
  description,
  services,
  onApply,
}) => {
  return (
    <div className="p-6 space-y-4">
      {/* Data e horário com ícones mais destacados */}
      <div className="flex items-center gap-4 text-sm text-white">
        <div className="flex items-center gap-2 bg-toca-background/50 rounded-full px-3 py-1">
          <Calendar size={16} className="text-purple-400" />
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        {time && (
          <div className="flex items-center gap-2 bg-toca-background/50 rounded-full px-3 py-1">
            <Clock size={16} className="text-blue-400" />
            <span className="font-medium">{time}</span>
          </div>
        )}
      </div>
      
      {/* Localização mais destacada */}
      <div className="flex items-center gap-2 text-sm text-white bg-toca-background/30 rounded-lg p-3">
        <MapPin size={16} className="text-green-400 flex-shrink-0" />
        <span className="font-medium">{city && state ? `${city}, ${state}` : location}</span>
      </div>
      
      {/* Descrição com melhor styling */}
      <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 bg-toca-background/20 rounded-lg p-3">
        {description || "Evento incrível esperando por você!"}
      </p>
      
      {/* Serviços com melhor visual */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users size={14} />
          <span>Serviços necessários</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {services && services.slice(0, 3).map((service, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="border-purple-500/50 text-purple-300 bg-purple-500/10 text-xs hover:bg-purple-500/20 transition-colors"
            >
              {service}
            </Badge>
          ))}
          {services && services.length > 3 && (
            <Badge 
              variant="outline" 
              className="border-pink-500/50 text-pink-300 bg-pink-500/10 text-xs"
            >
              +{services.length - 3} mais
            </Badge>
          )}
        </div>
      </div>
      
      {/* Botão de candidatura com melhor design */}
      {onApply && (
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
        >
          🎯 Me candidatar ao evento
        </Button>
      )}
    </div>
  );
};

export default EventCardDetails;
