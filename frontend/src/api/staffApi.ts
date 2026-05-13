import client, { setAuthToken } from './axiosClient';
import type { UserDTO } from '../types/user.type';
import type { MatchingStaff, Staff } from '../types';

const PATH = '/api/user/staffs';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function getStaffs(): Promise<Staff[]> {
  const res = await client.get<Staff[]>(PATH);
  const data = res.data;

  if (Array.isArray(data)) {
    return data.map((item: Staff) => ({
      id: item.id,
      fullName: item.fullName,
      userName: item.userName, 
      email: item.email,
      phone: item.phone,
      workingArea: item.workingArea,
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

export async function getMatchingStaffs(ward: string): Promise<MatchingStaff[]> {
  const res = await client.get<MatchingStaff[]>(`api/staff-customer-matching?ward=${ward}&limit=5`);
  return res.data;
}


export default { configureToken, getStaffs, getStaffById, getMatchingStaffs };