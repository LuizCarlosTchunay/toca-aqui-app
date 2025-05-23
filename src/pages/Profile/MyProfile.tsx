
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useProfessionalProfileData } from "@/hooks/useProfessionalProfileData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RatesDisplay from "@/components/profile/RatesDisplay";
import BadgesSection from "@/components/profile/BadgesSection";
import AboutSection from "@/components/profile/AboutSection";
import PortfolioManager from "@/components/PortfolioManager";

const MyProfile = () => {
  const {
    user,
    professional,
    profileImage,
    isLoading,
    isNavigating,
    activeTab,
    setActiveTab,
    refreshProfileData,
  } = useProfessionalProfileData();

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={!!user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-toca-accent" />
          </div>
          <p className="text-center text-toca-text-secondary">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile sidebar */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-toca-card border-toca-border shadow-md mb-6">
              <CardContent className="pt-6">
                <ProfileHeader 
                  professional={professional} 
                  profileImage={profileImage}
                  isNavigating={isNavigating}
                />
                
                <RatesDisplay 
                  hourlyRate={professional?.cache_hora} 
                  eventRate={professional?.cache_evento}
                />
              </CardContent>
            </Card>
            
            <BadgesSection 
              title="Especialidades" 
              items={professional?.instrumentos}
            />
            
            <BadgesSection 
              title="Serviços" 
              items={professional?.servicos}
            />
            
            <BadgesSection 
              title="Gêneros" 
              items={professional?.subgeneros}
            />
          </div>
          
          {/* Main content */}
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-toca-card border-toca-border mb-6 w-full">
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 data-[state=active]:bg-toca-accent data-[state=active]:text-white"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio" 
                  className="flex-1 data-[state=active]:bg-toca-accent data-[state=active]:text-white"
                >
                  Portfólio
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <AboutSection 
                  bio={professional?.bio} 
                  name={professional?.nome_artistico || "Você"} 
                />
              </TabsContent>
              
              <TabsContent value="portfolio">
                {professional?.id ? (
                  <PortfolioManager 
                    professionalId={professional.id} 
                    onUpdate={refreshProfileData} 
                  />
                ) : (
                  <Card className="bg-toca-card border-toca-border shadow-md">
                    <CardContent className="py-12">
                      <div className="text-center text-toca-text-secondary">
                        <p>Você precisa completar seu perfil profissional antes de adicionar itens ao portfólio.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
