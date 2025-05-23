
import React from "react";
import { Clock, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RatesDisplayProps {
  hourlyRate: number | null | undefined;
  eventRate: number | null | undefined;
}

const RatesDisplay = ({ hourlyRate, eventRate }: RatesDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full mb-6">
      <div className="text-center p-3 bg-toca-background rounded-md">
        <div className="text-xs text-toca-text-secondary mb-1">
          <Clock size={14} className="inline mr-1" /> Por hora
        </div>
        <div className="font-semibold text-toca-accent">
          {formatCurrency(hourlyRate || 0)}
        </div>
      </div>
      <div className="text-center p-3 bg-toca-background rounded-md">
        <div className="text-xs text-toca-text-secondary mb-1">
          <Calendar size={14} className="inline mr-1" /> Por evento
        </div>
        <div className="font-semibold text-toca-accent">
          {formatCurrency(eventRate || 0)}
        </div>
      </div>
    </div>
  );
};

export default RatesDisplay;
