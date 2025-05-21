
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange?: (imageFile: File, imageUrl?: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  bucketName?: string;
  objectPath?: string;
  children?: React.ReactNode;
  // Add onImageUpload as an alias for onImageChange for backward compatibility
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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the onImageUpload prop as a fallback if onImageChange is not provided
  const handleImageChange = onImageChange || onImageUpload;

  // Fetch image from Supabase storage if objectPath is provided
  useEffect(() => {
    const fetchImage = async () => {
      if (!objectPath || !bucketName) return;
      
      try {
        // Ensure the bucket exists first
        try {
          await supabase.storage.createBucket(bucketName, {
            public: true
          });
        } catch (e) {
          // Bucket likely already exists
          console.log("Bucket may already exist");
        }

        // Try to get public URL
        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(objectPath);
        
        if (data && data.publicUrl) {
          // Add cache-busting parameter
          const imageUrl = data.publicUrl + '?t=' + new Date().getTime();
          
          // Check if the image exists by making a HEAD request
          try {
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setPreviewUrl(imageUrl);
            }
          } catch (error) {
            console.log('Image may not exist yet', error);
          }
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    
    if (bucketName && objectPath) {
      fetchImage();
    } else if (currentImage) {
      // Add cache busting to prevent stale images
      setPreviewUrl(currentImage.includes('?') ? currentImage : `${currentImage}?t=${new Date().getTime()}`);
    }
  }, [bucketName, objectPath, currentImage]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);

    try {
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // If we have a user and objectPath, try to upload the file immediately
      if (user && objectPath && bucketName) {
        console.log("Uploading image to", bucketName, objectPath);
        
        // Create storage bucket if it doesn't exist (this will fail silently if it exists)
        try {
          await supabase.storage.createBucket(bucketName, {
            public: true
          });
        } catch (e) {
          console.log("Bucket already exists or could not be created");
        }
        
        // Upload to the specified path directly
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(objectPath, file, {
            upsert: true,
            contentType: file.type
          });
          
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log("Bucket does not exist, attempting to create it...");
            try {
              // Try creating the bucket again with a different approach
              await supabase.storage.createBucket(bucketName, {
                public: true
              });
              
              // Try uploading again
              const { error: retryError } = await supabase.storage
                .from(bucketName)
                .upload(objectPath, file, {
                  upsert: true,
                  contentType: file.type
                });
                
              if (retryError) throw retryError;
            } catch (bucketError) {
              throw error; // If still failing, throw the original error
            }
          } else {
            throw error;
          }
        }
        
        // Get the public URL of the uploaded file with cache busting
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(objectPath);
          
        if (publicUrlData && handleImageChange) {
          // Pass both the file and the public URL to the parent component
          const cachedBustedUrl = publicUrlData.publicUrl + '?t=' + new Date().getTime();
          handleImageChange(file, cachedBustedUrl);
          toast.success("Imagem atualizada com sucesso!");
        } else if (handleImageChange) {
          handleImageChange(file);
        }
      } else if (user) {
        // Generate a path based on the user ID if objectPath wasn't provided
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        // Create storage bucket if it doesn't exist
        try {
          await supabase.storage.createBucket(bucketName, {
            public: true
          });
        } catch (e) {
          console.log("Bucket already exists or could not be created");
        }
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            upsert: true,
            contentType: file.type
          });
          
        if (error) {
          throw error;
        }
        
        // Get the public URL of the uploaded file with cache busting
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
          
        if (publicUrlData && handleImageChange) {
          // Pass both the file and the public URL to the parent component
          const cachedBustedUrl = publicUrlData.publicUrl + '?t=' + new Date().getTime();
          handleImageChange(file, cachedBustedUrl);
          toast.success("Imagem atualizada com sucesso!");
        } else if (handleImageChange) {
          handleImageChange(file);
        }
      } else if (handleImageChange) {
        // If no user, just pass the file
        handleImageChange(file);
      }
    } catch (error: any) {
      console.error("Error handling image:", error);
      toast.error("Erro ao processar imagem: " + (error.message || "Tente novamente"));
    } finally {
      setIsLoading(false);
    }
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
