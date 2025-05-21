
import React from "react";
import { 
  Music, 
  Disc, 
  Camera, 
  Film, 
  Users, 
  UserRound, 
  MicVocal, 
  Drum, 
  Guitar 
} from "lucide-react";

interface ProfessionalTypeIconProps {
  type: string;
  size?: number;
}

const ProfessionalTypeIcon: React.FC<ProfessionalTypeIconProps> = ({
  type,
  size = 16
}) => {
  // First normalize the type by converting to lowercase and removing accents
  const normalizedType = type?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';

  switch (normalizedType) {
    case "musico":
    case "músico":
      return <Music size={size} />;
    case "voz e violao":
    case "voz e violão":
      return <MicVocal size={size} />;
    case "baterista":
      return <Drum size={size} />;
    case "guitarrista":
      return <Guitar size={size} />;
    case "baixista":
      return <Music size={size} />;
    case "dj":
      return <Disc size={size} />;
    case "fotografo":
    case "fotógrafo":
      return <Camera size={size} />;
    case "filmmaker":
      return <Film size={size} />;
    case "duo":
    case "trio":
    case "banda":
      return <Users size={size} />;
    default:
      return <UserRound size={size} />;
  }
};

export default ProfessionalTypeIcon;
