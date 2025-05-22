
import React from "react";
import { Youtube } from "lucide-react";

interface ProfileCardSocialLinksProps {
  youtube?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({
  youtube
}) => {
  // Completely remove the rendering of YouTube links in this component
  return null;
};

export default ProfileCardSocialLinks;
