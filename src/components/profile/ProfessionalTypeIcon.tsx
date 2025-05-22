
import React from "react";
import { 
  Music, 
  Disc, 
  Camera, 
  Film, 
  Users, 
  UserRound, 
  Radio,
  PenTool,
  Mic,
  LucideIcon
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

  // Define the icon component
  let IconComponent: LucideIcon;
  
  switch (normalizedType) {
    case "musico":
    case "músico":
      IconComponent = Music;
      break;
    case "dj":
      IconComponent = Disc;
      break;
    case "duo":
      IconComponent = Users;
      break;
    case "trio":
      IconComponent = Users;
      break;
    case "banda":
      IconComponent = Users;
      break;
    case "fotografo":
    case "fotógrafo":
    case "fotografa":
    case "fotógrafa":
      IconComponent = Camera;
      break;
    case "filmmaker":
    case "video maker":
    case "videomaker":
    case "cinegrafista":
      IconComponent = Film;
      break;
    case "tecnico_som":
    case "técnico_som":
    case "tecnico de som":
    case "técnico de som":
    case "sonorizador":
      IconComponent = Radio;
      break;
    case "tecnico_luz":
    case "técnico_luz":
    case "tecnico de luz":
    case "técnico de luz":
    case "iluminador":
      IconComponent = PenTool;
      break;
    default:
      IconComponent = UserRound;
      break;
  }
  
  return <IconComponent size={size} />;
};

export default ProfessionalTypeIcon;
