
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PortfolioItem {
  id: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string | null;
}

interface PortfolioSectionProps {
  portfolioItems: PortfolioItem[];
  youtube?: string;
  instagram?: string;
  isLoading?: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolioItems,
  youtube,
  instagram,
  isLoading = false
}) => {
  // Using a controlled dialog state instead of just a URL string
  const [videoDialogState, setVideoDialogState] = useState<{
    isOpen: boolean;
    videoUrl: string | null;
  }>({
    isOpen: false,
    videoUrl: null
  });

  // Função para extrair o ID do vídeo do YouTube de uma URL
  const getYoutubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      
      // Formato padrão youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('/watch')) {
        return urlObj.searchParams.get('v');
      }
      
      // Formato abreviado youtu.be/VIDEO_ID
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.substring(1);
      }
      
      return null;
    } catch (e) {
      console.error("URL inválida do YouTube:", e);
      return null;
    }
  };

  // Collect all YouTube videos (up to 5) from portfolio items and the main YouTube URL
  const youtubeVideos: string[] = [];

  // Add the main YouTube URL if it exists
  if (youtube) {
    youtubeVideos.push(youtube);
  }

  // Add YouTube videos from portfolio items
  if (portfolioItems && portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      if (youtubeVideos.length < 5 && // Limit to 5 videos total
          item.url && 
          (item.url.includes('youtube.com') || item.url.includes('youtu.be'))) {
        youtubeVideos.push(item.url);
      }
    });
  }

  // Handle video clicks - explicitly controls dialog state
  const handleVideoClick = (e: React.MouseEvent, url: string) => {
    // Prevent event bubbling and default behavior
    e.stopPropagation();
    e.preventDefault();
    
    setVideoDialogState({
      isOpen: true,
      videoUrl: url
    });
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setVideoDialogState({
      isOpen: false,
      videoUrl: null
    });
  };

  return (
    <Card className="bg-toca-card border-toca-border mb-6">
      <CardHeader>
        <CardTitle>Portfólio</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-toca-accent"></div>
          </div>
        ) : portfolioItems && portfolioItems.length > 0 ? (
          <div className="space-y-6">
            {/* Videos do YouTube - Exibição dos vídeos disponíveis */}
            {youtubeVideos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Vídeos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {youtubeVideos.slice(0, 5).map((url, index) => {
                    const videoId = getYoutubeVideoId(url);
                    if (!videoId) return null;
                    
                    return (
                      <div 
                        key={`youtube-${index}`} 
                        className="aspect-video rounded-md overflow-hidden border border-toca-border cursor-pointer hover:border-toca-accent transition-colors relative"
                        onClick={(e) => handleVideoClick(e, url)}
                      >
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                          alt="Thumbnail do YouTube"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-40 rounded-full p-3 hover:bg-opacity-60 transition-opacity">
                            {/* Play button icon */}
                            <div className="h-12 w-12 flex items-center justify-center">
                              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Regular portfolio items */}
            <Carousel className="w-full">
              <CarouselContent>
                {portfolioItems && portfolioItems.map((item) => {
                  // Skip YouTube items that were already displayed above
                  if (item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'))) {
                    return null;
                  }
                  
                  return (
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
                                  onClick={(e) => e.stopPropagation()} // Prevent event bubbling
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
                                  onClick={(e) => e.stopPropagation()} // Prevent event bubbling
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
                  );
                }).filter(Boolean)}
              </CarouselContent>
              <CarouselPrevious className="-left-4 lg:-left-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
              <CarouselNext className="-right-4 lg:-right-5 bg-toca-accent text-white hover:bg-toca-accent-hover border-none" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center text-toca-text-secondary py-6">
            {youtube ? (
              <div>
                <p className="mb-3">Este profissional ainda não adicionou itens ao portfólio, mas você pode conferir seus vídeos:</p>
                <div className="flex justify-center">
                  <div 
                    className="aspect-video w-full max-w-md rounded-md overflow-hidden border border-toca-border cursor-pointer hover:border-toca-accent transition-colors"
                    onClick={(e) => {
                      // Prevent event bubbling
                      e.stopPropagation();
                      e.preventDefault();
                      youtube && handleVideoClick(e, youtube);
                    }}
                  >
                    {getYoutubeVideoId(youtube) ? (
                      <>
                        <img 
                          src={`https://img.youtube.com/vi/${getYoutubeVideoId(youtube)}/hqdefault.jpg`} 
                          alt="Thumbnail do YouTube"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const videoId = getYoutubeVideoId(youtube);
                            if (videoId) {
                              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-40 rounded-full p-3 hover:bg-opacity-60 transition-opacity">
                            {/* Play button icon */}
                            <div className="h-12 w-12 flex items-center justify-center">
                              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/30">
                        <span className="text-white font-medium">Vídeo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>Este profissional ainda não adicionou itens ao portfólio.</p>
            )}
          </div>
        )}
      </CardContent>

      {/* Modal para reproduzir o vídeo selecionado */}
      <Dialog 
        open={videoDialogState.isOpen} 
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="sm:max-w-[800px] bg-toca-background border-toca-border">
          <DialogHeader>
            <DialogTitle className="text-white">Vídeo do Portfólio</DialogTitle>
          </DialogHeader>
          {videoDialogState.videoUrl && getYoutubeVideoId(videoDialogState.videoUrl) ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(videoDialogState.videoUrl)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              />
            </div>
          ) : (
            <div className="text-center p-4 text-toca-text-secondary">
              Não foi possível carregar o vídeo. Verifique se o link está correto.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PortfolioSection;
