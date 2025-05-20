
import React from "react";
import { cn } from "@/lib/utils";

interface ProfileCardRateDisplayProps {
  label: string;
  value?: number;
  isHovered?: boolean;
}

const ProfileCardRateDisplay: React.FC<ProfileCardRateDisplayProps> = ({
  label,
  value,
  isHovered = false
}) => {
  if (!value) {
    return <div></div>;
  }
  
  return (
    <div className={cn(
      "bg-black/50 p-2 rounded-md text-center transition-all duration-300",
      isHovered && "bg-black/70 shadow-inner"
    )}>
      <span className="text-xs text-toca-text-secondary block">{label}</span>
      <div className={cn(
        "text-toca-accent font-semibold transition-all duration-300",
        isHovered && "scale-105 drop-shadow-[0_0_5px_rgba(234,56,76,0.5)]"
      )}>
        R${value}
      </div>
    </div>
  );
};

export default ProfileCardRateDisplay;
