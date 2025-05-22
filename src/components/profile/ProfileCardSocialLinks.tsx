
import React from "react";
import { Instagram, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileCardSocialLinksProps {
  youtube?: string;
  instagram?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({ youtube, instagram }) => {
  if (!youtube && !instagram) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {youtube && (
        <a 
          href={youtube} 
          target="_blank" 
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Badge className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 cursor-pointer">
            <Youtube size={14} />
            YouTube
          </Badge>
        </a>
      )}
      
      {instagram && (
        <a 
          href={instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-1 cursor-pointer">
            <Instagram size={14} />
            Instagram
          </Badge>
        </a>
      )}
    </div>
  );
};

export default ProfileCardSocialLinks;
