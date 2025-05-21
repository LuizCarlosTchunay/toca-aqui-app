
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  required_services: string[];
  image?: string;
}

export interface EventFilters {
  city: string;
  state: string;
  date: string;
  service: string;
}
