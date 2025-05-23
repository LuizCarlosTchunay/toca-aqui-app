
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileData {
  artisticName: string;
  profileType: string;
  bio: string;
  city: string;
  state: string;
  hourlyRate: string;
  eventRate: string;
}

interface BasicProfileFieldsProps {
  profileData: ProfileData;
  otherType: string;
  setOtherType: (value: string) => void;
  handleChange: (field: string, value: string) => void;
}

const BasicProfileFields = ({ 
  profileData, 
  otherType, 
  setOtherType, 
  handleChange 
}: BasicProfileFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="artisticName" className="text-white">Nome Artístico</Label>
        <Input 
          id="artisticName" 
          value={profileData.artisticName}
          onChange={(e) => handleChange('artisticName', e.target.value)}
          className="bg-toca-background border-toca-border text-white"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profileType" className="text-white">Tipo de Profissional</Label>
        <Select 
          value={profileData.profileType}
          onValueChange={(value) => handleChange('profileType', value)}
        >
          <SelectTrigger className="bg-toca-background border-toca-border text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-toca-background border-toca-border text-white z-50">
            <SelectItem value="musico">Músico</SelectItem>
            <SelectItem value="dj">DJ</SelectItem>
            <SelectItem value="duo">Duo</SelectItem>
            <SelectItem value="trio">Trio</SelectItem>
            <SelectItem value="banda">Banda</SelectItem>
            <SelectItem value="fotografo">Fotógrafo</SelectItem>
            <SelectItem value="filmmaker">Filmmaker</SelectItem>
            <SelectItem value="tecnico_som">Técnico de Som</SelectItem>
            <SelectItem value="tecnico_luz">Técnico de Luz</SelectItem>
            <SelectItem value="outro">Outro (especifique)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {profileData.profileType === "outro" && (
        <div className="space-y-2">
          <Label htmlFor="otherType" className="text-white">Especifique o tipo</Label>
          <Input 
            id="otherType" 
            value={otherType}
            onChange={(e) => setOtherType(e.target.value)}
            className="bg-toca-background border-toca-border text-white"
            placeholder="Insira seu tipo de profissão"
            required={profileData.profileType === "outro"}
          />
        </div>
      )}
    </>
  );
};

export default BasicProfileFields;
