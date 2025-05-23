
import React from "react";
import ImageUploader from "@/components/ImageUploader";

interface ImageUploadSectionProps {
  profileImageUrl: string | undefined;
  onImageChange: (imageFile: File, imageUrl?: string) => void;
  existingProfessionalId: string | null;
}

const ImageUploadSection = ({
  profileImageUrl,
  onImageChange,
  existingProfessionalId,
}: ImageUploadSectionProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <ImageUploader 
        currentImage={profileImageUrl}
        onImageChange={onImageChange}
        size="lg"
        bucketName="profile_images"
        objectPath={existingProfessionalId ? `professionals/${existingProfessionalId}` : undefined}
      />
    </div>
  );
};

export default ImageUploadSection;
