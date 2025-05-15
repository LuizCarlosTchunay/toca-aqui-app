
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would upload the image to a server
    if (profileImage) {
      console.log("New profile image selected:", profileImage.name);
      // Here you would typically upload the file to your backend
    }
    
    toast.success("Perfil atualizado com sucesso!");
    navigate("/dashboard");
  };

  const handleImageChange = (imageFile: File) => {
    setProfileImage(imageFile);
  };

  // Mock user data for demonstration
  const user = {
    name: "DJ Pulse",
    image: "" // Empty by default to show the placeholder
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} currentRole="profissional" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Editar Perfil Profissional</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <ImageUploader 
                  currentImage={user.image}
                  onImageChange={handleImageChange}
                  size="lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artisticName" className="text-white">Nome Artístico</Label>
                <Input 
                  id="artisticName" 
                  defaultValue="DJ Pulse" 
                  className="bg-toca-background border-toca-border text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileType" className="text-white">Tipo de Profissional</Label>
                <Select defaultValue="dj">
                  <SelectTrigger className="bg-toca-background border-toca-border text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dj">DJ</SelectItem>
                    <SelectItem value="musico">Músico</SelectItem>
                    <SelectItem value="fotografo">Fotógrafo</SelectItem>
                    <SelectItem value="filmmaker">Filmmaker</SelectItem>
                    <SelectItem value="tecnico_som">Técnico de Som</SelectItem>
                    <SelectItem value="tecnico_luz">Técnico de Luz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Biografia</Label>
                <Textarea 
                  id="bio" 
                  defaultValue="DJ com experiência em eventos corporativos e casamentos. Especialista em música eletrônica e house."
                  className="bg-toca-background border-toca-border text-white min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">Cidade</Label>
                  <Input 
                    id="city" 
                    defaultValue="São Paulo" 
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">Estado</Label>
                  <Input 
                    id="state" 
                    defaultValue="SP" 
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-white">Cachê por Hora (R$)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    defaultValue="150" 
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventRate" className="text-white">Cachê por Evento (R$)</Label>
                  <Input 
                    id="eventRate" 
                    type="number" 
                    defaultValue="1200" 
                    className="bg-toca-background border-toca-border text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="border-toca-border text-white"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
