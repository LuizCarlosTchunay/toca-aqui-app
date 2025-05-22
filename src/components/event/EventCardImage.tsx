
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EventCardImageProps } from "./types";

const EventCardImage: React.FC<EventCardImageProps> = ({
  name,
  date,
  imageUrl,
  onClick,
}) => {
  return (
    <div 
      className="aspect-[3/1] relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-toca-accent border-toca-accent text-white">
            {formatDate(date)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default EventCardImage;
