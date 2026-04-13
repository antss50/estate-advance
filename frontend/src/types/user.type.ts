import type { ResponseDTO } from './response.type';

export interface UserDTO {
  id: string ;
  userName: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role?: 'ADMIN' | 'STAFF' | 'CUSTOMER' | string;
  avatarUrl?: string | null;
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

export interface AssignStaffDTO {
  staffId: number;
  fullName: string;
  checked?: boolean;
}

export type UserListResponse = ResponseDTO<UserDTO[]>;

export default {};
