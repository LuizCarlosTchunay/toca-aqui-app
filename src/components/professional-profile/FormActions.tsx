
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
    console.log('[FormActions] Cancel button clicked');
    
    e.preventDefault();
    e.stopPropagation();
    
    // Use requestAnimationFrame for better Chrome compatibility
    requestAnimationFrame(() => {
      try {
        if (typeof onCancel === 'function') {
          console.log('[FormActions] Calling onCancel function');
          onCancel(e);
        }
      } catch (error) {
        console.error('[FormActions] Error in onCancel callback', error);
      }
    });
  }, [onCancel]);

  const handleSubmitClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('[FormActions] Submit button clicked', { isLoading, isSaving, isNavigating });
    
    // Only prevent if we're in a loading state
    if (isLoading || isSaving || isNavigating) {
      console.log('[FormActions] Preventing submit due to loading state');
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    console.log('[FormActions] Allowing form submission');
  }, [isLoading, isSaving, isNavigating]);

  const isDisabled = isLoading || isSaving || isNavigating;

  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancelClick}
        className="border-toca-border text-white hover:bg-toca-background/50"
        disabled={isDisabled}
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
        disabled={isDisabled}
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
