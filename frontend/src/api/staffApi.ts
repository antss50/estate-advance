import client, { setAuthToken } from './axiosClient';
import type { UserDTO } from '../types/user.type';
import type { Staff } from '../types';

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
      working_area: item.workingArea,
      role: item.role || 'STAFF',
      revenue: item.revenue,
      performance: item.performance,
      total_deals: item.totalDeals
    } as unknown as Staff));
  }
  
  return [];
}

export async function getStaffById(staffId: string): Promise<UserDTO> {
  const res = await client.get<UserDTO>(`${PATH}/${staffId}`);
  return res.data;
}

export default { configureToken, getStaffs, getStaffById };