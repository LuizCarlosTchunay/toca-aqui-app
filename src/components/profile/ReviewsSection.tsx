
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReviewsSection: React.FC = () => {
  return (
    <Card className="bg-toca-card border-toca-border">
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-toca-text-secondary py-6">
          Este profissional ainda não possui avaliações.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
