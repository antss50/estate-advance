import type { ResponseDTO } from './response.type';

export interface UserDTO {
  id: string ;
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
}

export interface UserDemandDTO {
  id: number;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  demand: DemandDTO;
  status?: 'NEW' | 'CONSULTING' | 'SIGNED' | 'PAID' | string;
}

export interface AssignStaffDTO {
  staffId: number;
  fullName: string;
  checked?: boolean;
}

export type UserListResponse = ResponseDTO<UserDTO[]>;

export default {};
