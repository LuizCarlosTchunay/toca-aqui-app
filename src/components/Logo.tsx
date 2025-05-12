
import React from "react";

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  withText = true,
  size = "md",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/lovable-uploads/f12c55d4-4a13-4004-b92b-80e3a67ecd61.png"
        alt="Toca Aqui Logo"
        className={`${sizes[size]} rounded-md`}
      />
      {withText && (
        <span className="font-bold text-xl tracking-tight">
          <span className="text-white">Toca</span>
          <span className="text-toca-accent">Aqui</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
