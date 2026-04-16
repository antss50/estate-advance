// Shared types for the frontend app
export interface Slide {
  id: string;
  imageUrl: string;
  slogan: string;
  description: string;
}

export interface Staff {
  id: string;
  fullName: string;
  userName: string;
  role: string;
  phone: string;
  email: string;
  working_area: string;
  avatarUrl?: string;
  performance?: number; // Thêm trường hiệu suất nếu có
  status?: string;
  revenue?: number; // Doanh thu nếu có
  total_deals?: number; // Tổng số giao dịch nếu có
}

export interface DemandFormValues {
  propertyType: string;
  province: string;
  district: string;
  area: number;
  priceRange: number[];
}

export default {};
