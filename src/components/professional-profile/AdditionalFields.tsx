
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  artisticName: string;
  profileType: string;
  bio: string;
  city: string;
  state: string;
  hourlyRate: string;
  eventRate: string;
}

interface AdditionalFieldsProps {
  profileData: ProfileData;
  handleChange: (field: string, value: string) => void;
}

const AdditionalFields = ({ profileData, handleChange }: AdditionalFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">Biografia</Label>
        <Textarea 
          id="bio" 
          value={profileData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="bg-toca-background border-toca-border text-white min-h-[120px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-white">Cidade</Label>
          <Input 
            id="city" 
            value={profileData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="bg-toca-background border-toca-border text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-white">Estado</Label>
          <Input 
            id="state" 
            value={profileData.state}
            onChange={(e) => handleChange('state', e.target.value)}
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
            value={profileData.hourlyRate}
            onChange={(e) => handleChange('hourlyRate', e.target.value)}
            className="bg-toca-background border-toca-border text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventRate" className="text-white">Cachê por Evento (R$)</Label>
          <Input 
            id="eventRate" 
            type="number" 
            value={profileData.eventRate}
            onChange={(e) => handleChange('eventRate', e.target.value)}
            className="bg-toca-background border-toca-border text-white"
          />
        </div>
      </div>
    </>
  );
};

export default AdditionalFields;
