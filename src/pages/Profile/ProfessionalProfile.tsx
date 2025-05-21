
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import AboutSection from "@/components/profile/AboutSection";
import PortfolioSection from "@/components/profile/PortfolioSection";
import ReviewsSection from "@/components/profile/ReviewsSection";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileErrorState from "@/components/profile/ProfileErrorState";
import { useProfessionalData } from "@/hooks/useProfessionalData";

const ProfessionalProfile = () => {
  const { user } = useAuth();
  const {
    professional,
    portfolioItems,
    isProfessionalLoading,
    isPortfolioLoading,
    isProfessionalError,
    isNavigating,
    retryCount,
    setRetryCount,
    refetchProfessional,
    handleGoBack,
    handleBookProfessional
  } = useProfessionalData();

  // Show loading state during navigation to prevent black screens
  if (isNavigating) {
    return <ProfileLoadingState isAuthenticated={!!user} />;
  }

  if (isProfessionalLoading) {
    return <ProfileLoadingState isAuthenticated={!!user} />;
  }

  if (isProfessionalError || !professional) {
    return (
      <ProfileErrorState 
        isAuthenticated={!!user}
        onRetry={() => {
          setRetryCount(prev => prev + 1);
          refetchProfessional();
        }}
        onBack={handleGoBack}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={handleGoBack}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <ProfileSidebar 
            professional={professional}
            onBookClick={handleBookProfessional}
          />
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* About card */}
            <AboutSection 
              bio={professional.bio} 
              name={professional.artisticName || professional.name} 
            />
            
            {/* Portfolio card */}
            <PortfolioSection 
              portfolioItems={portfolioItems || []}
              isLoading={isPortfolioLoading}
              instagram={professional.instagram}
              youtube={professional.youtube}
            />
            
            {/* Reviews card */}
            <ReviewsSection professionalId={professional.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
