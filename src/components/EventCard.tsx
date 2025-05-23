
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
  // Use custom image if available, otherwise fallback to default
  const imageUrl = event.image || "https://images.unsplash.com/photo-1527576539890-dfa815648363";

  return (
    <Card 
      className={`bg-toca-card border-toca-border hover:border-toca-accent transition-all overflow-hidden ${className}`}
    >
      <EventCardImage 
        name={event.name}
        date={event.date}
        imageUrl={imageUrl}
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
