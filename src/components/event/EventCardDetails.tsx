
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
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
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm text-white mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-white" />
          <span>{formatDate(date)}</span>
        </div>
        {time && (
          <>
            <div className="w-1 h-1 rounded-full bg-toca-border"></div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-white" />
              <span>{time}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-sm text-white mb-3">
        <MapPin size={14} className="text-white" />
        <span>{city && state ? `${city}, ${state}` : location}</span>
      </div>
      
      <p className="text-sm text-white mb-3 line-clamp-2">
        {description || "Sem descrição disponível"}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {services && services.slice(0, 3).map((service, i) => (
          <Badge key={i} variant="outline" className="border-toca-border text-white text-xs">
            {service}
          </Badge>
        ))}
        {services && services.length > 3 && (
          <Badge variant="outline" className="border-toca-border text-white text-xs">
            +{services.length - 3}
          </Badge>
        )}
      </div>
      
      {onApply && (
        <Button 
          className="w-full bg-toca-accent hover:bg-toca-accent-hover"
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
        >
          Me candidatar
        </Button>
      )}
    </div>
  );
};

export default EventCardDetails;
