
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageFile: File) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  bucketName?: string;
  objectPath?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  className,
  size = "md",
  bucketName = "profile_images",
  objectPath,
}) => {
  const { user } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  // Fetch image from Supabase storage if objectPath is provided
  useEffect(() => {
    const fetchImage = async () => {
      if (!objectPath) return;
      
      try {
        // Try to get public URL first
        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(objectPath);
        
        if (data && data.publicUrl) {
          setPreviewUrl(data.publicUrl);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    
    if (bucketName && objectPath) {
      fetchImage();
    }
  }, [bucketName, objectPath]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // Pass the file to parent component
    onImageChange(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "relative rounded-full overflow-hidden bg-toca-background border-2 border-toca-accent mb-4 cursor-pointer group",
          sizeClasses[size]
        )}
        onClick={handleButtonClick}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-toca-background">
            <User size={size === "sm" ? 32 : size === "md" ? 48 : 64} className="text-toca-text-secondary" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={24} className="text-white" />
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="text-toca-accent border-toca-accent hover:bg-toca-accent hover:text-white"
        onClick={handleButtonClick}
      >
        <Camera size={16} className="mr-2" />
        {previewUrl ? "Alterar foto" : "Adicionar foto"}
      </Button>
    </div>
  );
};

export default ImageUploader;
