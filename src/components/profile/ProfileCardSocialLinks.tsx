
import React from "react";

interface ProfileCardSocialLinksProps {
  youtube?: string;
  instagram?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({ youtube, instagram }) => {
  // This component no longer renders YouTube links as they are handled in the portfolio section
  return null;
};

export default ProfileCardSocialLinks;
