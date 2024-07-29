import { NewPropertyData } from "./property";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ViewportCorners {
  northEast: Coordinates;
  southWest: Coordinates;
}

// map component props interface
export interface MapComponentProps {
  setViewportCorners: (corners: ViewportCorners) => void;
  hotelData: NewPropertyData[];
}

//property card
export interface HotelData {
  imageUrl: string;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  price: number | string;
  currency?: string;
  dates?: string;
  capacity?:string;
  amenities?:string[];
  lat?: number | undefined;
  lng?: number | undefined;
}
