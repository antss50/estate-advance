import type { ResponseDTO } from './response.type';

export interface UserDTO {
  id: number ;
  userName: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role?: 'ADMIN' | 'STAFF' | 'CUSTOMER' | string;
  avatar?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  demand?: DemandDTO;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleDTOs {
  [key: string]: string;
}

export interface CreateUserPayload {
  userName: string; // note capital N per backend
  password: string;
  fullName: string;
  status?: number; // 1 active, 0 inactive
  roleCode: string;
  email?: string | null;
  phone?: string | null;
}

export interface RegisterUserPayload {
  username: string; 
  password: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

export interface RegisterUserResponse {
  id: number;
  username: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  success: boolean;
}

export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  email?: string | null;
  workingArea?: string;
  phone?: string | null;
  token: string;
  success: boolean;
  message?: string;
}

export interface RegisterStaffPayload {
  userName?: string;
  password?: string;
  fullName: string;
  email?: string;
  phone?: string;
  workingArea?: string;
}

export interface UpdateStaffPayload {
  fullName: string;
  userName: string;
  phone: string;
  email: string;
  workingArea: string;
  role: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  status?: number;
  roleDTOs?: RoleDTOs;
}

export interface PasswordDTO {
  userId: string;
  oldPassword?: string;
  newPassword: string;
  reset?: boolean; // indicate admin reset
}

export interface DemandDTO {
  id: number;
  area?: number;
  price?: number;
  ward?: string;
  province?: string;
  propertyType?: string;
  transactionType?: string; // "SALE" hoặc "RENT"
  priorityType?: string;
}

export interface UserDemandDTO {
  id: number;
  customerId: number;
  fullName: string;
  userName: string;
  phone?: string | null;
  customerPhone?: string | null;
  email?: string | null;
  demand: DemandDTO;
  status?: 'NEW' | 'CONSULTING' | 'ASSIGNED' | 'SIGNED' | 'PAID' | string;
}

export interface AssignStaffDTO {
  staffId: number;
  fullName: string;
  checked?: boolean ; // "checked" or true/false
}

// export interface MatchedStaffDTO {
//   staffId: number;
//   staffName: string;
//   phone?: string | null;
//   workingArea?: string;
//   areaScore?: number;
//   performanceScore?: number;
//   workloadScore?: number;
//   newbieBonus?: number;
//   totalScoreCS: number;
//   totalScoreBS: number;
//   currentWorkload?: number;
//   totalDeals?: number;
//   revenue?: number;
//   daysWorked?: number;
//   avgRevenuePerDeal?: number;
//   checked?: boolean;
// } 

export interface MatchedStaffForCustomerDTO {
  staffId: number;
  staffName: string;
  email: string;
  phone?: string;
  workingArea: string;
  scoreArea: number;
  scorePerformance: number;
  scoreWorkload: number;
  newbieBonus: number;
  totalScoreCS: number;
  currentLoad: number;
  daysWorked: number;
  newbie: boolean;
}

export interface MatchedStaffForBuildingDTO {
  staffId: number;
  staffName: string;
  email: string;
  phone?: string;
  workingArea: string;
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
  totalDeals?: number;
  currentWorkload?: number;
}

export interface MatchingPayload {
  customerId: number;
  staffId?: number;
  // transactionType: string;
  demandPrice: number;
  demandArea: number;
  demandWard: string | undefined;
  demandProvince: string | undefined;
  demandPropertyType: string;
  demandPriorityType: string;
  // priceTolerance: number;
  // areaTolerance: number;
  // limit: number;
}

export interface UpdateCustomerStatusPayload {
  customerRequestId?: number;
  customerId?: number;
  demandId?: number;
  newStatus: string; // "NEW", "CONSULTING", "ASSIGNED", "SIGNED", "PAID"
  staffId?: number; // Optional, only needed when newStatus is "ASSIGNED"
  transactionType?: string; // Optional, "SALE" or "RENT", needed for "ASSIGNED" status to determine matching staff
  buildingId?: number;
  contractValue?: number; // Optional, needed for "SIGNED" status to calculate staff performance
  monthlyRent?: number;
  contractMonths?: number;
}

export interface UpdateCustomerStatusResponse {
  customerId: number;
  demandId?: number;
  oldStatus: string;
  newStatus: string;
  success: boolean;
  totalCommissions?: number; // Total commissions earned by the assigned staff after status update, if applicable
  staffCommissions?: number;// Commission details for the assigned staff, if applicable
  systemCommissions?: number;// Commission details for the system/platform, if applicable
  commissionDescription?: string;// Description of how the commissions were calculated, if applicable
  buildingId?: number; // ID of the building that was matched/assigned, if applicable
  buildingStatus?: string; // Status of the building (e.g., "AVAILABLE", "UNDER_CONTRACT", "SOLD"), if applicable
}

export interface MatchedStaffForCustomerRequestDTO {
  customerId: number;
  demandWard: string;
}

export interface MatchedStaffForBuildingRequestDTO {
  buildingId: number;
  topN: number;
}

export interface MatchedStaffForCustomerRequestResponse {
  customerId: number;
  totalFound: number;
  results: MatchedStaffForCustomerDTO[];
}

export interface MatchedStaffForBuildingResponse {
  buildingId: number;
  buildingName: string;
  buildingAddress: string;
  scoreBuilding: number;
  totalFound: number;
  results: MatchedStaffForBuildingDTO[];
}

export type UserListResponse = ResponseDTO<UserDTO[]>;
export type CustomerRequestListResponse = ResponseDTO<UserDemandDTO[]>;

export default {};
