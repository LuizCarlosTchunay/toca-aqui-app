
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Disc, Camera, Film, Users, UserRound, MicVocal, Drum, Guitar, Headphones, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  professional: {
    id: string;
    name: string;
    artisticName?: string;
    type: string;
    rating: number;
    instruments?: string[];
    services?: string[];
    genres?: string[];
    hourlyRate?: number;
    eventRate?: number;
    image?: string;
    city: string;
    state: string;
    bio?: string;
  };
  className?: string;
  onClick?: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "músico":
    case "musico":
      return <Music size={16} />;
    case "voz e violão":
      return <MicVocal size={16} />;
    case "baterista":
      return <Drum size={16} />;
    case "guitarrista":
      return <Guitar size={16} />;
    case "baixista":
      return <Music size={16} />;
    case "dj":
      return <Disc size={16} />;
    case "fotógrafo":
    case "fotografo":
      return <Camera size={16} />;
    case "filmmaker":
      return <Film size={16} />;
    case "duo":
    case "trio":
    case "banda":
      return <Users size={16} />;
    default:
      return <UserRound size={16} />;
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  professional,
  className = "",
  onClick,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(professional.image);
  const [isHovered, setIsHovered] = useState(false);

  // Try to fetch the professional's image from storage if not provided
  useEffect(() => {
    const fetchImage = async () => {
      if (!professional.id) return;
      
      try {
        const { data } = supabase.storage
          .from("profile_images")
          .getPublicUrl(`professionals/${professional.id}`);
        
        if (data?.publicUrl) {
          // Check if the image exists
          const checkExistence = await fetch(data.publicUrl, { method: 'HEAD' })
            .then(res => res.ok)
            .catch(() => false);
            
          if (checkExistence) {
            setImageUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching professional image:", error);
      }
    };
    
    if (!professional.image) {
      fetchImage();
    }
  }, [professional.id, professional.image]);

  // Generate initials for avatar fallback
  const initials = (professional.artisticName || professional.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br from-toca-card to-black border-toca-border group",
        "hover:shadow-[0_0_20px_rgba(234,56,76,0.6)] hover:border-toca-accent",
        isHovered && "scale-[1.02]",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cyberpunk neon borders */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-toca-accent to-transparent",
        "opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100 animate-pulse" : ""
      )} />
      
      <div className={cn(
        "absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-toca-accent to-transparent",
        "opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100 animate-pulse" : ""
      )} />
      
      <div className={cn(
        "absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-toca-accent to-transparent",
        "opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100 animate-pulse" : ""
      )} />
      
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-toca-accent to-transparent",
        "opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100 animate-pulse" : ""
      )} />
      
      <div className="p-4 flex flex-col">
        <div className="flex flex-col items-center mb-4">
          {/* Larger avatar with better framing and cyberpunk glow effects */}
          <Avatar className={cn(
            "w-32 h-32 mb-4 transition-all duration-300 rounded-lg",
            "border-2 shadow-lg",
            isHovered 
              ? "border-toca-accent shadow-[0_0_15px_rgba(234,56,76,0.5)] scale-105" 
              : "border-toca-accent/50"
          )}>
            <AvatarImage 
              src={imageUrl || ""} 
              alt={professional.artisticName || professional.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-black text-toca-accent text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <h3 className={cn(
            "font-bold text-white text-lg text-center transition-all duration-300",
            isHovered ? "text-toca-accent drop-shadow-[0_0_5px_rgba(234,56,76,0.5)]" : ""
          )}>
            {professional.artisticName || professional.name}
          </h3>
          
          <div className="flex items-center gap-1 text-white">
            <Star className="fill-yellow-500 text-yellow-500" size={14} />
            <span className="text-sm font-medium">{professional.rating}</span>
          </div>
          
          <Badge 
            variant="outline"
            className={cn(
              "border-toca-accent text-toca-accent flex items-center gap-1 mt-1 transition-all duration-300",
              isHovered ? "bg-toca-accent/10 shadow-[0_0_5px_rgba(234,56,76,0.3)]" : ""
            )}
          >
            {getTypeIcon(professional.type)}
            {professional.type}
          </Badge>
        </div>

        <CardContent className="px-0 pt-0 pb-4">
          {professional.bio && (
            <div className={cn(
              "mb-3 text-sm text-white/90 bg-black/40 p-3 rounded-md border-l-2 border-toca-accent line-clamp-2",
              "transition-all duration-300",
              isHovered ? "border-l-4 bg-black/50" : ""
            )}>
              "{professional.bio}"
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm text-toca-text-secondary mb-3">
            <span className={cn(
              "inline-block bg-toca-accent/20 p-1 rounded-full transition-all duration-300",
              isHovered ? "bg-toca-accent/40" : ""
            )}>
              <MapPin size={14} className="text-toca-accent" />
            </span>
            {professional.city && professional.state 
              ? `${professional.city}, ${professional.state}`
              : "Local não informado"}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {(professional.instruments || professional.services || []).slice(0, 3).map((item, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={cn(
                  "bg-black/60 text-white text-xs transition-all duration-300 border border-transparent",
                  isHovered ? "border-toca-accent/30" : ""
                )}
              >
                {item}
              </Badge>
            ))}
            {(professional.instruments || professional.services || []).length > 3 && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "bg-black/60 text-white text-xs transition-all duration-300",
                  isHovered ? "bg-toca-accent/20 text-toca-accent" : ""
                )}
              >
                +{(professional.instruments || professional.services || []).length - 3}
              </Badge>
            )}
          </div>
          
          {(professional.genres || []).length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-toca-text-secondary mb-1">Gêneros:</p>
              <div className="flex flex-wrap gap-1">
                {professional.genres.slice(0, 2).map((genre, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className={cn(
                      "bg-transparent text-white text-xs border-toca-text-secondary transition-colors duration-300",
                      isHovered ? "border-toca-accent/50 text-toca-accent/90" : ""
                    )}
                  >
                    {genre}
                  </Badge>
                ))}
                {professional.genres.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "bg-transparent text-white text-xs border-toca-text-secondary transition-colors duration-300",
                      isHovered ? "border-toca-accent/50 text-toca-accent/90" : ""
                    )}
                  >
                    +{professional.genres.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className={cn(
            "grid grid-cols-2 gap-2 pt-2 border-t border-toca-border",
            "transition-colors duration-300",
            isHovered ? "border-toca-accent/30" : ""
          )}>
            {professional.hourlyRate ? (
              <div className={cn(
                "bg-black/50 p-2 rounded-md text-center transition-all duration-300",
                isHovered && "bg-black/70 shadow-inner"
              )}>
                <span className="text-xs text-toca-text-secondary block">Por hora</span>
                <div className={cn(
                  "text-toca-accent font-semibold transition-all duration-300",
                  isHovered && "scale-105 drop-shadow-[0_0_5px_rgba(234,56,76,0.5)]"
                )}>
                  R${professional.hourlyRate}
                </div>
              </div>
            ) : (
              <div></div>
            )}
            
            {professional.eventRate ? (
              <div className={cn(
                "bg-black/50 p-2 rounded-md text-center transition-all duration-300",
                isHovered && "bg-black/70 shadow-inner"
              )}>
                <span className="text-xs text-toca-text-secondary block">Por evento</span>
                <div className={cn(
                  "text-toca-accent font-semibold transition-all duration-300",
                  isHovered && "scale-105 drop-shadow-[0_0_5px_rgba(234,56,76,0.5)]"
                )}>
                  R${professional.eventRate}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfileCard;
