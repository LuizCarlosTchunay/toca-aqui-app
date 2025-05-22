
import React from "react";

interface ProfileCardSocialLinksProps {
  youtube?: string;
  instagram?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({ youtube, instagram }) => {
  // This component now works with the portfolio YouTube links
  // All YouTube links are handled in the PortfolioSection component
  return null;
};

export default ProfileCardSocialLinks;
