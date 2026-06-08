// Shared types for the frontend app
export interface Slide {
  id: string;
  imageUrl: string;
  slogan: string;
  description: string;
}

export interface Staff {
  id: number;
  fullName: string;
  userName: string;
  role: string;
  phone: string;
  email: string;
  sex?: string;
  workingArea?: string;
  avatar?: string;
  performance?: number;
  status?: string;
  revenue?: number;
  totalDeals?: number;
  checked?: boolean;
}

export interface TopStaff {
  staffId: number;
  staffName: string;
  email: string;
  phone: string;
  rank: number;
  revenue: number;
  revenueSale: number;
  revenueRent: number;
  totalDeals: number;
  totalSaleDeals: number;
  totalRentDeals: number;
  performance: number;
}

export interface MatchedStaff {
  staffId: number;
  staffName: string;
  email: string;
  phone: string;
  workingArea?: string;
  scoreBuilding: number;
  scoreBuildingPrice: number;
  scoreBuildingLegal: number;
  scoreBuildingLiquidity: number;
  scoreArea: number;
  scorePerformance: number;
  scoreWorkload: number;
  newbieBonus: number;
  totalScoreBS: number;
  currentLoad: number;
  daysWorked: number;
  newbie: boolean;
}

export interface DemandFormValues {
  customerId: number;
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  priorityType: string;
  transactionType: string;
  area: number;
  priceRange: [number, number];
  ward: string;
  province: string;
  numberOfBasement?: number;
  direction?: string;
  legalStatus?: string;
  brokerageFee?: number;
}

export interface DashboardResponse {
  totalRevenue: number;
  totalStaffRevenue: number;
  totalSystemRevenue: number;
  totalDeals: number;
  totalSaleDeals: number;
  totalRentDeals: number;
  totalCustomers: number;
  totalActiveCustomers: number;
  totalNewCustomers: number;
  totalPaidCustomers: number;
  topStaffs: TopStaff[];
}

export interface StaffStatisticsResponse {
  staffId: number;
  staffName: string;
  email: string;
  phone: string;
  totalRevenue: number;
  revenueSale: number;
  revenueRent: number;
  totalDeals: number;
  totalSaleDeals: number;
  totalRentDeals: number;
  performance: number;
}

export default {};
