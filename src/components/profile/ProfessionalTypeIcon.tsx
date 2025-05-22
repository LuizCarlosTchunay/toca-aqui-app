
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
  Guitar,
  Radio,
  PenTool,
  Bass,
  Mic,
  Piano,
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
    case "voz e violao":
    case "voz e violão":
    case "violão e voz":
    case "violao e voz":
      IconComponent = MicVocal;
      break;
    case "baterista":
      IconComponent = Drum;
      break;
    case "guitarrista":
      IconComponent = Guitar;
      break;
    case "baixista":
      IconComponent = Bass;
      break;
    case "cantor":
    case "cantora":
    case "vocalista":
      IconComponent = Mic;
      break;
    case "pianista":
    case "tecladista":
      IconComponent = Piano;
      break;
    case "dj":
    case "disk jockey":
      IconComponent = Disc;
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
    case "duo":
    case "trio":
    case "banda":
    case "grupo":
    case "orquestra":
      IconComponent = Users;
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
  
  console.log(`Rendering icon for type: ${type}, normalized: ${normalizedType}`);
  return <IconComponent size={size} />;
};

export default ProfessionalTypeIcon;
