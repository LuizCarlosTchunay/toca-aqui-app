
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  isSaving: boolean;
  isNavigating: boolean;
  onCancel: (e?: React.MouseEvent) => void;
}

const FormActions = ({ isLoading, isSaving, isNavigating, onCancel }: FormActionsProps) => {
  const handleCancelClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Chrome-specific handling
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onCancel]);

  const handleSubmitClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Let the form handle submission naturally
    if (isLoading || isSaving || isNavigating) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [isLoading, isSaving, isNavigating]);

  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancelClick}
        className="border-toca-border text-white hover:bg-toca-background/50"
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
        onClick={handleSubmitClick}
        className="bg-toca-accent hover:bg-toca-accent-hover text-white"
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
