
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
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PortfolioItem {
  id?: string;
  profissional_id: string;
  tipo: string;
  url: string;
  descricao?: string;
}

interface PortfolioManagerProps {
  professionalId: string;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ professionalId }) => {
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
        
        setPortfolioItems(data || []);
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

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("portfolio")
        .insert({
          profissional_id: professionalId,
          tipo: newItem.tipo,
          url: newItem.url,
          descricao: newItem.descricao
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      setPortfolioItems([...portfolioItems, data]);
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
    } catch (error: any) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Erro ao remover item",
        description: error.message || "Ocorreu um erro ao remover o item do portfólio.",
        variant: "destructive"
      });
    }
  };

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
            {/* Portfolio items list */}
            {portfolioItems.length > 0 ? (
              <div className="space-y-3">
                {portfolioItems.map((item) => (
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
              <div className="text-center py-8 text-toca-text-secondary">
                <FileImage className="mx-auto h-12 w-12 opacity-25 mb-3" />
                <p>Nenhum item de portfólio adicionado ainda.</p>
                <p className="text-sm">Adicione links para seus trabalhos, vídeos ou fotos de apresentações.</p>
              </div>
            )}

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
                    <Input
                      id="item-type"
                      value={newItem.tipo}
                      onChange={(e) => setNewItem({...newItem, tipo: e.target.value})}
                      placeholder="Ex: Vídeo, Foto, Link"
                      className="bg-toca-background border-toca-border"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="item-url" className="block text-sm text-toca-text-secondary mb-1">
                      URL / Link*
                    </label>
                    <Input
                      id="item-url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                      placeholder="https://..."
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
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end border-t border-toca-border pt-4">
        <Button 
          onClick={handleAddItem} 
          className="bg-toca-accent hover:bg-toca-accent-hover"
          disabled={isSaving || !newItem.tipo || !newItem.url}
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
