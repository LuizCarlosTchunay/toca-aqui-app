
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import ServicesSection from "./ServicesSection";

interface ProfileSidebarProps {
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
  onBookClick: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  professional,
  onBookClick
}) => {
  return (
    <div>
      <div className="relative">
        <ProfileCard 
          professional={professional} 
          className="mb-6" 
          expanded={true} // Always show expanded view in profile page
        />
        
        {/* Reservar button */}
        <div className="mt-4">
          <Button 
            className="w-full bg-toca-accent hover:bg-toca-accent-hover text-lg py-6"
            onClick={onBookClick}
          >
            <ShoppingCart className="mr-2" />
            Reservar Profissional
          </Button>
        </div>
      </div>
      
      {/* Services card */}
      <ServicesSection 
        services={professional.services}
        instruments={professional.instruments}
        genres={professional.genres}
      />
    </div>
  );
};

export default ProfileSidebar;
