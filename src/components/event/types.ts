
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  services: string[];
  image?: string;
}

export interface EventCardProps {
  event: Event;
  className?: string;
  onClick?: () => void;
  onApply?: () => void;
}

export interface EventCardImageProps {
  name: string;
  date: string;
  imageUrl: string;
  onClick?: () => void;
}

export interface EventCardDetailsProps {
  date: string;
  time: string;
  location: string;
  city: string;
  state: string;
  description: string;
  services: string[];
  onApply?: () => void;
}
