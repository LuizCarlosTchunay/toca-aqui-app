
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSafeState } from "@/hooks/useSafeState";

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange?: (imageFile: File, imageUrl?: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  bucketName?: string;
  objectPath?: string;
  children?: React.ReactNode;
  onImageUpload?: (imageFile: File, imageUrl?: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  onImageUpload,
  className,
  size = "md",
  bucketName = "profile_images",
  objectPath,
  children
}) => {
  const { user } = useAuth();
  const [previewUrl, setPreviewUrl] = useSafeState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useSafeState(false);
  const [imageChecked, setImageChecked] = useSafeState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  // Use the onImageUpload prop as a fallback if onImageChange is not provided
  const handleImageChange = onImageChange || onImageUpload;

  // Stable fetch function to prevent re-creation
  const fetchImage = useCallback(async () => {
    if (!objectPath || !bucketName || imageChecked || !mountedRef.current) return;
    
    try {
      console.log("Checking for existing image:", objectPath);
      
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(objectPath);
      
      if (data && data.publicUrl && mountedRef.current) {
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok && mountedRef.current) {
            const imageUrl = data.publicUrl + '?t=' + new Date().getTime();
            console.log("Image found, setting preview URL");
            setPreviewUrl(imageUrl);
          } else {
            console.log("No image found at path");
          }
        } catch (error) {
          console.log('Image does not exist yet', error);
        }
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      if (mountedRef.current) {
        setImageChecked(true);
      }
    }
  }, [bucketName, objectPath, imageChecked, setPreviewUrl, setImageChecked]);

  // Fetch image from Supabase storage if objectPath is provided
  useEffect(() => {
    if (!imageChecked && mountedRef.current) {
      if (bucketName && objectPath) {
        fetchImage();
      } else if (currentImage) {
        const cachedImage = currentImage.includes('?') ? currentImage : `${currentImage}?t=${new Date().getTime()}`;
        setPreviewUrl(cachedImage);
        setImageChecked(true);
      } else {
        setImageChecked(true);
      }
    }
  }, [bucketName, objectPath, currentImage, imageChecked, fetchImage, setPreviewUrl, setImageChecked]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !mountedRef.current) return;
    
    setIsLoading(true);

    try {
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      if (mountedRef.current) {
        setPreviewUrl(fileUrl);
      }
      
      // If we have a user and objectPath, upload the file
      if (user && objectPath && bucketName && mountedRef.current) {
        console.log("Uploading image to", bucketName, objectPath);
        
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(objectPath, file, {
            upsert: true,
            contentType: file.type
          });
          
        if (error) {
          throw error;
        }
        
        if (mountedRef.current) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(objectPath);
            
          if (publicUrlData && handleImageChange) {
            const cachedBustedUrl = publicUrlData.publicUrl + '?t=' + new Date().getTime();
            handleImageChange(file, cachedBustedUrl);
            toast.success("Imagem atualizada com sucesso!");
          } else if (handleImageChange) {
            handleImageChange(file);
          }
        }
      } else if (user && mountedRef.current) {
        // Generate a path based on the user ID if objectPath wasn't provided
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            upsert: true,
            contentType: file.type
          });
          
        if (error) {
          throw error;
        }
        
        if (mountedRef.current) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
            
          if (publicUrlData && handleImageChange) {
            const cachedBustedUrl = publicUrlData.publicUrl + '?t=' + new Date().getTime();
            handleImageChange(file, cachedBustedUrl);
            toast.success("Imagem atualizada com sucesso!");
          } else if (handleImageChange) {
            handleImageChange(file);
          }
        }
      } else if (handleImageChange && mountedRef.current) {
        // If no user, just pass the file
        handleImageChange(file);
      }
    } catch (error: any) {
      console.error("Error handling image:", error);
      if (mountedRef.current) {
        toast.error("Erro ao processar imagem: " + (error.message || "Tente novamente"));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user, objectPath, bucketName, handleImageChange, setIsLoading, setPreviewUrl]);

  const handleButtonClick = useCallback(() => {
    if (mountedRef.current) {
      fileInputRef.current?.click();
    }
  }, []);

  if (!mountedRef.current) {
    return null;
  }

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
            onError={() => {
              console.log("Image failed to load");
              if (mountedRef.current) {
                setPreviewUrl(undefined);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-toca-background">
            <User size={size === "sm" ? 32 : size === "md" ? 48 : 64} className="text-toca-text-secondary" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Camera size={24} className="text-white" />
          )}
        </div>
      </div>
      
      {children}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      {!children && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          className="text-toca-accent border-toca-accent hover:bg-toca-accent hover:text-white"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          <Camera size={16} className="mr-2" />
          {isLoading ? "Carregando..." : previewUrl ? "Alterar foto" : "Adicionar foto"}
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
