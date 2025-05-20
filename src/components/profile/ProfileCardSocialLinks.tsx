
import React from "react";
import { Instagram, Youtube } from "lucide-react";

interface ProfileCardSocialLinksProps {
  instagram?: string;
  youtube?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({
  instagram,
  youtube
}) => {
  if (!instagram && !youtube) {
    return null;
  }
  
  return (
    <div className="flex gap-3 mt-2">
      {instagram && (
        <a 
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Instagram size={16} />
        </a>
      )}
      {youtube && (
        <a 
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Youtube size={16} />
        </a>
      )}
    </div>
  );
};

export default ProfileCardSocialLinks;
