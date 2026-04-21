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
  workingArea: string;
  avatar?: string;
  performance?: number; // Thêm trường hiệu suất nếu có
  status?: string;
  revenue?: number; // Doanh thu nếu có
  totalDeals?: number; // Tổng số giao dịch nếu có
}

export interface DemandFormValues {
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  area: number;
  priceRange: [number, number];
  ward: string;
  province: string;
}

export default {};
