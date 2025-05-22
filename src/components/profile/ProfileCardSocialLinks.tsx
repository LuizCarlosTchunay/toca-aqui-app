
import React from "react";
import { Youtube } from "lucide-react";

interface ProfileCardSocialLinksProps {
  youtube?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({
  youtube
}) => {
  if (!youtube) {
    return null;
  }
  
  return (
    <div className="flex gap-3 mt-2">
      {youtube && (
        <a 
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-400 transition-colors"
        >
          <Youtube size={16} />
        </a>
      )}
    </div>
  );
};

export default ProfileCardSocialLinks;
