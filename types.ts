// Fix: Define the necessary TypeScript types for the application.
export type View = 'home' | 'photographers' | 'photographer-detail' | 'booking' | 'chat' | 'my-page';

export interface PortfolioItem {
  id: number;
  imageUrl: string;
  description: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Photographer {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  bio: string;
  price: number;
  profileImage: string;
  gender: '남성' | '여성';
  portfolio: PortfolioItem[];
  reviews: Review[];
}

export interface FilterOptions {
  location: string;
  gender: 'all' | 'male' | 'female';
  priceRange: [number, number];
}

export interface Booking {
  id: string;
  photographerId: number;
  photographerName: string;
  photographerImage: string;
  date: string;
  time: string;
  price: number;
}

export type ChatMessageContent =
  | { type: 'text'; text: string }
  | { type: 'calendar' }
  | { type: 'options'; text: string; options: string[] };

export interface ChatMessage {
  id: number;
  sender: 'user' | 'photographer';
  content: ChatMessageContent;
}


export interface AppContextType {
  view: View;
  setView: (view: View) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  photographers: Photographer[];
  selectedPhotographer: Photographer | null;
  setSelectedPhotographerId: (id: number | null) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}