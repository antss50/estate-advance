import client, { setAuthToken } from './axiosClient';
import type { LoginResponse, MatchedStaffForBuildingRequestDTO, MatchedStaffForBuildingResponse, MatchedStaffForCustomerRequestDTO, MatchedStaffForCustomerRequestResponse, RegisterStaffPayload, RegisterUserResponse, UserDTO } from '../types/user.type';
import type { Staff } from '../types';
import type { BuildingSearchResponse } from '../types/building.type';

const PATH = '/api/user/staffs';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function getStaffs(): Promise<Staff[]> {
  const res = await client.get<Staff[] | { data?: Staff[] }>(PATH);
  const data = Array.isArray(res.data) ? res.data : res.data?.data;

  if (Array.isArray(data)) {
    return data.map((item: Staff) => ({
      id: item.id,
      fullName: item.fullName,
      userName: item.userName, 
      email: item.email,
      phone: item.phone,
      sex: item.sex,
      workingArea: item.workingArea,
      avatar: item.avatar,
      role: item.role || 'STAFF',
      revenue: item.revenue,
      performance: item.performance,
      totalDeals: item.totalDeals
    } as unknown as Staff));
  }
  
  return [];
}

export async function getStaffById(staffId: number): Promise<UserDTO> {
  const res = await client.get<UserDTO>(`${PATH}/${staffId}`);
  return res.data;
}

export async function getMatchingStaffsForBuilding(payload: MatchedStaffForBuildingRequestDTO): Promise<MatchedStaffForBuildingResponse[]> {
  const res = await client.post<MatchedStaffForBuildingResponse[]>(`/api/building-staff-matching/find-staff`, payload);
  return res.data;
}

export async function getMatchingStaffsForCustomerRequest(payload: MatchedStaffForCustomerRequestDTO): Promise<MatchedStaffForCustomerRequestResponse> {
  const res = await client.post<MatchedStaffForCustomerRequestResponse>(`/api/staff-customer-matching/find-staff`, payload);
  return res.data;
}

export async function registerStaff(payload: RegisterStaffPayload): Promise<RegisterUserResponse> {
  const res = await client.post<RegisterUserResponse>("/api/staff/auth/register", payload);
  return res.data ?? res;
}

export async function loginStaff(userName: string, password: string): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>(`/api/staff/auth/login`, { userName, password });
  return res.data;
}

export async function getBuildingByStaff(staffId: number): Promise<BuildingSearchResponse[]> {
  const res = await client.get(`/api/building/staff/${staffId}`);
  return res.data;
}

export default { configureToken, getStaffs, getStaffById, registerStaff, loginStaff, getBuildingByStaff, getMatchingStaffsForBuilding, getMatchingStaffsForCustomerRequest };
