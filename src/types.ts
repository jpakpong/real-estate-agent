export type District =
  | 'Financial Core'
  | 'Arts & Culture Quarter'
  | 'Civic & Central Gardens'
  | 'Harbor Waterfront'
  | 'Historic Promenade';

export interface RoomDimension {
  room: string;
  size: string;
}

export interface FloorPlan {
  name: string;
  dimensions: string;
  rooms: RoomDimension[];
}

export interface NearbyHotspot {
  name: string;
  category: 'Transit' | 'Dining' | 'Park' | 'Culture';
  distance: string;
}

export interface PropertyAgent {
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
  languages: string[];
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  district: District;
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  floor: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'Available' | 'Reserved' | 'Move-In Ready';
  yearBuilt: number;
  hoaFee: number; // monthly
  propertyTaxEstimate: number; // annual
  heroImage: string;
  gallery: { url: string; title: string }[];
  description: string;
  architecturalNotes: string;
  highlights: string[];
  amenities: string[];
  walkScore: { walk: number; transit: number; bike: number };
  nearbyHotspots: NearbyHotspot[];
  floorPlan: FloorPlan;
  featured: boolean;
  agent: PropertyAgent;
}

export type TourType =
  | 'In-Person Private Walkthrough'
  | 'Sunset Champagne VIP Tour'
  | 'Virtual 4K Live Video Tour';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  tourType: TourType;
  date: string;
  timeSlot: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerType: 'Immediate Buyer' | 'Relocating to City' | 'Portfolio Investor' | 'Exploring Options';
  specialRequests?: string;
  createdAt: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled';
}

export interface FilterState {
  searchQuery: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'sqft-desc';
}
