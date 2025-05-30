
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
  console.log("EventCardImage rendering for event:", name);
  console.log("EventCardImage imageUrl received:", imageUrl);
  
  // Array de imagens específicas para eventos
  const eventImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop", // Concerto com luzes
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop", // Festa com DJ
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop", // Evento musical
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop", // Concerto ao vivo
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=400&fit=crop", // Festa com luzes coloridas
    "https://images.unsplash.com/photo-1571266028243-d220bee1dfab?w=800&h=400&fit=crop", // Evento noturno
  ];
  
  // Verificar se há uma imagem personalizada válida
  const hasValidCustomImage = imageUrl && 
    imageUrl.trim() !== "" && 
    imageUrl !== "https://images.unsplash.com/photo-1527576539890-dfa815648363" &&
    !imageUrl.includes("placeholder") &&
    !imageUrl.includes("data:image") && // Remove data URLs
    imageUrl.startsWith("http"); // Ensure it's a valid HTTP URL

  console.log("EventCardImage hasValidCustomImage:", hasValidCustomImage);
  
  const getEventImage = () => {
    if (hasValidCustomImage) {
      console.log("EventCardImage using custom image:", imageUrl);
      return imageUrl;
    }
    
    // Usar hash simples do nome para ter consistência nas imagens aleatórias
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const randomImage = eventImages[hash % eventImages.length];
    console.log("EventCardImage using fallback image for event:", name, "->", randomImage);
    return randomImage;
  };

  const finalImageUrl = getEventImage();
  console.log("EventCardImage final image URL:", finalImageUrl);
  
  return (
    <div 
      className="aspect-[16/9] relative overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-toca-accent/20 to-toca-accent/30 z-10"></div>
      
      <img
        src={finalImageUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onLoad={() => console.log("EventCardImage image loaded successfully:", finalImageUrl)}
        onError={(e) => {
          console.error("EventCardImage image failed to load:", finalImageUrl);
          console.error("EventCardImage error details:", e);
          // Se a imagem personalizada falhar, tentar uma das imagens padrão
          if (hasValidCustomImage && finalImageUrl === imageUrl) {
            const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const fallbackImage = eventImages[hash % eventImages.length];
            (e.target as HTMLImageElement).src = fallbackImage;
            console.log("EventCardImage falling back to random image:", fallbackImage);
          }
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex flex-col justify-end p-6">
        <div className="mb-3">
          <Badge className="bg-toca-accent hover:bg-toca-accent-hover border-0 text-white font-semibold px-3 py-1">
            {formatDate(date)}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
        
        {/* Elemento decorativo para dar mais cara de evento */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-toca-accent/30 to-toca-accent-hover/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-toca-accent animate-pulse"></div>
        </div>
      </div>
      
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 z-30"></div>
    </div>
  );
};

export default EventCardImage;
