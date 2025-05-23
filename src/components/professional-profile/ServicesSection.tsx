
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface ServicesSectionProps {
  services: string[];
  setServices: React.Dispatch<React.SetStateAction<string[]>>;
}

const ServicesSection = ({ services, setServices }: ServicesSectionProps) => {
  const [newService, setNewService] = useState<string>("");

  // Add a new service to the list
  const handleAddService = () => {
    if (!newService.trim()) return;
    
    if (!services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    } else {
      toast.error("Este serviço já foi adicionado");
    }
  };
  
  // Remove a service from the list
  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="services" className="text-white text-lg">Serviços Oferecidos</Label>
      <div className="flex flex-wrap gap-2 p-3 bg-toca-background rounded-md border border-toca-border">
        {services.length > 0 ? (
          services.map((service, index) => (
            <Badge 
              key={index} 
              className="bg-toca-accent/20 hover:bg-toca-accent/30 text-white flex items-center gap-1"
            >
              {service}
              <button 
                type="button" 
                onClick={() => handleRemoveService(service)}
                className="ml-1 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-toca-text-secondary text-sm">Nenhum serviço adicionado ainda. Adicione seus serviços abaixo.</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input 
          id="newService" 
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="Ex: DJ para festas, Música para casamentos..."
          className="bg-toca-background border-toca-border text-white flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddService();
            }
          }}
        />
        <Button 
          type="button" 
          onClick={handleAddService}
          className="bg-toca-accent hover:bg-toca-accent-hover"
        >
          <Plus size={16} className="mr-1" /> Adicionar
        </Button>
      </div>
      <p className="text-xs text-toca-text-secondary">
        Pressione Enter ou clique em Adicionar para incluir um serviço. Estes serviços ficarão visíveis no seu perfil.
      </p>
    </div>
  );
};

export default ServicesSection;
