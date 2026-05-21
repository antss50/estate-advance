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
  email?: string | null;
  demand: DemandDTO;
  status?: 'NEW' | 'CONSULTING' | 'ASSIGNED' | 'SIGNED' | 'PAID' | string;
}

export interface AssignStaffDTO {
  staffId: number;
  fullName: string;
  checked?: string ; // "checked" or true/false
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
  desiredWard: string | undefined;
  desiredProvince: string | undefined;
  buildingType: string;
  priorityType: string;
  priceTolerance: number;
  areaTolerance: number;
  limit: number;
}

export type UserListResponse = ResponseDTO<UserDTO[]>;
export type CustomerRequestListResponse = ResponseDTO<UserDemandDTO[]>;

export default {};
