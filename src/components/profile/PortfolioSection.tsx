
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, LinkIcon, Instagram, Youtube } from "lucide-react";

interface PortfolioItem {
  id: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string | null;
}

interface PortfolioSectionProps {
  portfolioItems: PortfolioItem[];
  instagram?: string;
  youtube?: string;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolioItems,
  instagram,
  youtube
}) => {
  return (
    <Card className="bg-toca-card border-toca-border mb-6">
      <CardHeader>
        <CardTitle>Portfólio</CardTitle>
      </CardHeader>
      <CardContent>
        {portfolioItems && portfolioItems.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {portfolioItems && portfolioItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-toca-background border-toca-border overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium truncate">
                              {item.tipo || "Item de portfólio"}
                            </h3>
                            <a 
                              href={item.url || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-toca-accent hover:text-toca-accent-hover"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                          
                          {item.url && (
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-toca-accent hover:underline flex items-center"
                            >
                              <LinkIcon size={12} className="mr-1" />
                              {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
                            </a>
                          )}
                          
                          {item.descricao && (
                            <p className="text-sm text-toca-text-secondary mt-2">
                              {item.descricao}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 lg:-left-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
            <CarouselNext className="-right-4 lg:-right-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
          </Carousel>
        ) : (
          <div className="text-center text-toca-text-secondary py-6">
            {instagram || youtube ? (
              <div>
                <p className="mb-3">Este profissional ainda não adicionou itens ao portfólio, mas você pode conferir suas redes sociais:</p>
                <div className="flex justify-center gap-4">
                  {instagram && (
                    <a 
                      href={instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                  {youtube && (
                    <a 
                      href={youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Youtube size={24} />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p>Este profissional ainda não adicionou itens ao portfólio.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSection;
