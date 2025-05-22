import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import ProfileCardBadge from "@/components/profile/ProfileCardBadge";
import ProfileCardRateDisplay from "@/components/profile/ProfileCardRateDisplay";
import ProfileCardNeonBorder from "@/components/profile/ProfileCardNeonBorder";
import ProfessionalTypeIcon from "@/components/profile/ProfessionalTypeIcon";
import ProfileCardSocialLinks from "@/components/profile/ProfileCardSocialLinks";

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
    instagram?: string;
    youtube?: string;
  };
  className?: string;
  onClick?: () => void;
  expanded?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  professional,
  className = "",
  onClick,
  expanded = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(professional.image);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      <ProfileCardNeonBorder position="top" isVisible={isHovered} />
      <ProfileCardNeonBorder position="right" isVisible={isHovered} />
      <ProfileCardNeonBorder position="bottom" isVisible={isHovered} />
      <ProfileCardNeonBorder position="left" isVisible={isHovered} />
      
      <div className="flex flex-col">
        {/* Full-width avatar image */}
        <div 
          className={cn(
            "w-full h-44 relative overflow-hidden",
            "transition-all duration-300",
            isHovered && "shadow-[0_0_15px_rgba(234,56,76,0.5)]"
          )}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={professional.artisticName || professional.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500",
                isHovered && "scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.error("Failed to load image for:", professional.id);
                setImageLoaded(false);
              }}
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center bg-black",
              "text-toca-accent text-4xl font-bold"
            )}>
              {initials}
            </div>
          )}
          
          {/* Overlay gradient at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
        </div>
        
        <div className="p-4">
          <div className="flex flex-col items-center mb-4">
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
            
            <ProfileCardBadge isHovered={isHovered}>
              <ProfessionalTypeIcon type={professional.type} />
              {professional.type}
            </ProfileCardBadge>
            
            {/* Social Media Links */}
            {(professional.youtube || professional.instagram) && (
              <ProfileCardSocialLinks 
                youtube={professional.youtube} 
                instagram={professional.instagram} 
              />
            )}
          </div>

          <CardContent className="px-0 pt-0 pb-4">
            {professional.bio && (
              <div className={cn(
                "mb-3 text-sm text-white/90 bg-black/40 p-3 rounded-md border-l-2 border-toca-accent",
                "transition-all duration-300",
                isHovered ? "border-l-4 bg-black/50" : "",
                expanded ? "" : "line-clamp-2" // Only truncate when not expanded
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
              {/* Display services if available, otherwise display instruments */}
              {(professional.services && professional.services.length > 0 
                ? professional.services 
                : professional.instruments || [])
                .slice(0, expanded ? undefined : 3) // Show all when expanded
                .map((item, i) => (
                <ProfileCardBadge key={i} variant="secondary" isHovered={isHovered}>
                  {item}
                </ProfileCardBadge>
              ))}
              
              {/* Show count of remaining services/instruments only when not expanded */}
              {!expanded && (professional.services && professional.services.length > 0 
                ? professional.services.length 
                : (professional.instruments || []).length) > 3 && (
                <ProfileCardBadge 
                  variant="secondary" 
                  isHovered={isHovered}
                >
                  +{(professional.services && professional.services.length > 0 
                    ? professional.services.length 
                    : (professional.instruments || []).length) - 3}
                </ProfileCardBadge>
              )}
            </div>
            
            {(professional.genres || []).length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-toca-text-secondary mb-1">Gêneros:</p>
                <div className="flex flex-wrap gap-1">
                  {/* Display all genres when expanded, otherwise limit to 2 */}
                  {professional.genres
                    .slice(0, expanded ? undefined : 2) // Show all when expanded
                    .map((genre, i) => (
                    <ProfileCardBadge key={i} variant="outline" isHovered={isHovered}>
                      {genre}
                    </ProfileCardBadge>
                  ))}
                  {/* Show count of remaining genres only when not expanded */}
                  {!expanded && professional.genres.length > 2 && (
                    <ProfileCardBadge variant="outline" isHovered={isHovered}>
                      +{professional.genres.length - 2}
                    </ProfileCardBadge>
                  )}
                </div>
              </div>
            )}
            
            <div className={cn(
              "grid grid-cols-2 gap-2 pt-2 border-t border-toca-border",
              "transition-colors duration-300",
              isHovered ? "border-toca-accent/30" : ""
            )}>
              <ProfileCardRateDisplay 
                label="Por hora" 
                value={professional.hourlyRate} 
                isHovered={isHovered} 
              />
              
              <ProfileCardRateDisplay 
                label="Por evento" 
                value={professional.eventRate} 
                isHovered={isHovered} 
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
