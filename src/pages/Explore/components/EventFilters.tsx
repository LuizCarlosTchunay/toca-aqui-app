
import React from "react";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventFilters } from "@/types/events";

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const EventFiltersComponent: React.FC<EventFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  toggleFilters,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={18} />
          <Input
            placeholder="Buscar eventos..."
            className="bg-toca-card border-toca-border text-white pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
          onClick={toggleFilters}
        >
          <Filter size={18} className="mr-2" /> Filtros
        </Button>
      </div>

      {showFilters && (
        <div className="bg-toca-card border border-toca-border rounded-md p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Cidade</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                <Input
                  placeholder="Digite a cidade"
                  className="bg-toca-background border-toca-border text-white pl-10"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Estado</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                <Input
                  placeholder="Digite o estado"
                  className="bg-toca-background border-toca-border text-white pl-10"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Data</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-toca-text-secondary" size={16} />
                <Input
                  type="date"
                  className="bg-toca-background border-toca-border text-white pl-10"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Serviço</Label>
              <Select
                value={filters.service}
                onValueChange={(value) => setFilters({ ...filters, service: value })}
              >
                <SelectTrigger className="bg-toca-background border-toca-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="DJ">DJ</SelectItem>
                  <SelectItem value="Músico">Músico</SelectItem>
                  <SelectItem value="Fotógrafo">Fotógrafo</SelectItem>
                  <SelectItem value="Filmmaker">Filmmaker</SelectItem>
                  <SelectItem value="Técnico de Som">Técnico de Som</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              className="mr-2 bg-black text-white hover:bg-gray-800"
              onClick={() => setFilters({ city: "", state: "", date: "", service: "" })}
            >
              Limpar
            </Button>
            <Button 
              className="bg-toca-accent hover:bg-toca-accent-hover"
              onClick={toggleFilters}
            >
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFiltersComponent;
