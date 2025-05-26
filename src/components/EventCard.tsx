
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import EventCardImage from "./event/EventCardImage";
import EventCardDetails from "./event/EventCardDetails";
import { EventCardProps } from "./event/types";

const EventCard: React.FC<EventCardProps> = ({
  event,
  className = "",
  onClick,
  onApply,
}) => {
  return (
    <Card 
      className={`bg-gradient-to-br from-toca-card to-toca-card/80 border-toca-border hover:border-toca-accent/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-[1.02] ${className}`}
    >
      <EventCardImage 
        name={event.name}
        date={event.date}
        imageUrl={event.image}
        onClick={onClick}
      />
      
      <CardContent className="p-0">
        <EventCardDetails
          date={event.date}
          time={event.time}
          location={event.location}
          city={event.city}
          state={event.state}
          description={event.description}
          services={event.services}
          onApply={onApply}
        />
      </CardContent>
    </Card>
  );
};

export default EventCard;
