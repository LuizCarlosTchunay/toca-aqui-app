
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Disc, Camera, Film, Users, UserRound, MicVocal, Drum, Guitar, Headphones } from "lucide-react";
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
        "bg-gradient-to-br from-toca-card to-toca-background border-toca-border hover:border-toca-accent transition-all cursor-pointer shadow-lg hover:shadow-xl overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <div className="pt-4 px-4 flex flex-col">
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="h-16 w-16 border-2 border-toca-accent ring-2 ring-toca-accent/20 shadow-md">
            <AvatarImage src={imageUrl || ""} alt={professional.artisticName || professional.name} />
            <AvatarFallback className="bg-toca-accent/20 text-toca-accent font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-white text-lg">
              {professional.artisticName || professional.name}
            </h3>
            <div className="flex items-center gap-1 text-white">
              <Star className="fill-yellow-500 text-yellow-500" size={14} />
              <span className="text-sm font-medium">{professional.rating}</span>
            </div>
            <Badge 
              variant="outline"
              className="border-toca-accent text-toca-accent flex items-center gap-1 mt-1"
            >
              {getTypeIcon(professional.type)}
              {professional.type}
            </Badge>
          </div>
        </div>

        <CardContent className="px-0 pt-0 pb-4">        
          {professional.bio && (
            <div className="mb-3 text-sm text-white/90 bg-black/20 p-3 rounded-md border-l-2 border-toca-accent line-clamp-2">
              "{professional.bio}"
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm text-toca-text-secondary mb-3">
            <span className="inline-block bg-toca-accent/20 p-1 rounded-full">
              {professional.city && professional.state 
                ? <Users size={14} className="text-toca-accent" />
                : <UserRound size={14} className="text-toca-accent" />
              }
            </span>
            {professional.city && professional.state 
              ? `${professional.city}, ${professional.state}`
              : "Local não informado"}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {(professional.instruments || professional.services || []).slice(0, 3).map((item, i) => (
              <Badge key={i} variant="secondary" className="bg-toca-background/80 text-white text-xs">
                {item}
              </Badge>
            ))}
            {(professional.instruments || professional.services || []).length > 3 && (
              <Badge variant="secondary" className="bg-toca-background/80 text-white text-xs">
                +{(professional.instruments || professional.services || []).length - 3}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-toca-border">
            {professional.hourlyRate ? (
              <div className="bg-toca-background/50 p-2 rounded-md text-center">
                <span className="text-xs text-toca-text-secondary block">Por hora</span>
                <div className="text-toca-accent font-semibold">
                  R${professional.hourlyRate}
                </div>
              </div>
            ) : (
              <div></div>
            )}
            
            {professional.eventRate ? (
              <div className="bg-toca-background/50 p-2 rounded-md text-center">
                <span className="text-xs text-toca-text-secondary block">Por evento</span>
                <div className="text-toca-accent font-semibold">
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
