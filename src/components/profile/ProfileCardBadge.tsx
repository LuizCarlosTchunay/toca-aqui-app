
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileCardBadgeProps {
  children: React.ReactNode;
  isHovered?: boolean;
  variant?: "default" | "outline" | "secondary";
}

const ProfileCardBadge: React.FC<ProfileCardBadgeProps> = ({
  children,
  isHovered = false,
  variant = "default"
}) => {
  if (variant === "outline") {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-transparent text-white text-xs border-toca-text-secondary transition-colors duration-300",
          isHovered ? "border-toca-accent/50 text-toca-accent/90" : ""
        )}
      >
        {children}
      </Badge>
    );
  }
  
  if (variant === "secondary") {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-black/60 text-white text-xs transition-all duration-300 border border-transparent",
          isHovered ? "border-toca-accent/30" : ""
        )}
      >
        {children}
      </Badge>
    );
  }
  
  // Default badge
  return (
    <Badge 
      variant="outline"
      className={cn(
        "border-toca-accent text-toca-accent flex items-center gap-1 mt-1 transition-all duration-300",
        isHovered ? "bg-toca-accent/10 shadow-[0_0_5px_rgba(234,56,76,0.3)]" : ""
      )}
    >
      {children}
    </Badge>
  );
};

export default ProfileCardBadge;
