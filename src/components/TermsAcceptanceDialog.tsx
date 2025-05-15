
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsAcceptanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

const TermsAcceptanceDialog: React.FC<TermsAcceptanceDialogProps> = ({
  open,
  onOpenChange,
  onAccept,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-toca-card border-toca-border text-white w-[95%] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Termos de Serviço</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-toca-text-secondary">
          Ao utilizar o serviço Toca Aqui, você concorda com os seguintes termos:
        </DialogDescription>
        
        <div className="space-y-4 my-4 text-toca-text-secondary overflow-y-auto">
          <p>
            <span className="font-semibold text-white">Taxa de Serviço:</span> O Toca Aqui cobra uma taxa fixa de 9,98% por profissional 
            contratado. Esta taxa cobre o serviço de intermediação entre você e o profissional.
          </p>
          <p>
            <span className="font-semibold text-white">Garantias:</span> Através desta taxa, garantimos:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Intermediação segura entre contratante e profissional</li>
            <li>Garantia de recebimento ao profissional</li>
            <li>Garantia de reserva ao contratante</li>
            <li>Suporte durante todo o processo de contratação</li>
          </ul>
          <p>
            <span className="font-semibold text-white">Pagamentos:</span> Todos os pagamentos são processados de forma segura 
            através da nossa plataforma. O valor será reservado até a confirmação do serviço.
          </p>
          <p>
            <span className="font-semibold text-white">Cancelamento:</span> Em caso de cancelamento, consulte nossa política 
            de cancelamento para informações sobre reembolsos e taxas aplicáveis.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-toca-border text-toca-text-secondary w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onAccept();
              onOpenChange(false);
            }}
            className="bg-toca-accent hover:bg-toca-accent-hover w-full sm:w-auto"
          >
            Aceitar Termos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAcceptanceDialog;
