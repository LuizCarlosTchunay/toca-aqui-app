
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useChromeCompatibleNavigation } from "@/hooks/useChromeCompatibleNavigation";

interface FormActionsProps {
  isLoading: boolean;
  isSaving: boolean;
  isNavigating: boolean;
  onCancel: (e?: React.MouseEvent) => void;
}

const FormActions = ({ isLoading, isSaving, isNavigating, onCancel }: FormActionsProps) => {
  const { debugLog } = useChromeCompatibleNavigation();

  const handleCancelClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    debugLog('Cancel button clicked');
    
    try {
      e.preventDefault();
      e.stopPropagation();
      
      // Add a small delay for Chrome compatibility
      setTimeout(() => {
        try {
          if (typeof onCancel === 'function') {
            debugLog('Calling onCancel function');
            onCancel(e);
          } else {
            debugLog('onCancel is not a function');
          }
        } catch (error) {
          debugLog('Error in onCancel callback', error);
        }
      }, 10);
      
    } catch (error) {
      debugLog('Error in handleCancelClick', error);
    }
  }, [onCancel, debugLog]);

  const handleSubmitClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    debugLog('Submit button clicked', { isLoading, isSaving, isNavigating });
    
    try {
      // Only prevent if we're in a loading state
      if (isLoading || isSaving || isNavigating) {
        debugLog('Preventing submit due to loading state');
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      debugLog('Allowing form submission');
    } catch (error) {
      debugLog('Error in handleSubmitClick', error);
      e.preventDefault();
    }
  }, [isLoading, isSaving, isNavigating, debugLog]);

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
