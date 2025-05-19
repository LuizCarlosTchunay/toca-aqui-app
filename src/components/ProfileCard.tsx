
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Disc, Camera, Film, Users, Mic, Guitar, Headphones, UserRound, MicVocal, Drum } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <Card 
      className={cn(
        "bg-toca-card border-toca-border hover:border-toca-accent transition-all cursor-pointer overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"}
          alt={professional.artisticName || professional.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center gap-1 text-white">
            <Star className="fill-yellow-500 text-yellow-500" size={14} />
            <span className="text-sm font-medium">{professional.rating}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-white truncate">
            {professional.artisticName || professional.name}
          </h3>
          <Badge 
            variant="outline"
            className="border-toca-accent text-toca-accent flex items-center gap-1"
          >
            {getTypeIcon(professional.type)}
            {professional.type}
          </Badge>
        </div>
        
        <div className="text-sm text-toca-text-secondary mb-3">
          {professional.city && professional.state 
            ? `${professional.city}, ${professional.state}`
            : "Local não informado"}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(professional.instruments || professional.services || []).slice(0, 3).map((item, i) => (
            <Badge key={i} variant="secondary" className="bg-toca-background text-white text-xs">
              {item}
            </Badge>
          ))}
          {(professional.instruments || professional.services || []).length > 3 && (
            <Badge variant="secondary" className="bg-toca-background text-white text-xs">
              +{(professional.instruments || professional.services || []).length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-toca-border">
          {professional.hourlyRate ? (
            <div className="text-right">
              <span className="text-xs text-toca-text-secondary">Por hora</span>
              <div className="text-toca-accent font-semibold">
                R${professional.hourlyRate}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          
          {professional.eventRate ? (
            <div className="text-right">
              <span className="text-xs text-toca-text-secondary">Por evento</span>
              <div className="text-toca-accent font-semibold">
                R${professional.eventRate}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
