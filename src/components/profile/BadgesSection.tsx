
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BadgesSectionProps {
  title: string;
  items?: string[];
}

const BadgesSection = ({ title, items = [] }: BadgesSectionProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card className="bg-toca-card border-toca-border shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} className="bg-toca-background border-toca-border text-white">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesSection;
