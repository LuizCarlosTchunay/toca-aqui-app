
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EventFiltersComponent from "./components/EventFilters";
import EventsList from "./components/EventsList";
import { useEvents } from "@/hooks/useEvents";

const ExploreEvents = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    events,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters
  } = useEvents();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ city: "", state: "", date: "", service: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          className="bg-black text-toca-accent hover:bg-gray-800"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Explorar Eventos</h1>
        <div className="w-[80px]"></div> {/* Spacer for alignment */}
      </div>

      <EventFiltersComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
      />

      <EventsList 
        events={events}
        isLoading={isLoading}
        isError={isError}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default ExploreEvents;
