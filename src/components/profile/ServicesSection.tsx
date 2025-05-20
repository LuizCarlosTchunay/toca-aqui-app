
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServicesSectionProps {
  services?: string[];
  instruments?: string[];
  genres?: string[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  instruments,
  genres
}) => {
  return (
    <Card className="bg-toca-card border-toca-border mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Services list */}
        <div className="flex flex-wrap gap-2">
          {(services && services.length > 0) ? (
            services.map((service, index) => (
              <Badge key={index} className="bg-toca-background border-toca-border text-white">
                {service}
              </Badge>
            ))
          ) : instruments && instruments.length > 0 ? (
            instruments.map((instrument, index) => (
              <Badge key={index} className="bg-toca-background border-toca-border text-white">
                {instrument}
              </Badge>
            ))
          ) : (
            <p className="text-toca-text-secondary">Nenhum serviço cadastrado</p>
          )}
        </div>
        
        {/* Genres list */}
        {genres && genres.length > 0 && (
          <>
            <h4 className="text-white font-medium mt-4 mb-2">Gêneros</h4>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <Badge key={index} className="bg-toca-background border-toca-border text-white">
                  {genre}
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesSection;
