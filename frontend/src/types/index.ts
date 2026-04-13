// Shared types for the frontend app
export interface Slide {
  id: string;
  imageUrl: string;
  slogan: string;
  description: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
  avatarUrl?: string;
}

export interface DemandFormValues {
  propertyType: string;
  province: string;
  district: string;
  area: number;
  priceRange: number[];
}

export default {};
