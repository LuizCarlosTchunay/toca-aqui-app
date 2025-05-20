
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutSectionProps {
  bio?: string;
  name: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ bio, name }) => {
  return (
    <Card className="bg-toca-card border-toca-border mb-6">
      <CardHeader>
        <CardTitle>Sobre</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-toca-text-primary">
          {bio || `${name} ainda não adicionou uma descrição ao perfil.`}
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
