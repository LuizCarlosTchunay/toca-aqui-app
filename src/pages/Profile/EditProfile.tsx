
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
import ChromeDebugPanel from "@/components/ChromeDebugPanel";
import { useChromeCompatibleNavigation } from "@/hooks/useChromeCompatibleNavigation";

const EditProfile = () => {
  const { safeNavigate, isNavigating: navIsNavigating, debugLog } = useChromeCompatibleNavigation();
  
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
    saveProfileData,
  } = useProfessionalProfile();

  const combinedIsNavigating = isNavigating || navIsNavigating;

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    debugLog('Form submit started');
    
    try {
      e.preventDefault();
      e.stopPropagation();
      
      debugLog('Calling saveProfileData');
      const success = await saveProfileData();
      
      if (success) {
        debugLog('Profile saved successfully, navigating to dashboard');
        // Navigate after successful save
        setTimeout(() => {
          safeNavigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        debugLog('Profile save failed');
      }
    } catch (error) {
      debugLog('Error in form submit', error);
      console.error("Error saving profile:", error);
    }
  }, [saveProfileData, safeNavigate, debugLog]);

  const handleCancel = React.useCallback((e?: React.MouseEvent) => {
    debugLog('Cancel action started');
    
    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      debugLog('Navigating to dashboard');
      safeNavigate("/dashboard", { replace: true });
    } catch (error) {
      debugLog('Error in cancel action', error);
      console.error("Error navigating:", error);
    }
  }, [safeNavigate, debugLog]);

  // Enhanced loading state
  if (isLoading && !loadedData) {
    debugLog('Rendering loading state');
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <ChromeDebugPanel />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-toca-text-secondary">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // User check
  if (!user) {
    debugLog('No user found, rendering auth check');
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={false} />
        <ChromeDebugPanel />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-toca-text-secondary">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  debugLog('Rendering main content');

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="profissional" />
      <ChromeDebugPanel />
      
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
                isNavigating={combinedIsNavigating}
                onCancel={handleCancel}
              />
            </form>
          </CardContent>
        </Card>
        
        {existingProfessionalId && (
          <div className="mt-8">
            <PortfolioManager 
              professionalId={existingProfessionalId} 
              onUpdate={() => {
                debugLog("Portfolio updated");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
