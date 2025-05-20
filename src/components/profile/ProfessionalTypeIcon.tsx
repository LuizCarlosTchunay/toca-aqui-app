
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
  switch (type.toLowerCase()) {
    case "músico":
    case "musico":
      return <Music size={size} />;
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
    case "fotógrafo":
    case "fotografo":
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
