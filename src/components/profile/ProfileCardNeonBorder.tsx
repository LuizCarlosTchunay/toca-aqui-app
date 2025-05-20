
import React from "react";
import { cn } from "@/lib/utils";

interface ProfileCardNeonBorderProps {
  position: "top" | "right" | "bottom" | "left";
  isVisible: boolean;
}

const ProfileCardNeonBorder: React.FC<ProfileCardNeonBorderProps> = ({
  position,
  isVisible
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-toca-accent to-transparent";
      case "right":
        return "inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-toca-accent to-transparent";
      case "bottom":
        return "inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-toca-accent to-transparent";
      case "left":
        return "inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-toca-accent to-transparent";
      default:
        return "";
    }
  };
  
  return (
    <div className={cn(
      "absolute",
      getPositionClasses(),
      "opacity-0 transition-opacity duration-300",
      isVisible ? "opacity-100 animate-pulse" : ""
    )} />
  );
};

export default ProfileCardNeonBorder;
