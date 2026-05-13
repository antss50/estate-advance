import type { ResponseDTO } from './response.type';

export interface UserDTO {
  id: number | string;
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
  area?: number;
  price?: number;
  location?: string;
  propertyType?: string;
  transactionType?: string; // "SALE" hoặc "RENT"
  priorityType?: string;
}

export interface UserDemandDTO {
  id: number;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  demand: DemandDTO;
  status?: 'NEW' | 'CONSULTING' | 'ASSIGNED' | 'SIGNED' | 'PAID' | string;
}

export interface AssignStaffDTO {
  staffId: number;
  fullName: string;
  checked?: boolean;
}

export interface MatchedStaffDTO {
  staffId: number;
  staffName: string;
  phone?: string | null;
  workingArea?: string;
  areaScore?: number;
  performanceScore?: number;
  workloadScore?: number;
  newbieBonus?: number;
  totalScore?: number;
  currentWorkload?: number;
  totalDeals?: number;
  revenue?: number;
  daysWorked?: number;
  avgRevenuePerDeal?: number;
}

export interface MatchingPayload {
  customerId: number;
  transactionType: string;
  desiredPriceSale: number;
  desiredArea: number;
  desiredWard: string;
  desiredProvince: string;
  buildingType: string;
  priorityType: string;
  priceTolerance: number;
  areaTolerance: number;
  limit: number;
}

export type UserListResponse = ResponseDTO<UserDTO[]>;
export type CustomerRequestListResponse = ResponseDTO<UserDemandDTO[]>;

export default {};
