
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfessionalProfile } from "@/hooks/useProfessionalProfile";
import ImageUploadSection from "@/components/professional-profile/ImageUploadSection";
import BasicProfileFields from "@/components/professional-profile/BasicProfileFields";
import ServicesSection from "@/components/professional-profile/ServicesSection";
import AdditionalFields from "@/components/professional-profile/AdditionalFields";
import FormActions from "@/components/professional-profile/FormActions";
import PortfolioManager from "@/components/PortfolioManager";

const EditProfile = () => {
  const {
    user,
    profileData,
    profileImageUrl,
    isLoading,
    isSaving,
    isNavigating,
    services,
    setServices,
    existingProfessionalId,
    loadedData,
    otherType,
    setOtherType,
    handleChange,
    handleImageChange,
    handleNavigate,
    saveProfileData,
  } = useProfessionalProfile();

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await saveProfileData();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, [saveProfileData]);

  const handleCancel = React.useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      handleNavigate("/dashboard");
    } catch (error) {
      console.error("Error navigating:", error);
      // Fallback navigation for Chrome compatibility
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    }
  }, [handleNavigate]);

  // Enhanced loading state with Chrome compatibility
  if (isLoading && !loadedData) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-toca-text-secondary">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure user is available before rendering with Chrome fallback
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={false} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-toca-text-secondary">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="profissional" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Editar Perfil Profissional</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUploadSection 
                profileImageUrl={profileImageUrl}
                onImageChange={handleImageChange}
                existingProfessionalId={existingProfessionalId}
              />
              
              <BasicProfileFields 
                profileData={profileData}
                otherType={otherType}
                setOtherType={setOtherType}
                handleChange={handleChange}
              />
              
              <ServicesSection 
                services={services} 
                setServices={setServices}
              />
              
              <AdditionalFields 
                profileData={profileData}
                handleChange={handleChange}
              />
              
              <FormActions
                isLoading={isLoading}
                isSaving={isSaving}
                isNavigating={isNavigating}
                onCancel={handleCancel}
              />
            </form>
          </CardContent>
        </Card>
        
        {/* Portfolio Manager - only show once we have a professional ID */}
        {existingProfessionalId && (
          <div className="mt-8">
            <PortfolioManager 
              professionalId={existingProfessionalId} 
              onUpdate={() => {
                console.log("Portfolio updated");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
