
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface UserAvatarProps {
  showName?: boolean;
  className?: string;
  user?: {
    name?: string;
    image?: string;
  };
  editable?: boolean;
  onEditClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  showName = false,
  className = "",
  user = {
    name: "Usuário",
    image: "",
  },
  editable = false,
  onEditClick,
  size = "md"
}) => {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U";

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link to="/perfil">
        <Avatar className={`border-2 border-toca-accent ${sizeClasses[size]}`}>
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="bg-toca-card text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>
      {showName && (
        <div>
          <p className="font-medium text-white">{user.name}</p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
