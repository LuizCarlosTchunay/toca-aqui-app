import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileImage, 
  Link as LinkIcon, 
  Trash2, 
  Plus, 
  Save,
  Loader2,
  Youtube
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PortfolioItem {
  id?: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string | null;
}

interface PortfolioManagerProps {
  professionalId: string;
  onUpdate?: () => void; // Making it optional with ?
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ professionalId, onUpdate }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState<PortfolioItem>({
    profissional_id: professionalId,
    tipo: '',
    url: '',
    descricao: ''
  });

  // Verificar se uma URL é do YouTube
  const isYoutubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
    } catch (e) {
      return false;
    }
  };

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

  // Fetch portfolio items
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!professionalId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .eq("profissional_id", professionalId);
          
        if (error) throw error;
        
        // Map the data to ensure it matches our interface
        setPortfolioItems((data || []).map(item => ({
          id: item.id,
          profissional_id: item.profissional_id || professionalId,
          tipo: item.tipo || '',
          url: item.url || '',
          descricao: item.descricao || ''
        })));
      } catch (error: any) {
        console.error("Error fetching portfolio:", error);
        toast({
          title: "Erro ao carregar portfólio",
          description: error.message || "Ocorreu um erro ao carregar os itens do portfólio.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [professionalId, toast]);

  // Add new portfolio item
  const handleAddItem = async () => {
    if (!newItem.tipo || !newItem.url) {
      toast({
        title: "Informações incompletas",
        description: "Preencha o tipo e URL do item de portfólio.",
        variant: "destructive"
      });
      return;
    }

    // Check if we're adding a YouTube URL and we've already reached the limit
    if (newItem.tipo === "Vídeo YouTube" && youtubeItemCount >= 5) {
      toast({
        title: "Limite atingido",
        description: "Você já adicionou o máximo de 5 vídeos do YouTube.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("portfolio")
        .insert({
          profissional_id: professionalId,
          tipo: newItem.tipo,
          url: newItem.url,
          descricao: newItem.descricao || null
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      setPortfolioItems([...portfolioItems, data as PortfolioItem]);
      setNewItem({
        profissional_id: professionalId,
        tipo: '',
        url: '',
        descricao: ''
      });
      
      toast({
        title: "Item adicionado",
        description: "Item de portfólio adicionado com sucesso.",
      });

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error adding portfolio item:", error);
      toast({
        title: "Erro ao adicionar item",
        description: error.message || "Ocorreu um erro ao adicionar o item ao portfólio.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete portfolio item
  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
      
      toast({
        title: "Item removido",
        description: "Item de portfólio removido com sucesso.",
      });

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Erro ao remover item",
        description: error.message || "Ocorreu um erro ao remover o item do portfólio.",
        variant: "destructive"
      });
    }
  };
  
  // Conta quantos vídeos do YouTube já existem
  const youtubeItemCount = portfolioItems.filter(item => 
    isYoutubeUrl(item.url)
  ).length;

  return (
    <Card className="bg-toca-card border-toca-border shadow-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileImage className="mr-2" size={20} />
          Gerenciar Portfólio
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-toca-accent" />
          </div>
        ) : (
          <>
            {/* YouTube videos section - highlighting the 5 video limit */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Youtube size={18} className="mr-2 text-red-500" />
                Vídeos do YouTube ({youtubeItemCount}/5)
              </h3>
              
              {portfolioItems.some(item => isYoutubeUrl(item.url)) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {portfolioItems
                    .filter(item => isYoutubeUrl(item.url))
                    .map((item) => {
                      const videoId = getYoutubeVideoId(item.url);
                      
                      return (
                        <div 
                          key={item.id} 
                          className="group flex flex-col p-3 bg-toca-background rounded-md border border-toca-border hover:border-toca-accent transition-colors"
                        >
                          {videoId && (
                            <div className="aspect-video mb-3 rounded overflow-hidden bg-black">
                              <img 
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt="YouTube thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{item.tipo}</h4>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-toca-accent hover:underline flex items-center"
                              >
                                <Youtube size={12} className="mr-1" />
                                {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
                              </a>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-toca-text-secondary hover:text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteItem(item.id || "")}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4 text-toca-text-secondary bg-toca-background/30 rounded-md">
                  <Youtube className="mx-auto h-8 w-8 opacity-25 mb-2 text-red-500" />
                  <p>Nenhum vídeo do YouTube adicionado.</p>
                  <p className="text-xs mt-2">Você pode adicionar até 5 vídeos do YouTube para exibir no seu portfólio.</p>
                </div>
              )}
              
              {youtubeItemCount >= 5 && (
                <div className="mt-2 text-sm text-yellow-400">
                  Você atingiu o limite máximo de 5 vídeos do YouTube. Remova algum vídeo existente para adicionar novos.
                </div>
              )}
            </div>

            {/* Other portfolio items */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center">
                <LinkIcon size={18} className="mr-2 text-toca-accent" />
                Outros itens de portfólio
              </h3>
              
              {portfolioItems.some(item => !isYoutubeUrl(item.url)) ? (
                <div className="space-y-3">
                  {portfolioItems
                    .filter(item => !isYoutubeUrl(item.url))
                    .map((item) => (
                      <div 
                        key={item.id} 
                        className="group flex items-center justify-between p-3 bg-toca-background rounded-md border border-toca-border hover:border-toca-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-toca-accent/10">
                            <AvatarImage src="" alt="" />
                            <AvatarFallback className="bg-toca-accent/20 text-toca-accent">
                              {item.tipo.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-white font-medium">{item.tipo}</h4>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-toca-accent hover:underline flex items-center"
                            >
                              <LinkIcon size={12} className="mr-1" />
                              {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
                            </a>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-toca-text-secondary hover:text-red-500 focus:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteItem(item.id || "")}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-toca-text-secondary bg-toca-background/30 rounded-md">
                  <LinkIcon className="mx-auto h-8 w-8 opacity-25 mb-2" />
                  <p>Nenhum item regular adicionado.</p>
                </div>
              )}
            </div>

            {/* Add new item form */}
            <div className="mt-6 pt-6 border-t border-toca-border">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Plus size={16} className="mr-1 text-toca-accent" />
                Adicionar novo item
              </h3>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="item-type" className="block text-sm text-toca-text-secondary mb-1">
                      Tipo de Item*
                    </label>
                    <Select
                      value={newItem.tipo}
                      onValueChange={(value) => setNewItem({...newItem, tipo: value})}
                    >
                      <SelectTrigger id="item-type" className="bg-toca-background border-toca-border">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vídeo YouTube">
                          <div className="flex items-center">
                            <Youtube size={16} className="mr-2 text-red-500" />
                            Vídeo YouTube
                          </div>
                        </SelectItem>
                        <SelectItem value="Link para Site">
                          <div className="flex items-center">
                            <LinkIcon size={16} className="mr-2" />
                            Link para Site
                          </div>
                        </SelectItem>
                        <SelectItem value="Foto">Foto</SelectItem>
                        <SelectItem value="Áudio">Áudio</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="item-url" className="block text-sm text-toca-text-secondary mb-1">
                      URL / Link*
                    </label>
                    <Input
                      id="item-url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                      placeholder={newItem.tipo === "Vídeo YouTube" ? "https://youtube.com/watch?v=..." : "https://..."}
                      className="bg-toca-background border-toca-border"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="item-description" className="block text-sm text-toca-text-secondary mb-1">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    id="item-description"
                    value={newItem.descricao || ''}
                    onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
                    placeholder="Breve descrição do item..."
                    className="bg-toca-background border-toca-border resize-none h-20"
                  />
                </div>
                
                {/* Validação para URL do YouTube */}
                {newItem.tipo === "Vídeo YouTube" && newItem.url && !isYoutubeUrl(newItem.url) && (
                  <div className="text-red-400 text-sm">
                    A URL não parece ser um link válido do YouTube. Use formatos como https://youtube.com/watch?v=... ou https://youtu.be/...
                  </div>
                )}
                
                {/* Aviso de limite de vídeos */}
                {newItem.tipo === "Vídeo YouTube" && youtubeItemCount >= 5 && (
                  <div className="text-yellow-400 text-sm">
                    Você já atingiu o limite máximo de 5 vídeos do YouTube. Remova algum vídeo existente para adicionar novos.
                  </div>
                )}
                
                {/* Preview se for URL do YouTube */}
                {newItem.tipo === "Vídeo YouTube" && isYoutubeUrl(newItem.url) && (
                  <div className="bg-black/30 p-3 rounded-md">
                    <h4 className="text-sm text-white mb-2">Preview:</h4>
                    <div className="aspect-video max-w-xs mx-auto">
                      {getYoutubeVideoId(newItem.url) ? (
                        <img 
                          src={`https://img.youtube.com/vi/${getYoutubeVideoId(newItem.url)}/mqdefault.jpg`}
                          alt="YouTube thumbnail"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black rounded-md">
                          <Youtube className="text-red-500" size={48} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end border-t border-toca-border pt-4">
        <Button 
          onClick={handleAddItem} 
          className="bg-toca-accent hover:bg-toca-accent-hover"
          disabled={
            isSaving || 
            !newItem.tipo || 
            !newItem.url || 
            (newItem.tipo === "Vídeo YouTube" && !isYoutubeUrl(newItem.url)) ||
            (newItem.tipo === "Vídeo YouTube" && youtubeItemCount >= 5)
          }
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Adicionar Item
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortfolioManager;
