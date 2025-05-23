
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  isSaving: boolean;
  isNavigating: boolean;
  onCancel: () => void;
}

const FormActions = ({ isLoading, isSaving, isNavigating, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="border-toca-border text-white"
        disabled={isLoading || isSaving || isNavigating}
      >
        {isNavigating ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aguarde...
          </span>
        ) : "Cancelar"}
      </Button>
      <Button 
        type="submit"
        className="bg-toca-accent hover:bg-toca-accent-hover"
        disabled={isLoading || isSaving || isNavigating}
      >
        {(isLoading || isSaving) ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </span>
        ) : "Salvar Alterações"}
      </Button>
    </div>
  );
};

export default FormActions;
