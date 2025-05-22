
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

  let IconComponent;
  
  switch (normalizedType) {
    case "musico":
    case "músico":
      IconComponent = Music;
      break;
    case "voz e violao":
    case "voz e violão":
      IconComponent = MicVocal;
      break;
    case "baterista":
      IconComponent = Drum;
      break;
    case "guitarrista":
      IconComponent = Guitar;
      break;
    case "baixista":
      IconComponent = Music;
      break;
    case "dj":
      IconComponent = Disc;
      break;
    case "fotografo":
    case "fotógrafo":
      IconComponent = Camera;
      break;
    case "filmmaker":
      IconComponent = Film;
      break;
    case "duo":
    case "trio":
    case "banda":
      IconComponent = Users;
      break;
    default:
      IconComponent = UserRound;
      break;
  }
  
  return <IconComponent size={size} />;
};

export default ProfessionalTypeIcon;
