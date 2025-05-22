
import React, { useState } from "react";
import { Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProfileCardSocialLinksProps {
  youtube?: string;
}

const ProfileCardSocialLinks: React.FC<ProfileCardSocialLinksProps> = ({
  youtube
}) => {
  const [showYoutubeVideo, setShowYoutubeVideo] = useState(false);
  
  if (!youtube) {
    return null;
  }
  
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
  
  const videoId = youtube ? getYoutubeVideoId(youtube) : null;
  
  return (
    <>
      <div className="flex gap-3 mt-2">
        {youtube && (
          <a 
            href="#"
            className="text-red-500 hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowYoutubeVideo(true);
            }}
          >
            <Youtube size={16} />
          </a>
        )}
      </div>
      
      {/* Modal para exibir vídeo do YouTube */}
      <Dialog open={showYoutubeVideo} onOpenChange={setShowYoutubeVideo}>
        <DialogContent className="sm:max-w-[800px] bg-toca-background border-toca-border">
          <DialogHeader>
            <DialogTitle className="text-white">Vídeo do Portfólio</DialogTitle>
          </DialogHeader>
          {videoId ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
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
    </>
  );
};

export default ProfileCardSocialLinks;
