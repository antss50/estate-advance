import client, { setAuthToken } from './axiosClient';
import type { UserDTO } from '../types/user.type';
import type { Staff } from '../types';

const PATH = '/api/user/staffs';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function getStaffs(): Promise<UserDTO[]> {
  const res = await client.get<Record<string, string>>(PATH);

  const data = res.data;

  if (data) {
    return Object.entries(data).map(([id, name]) => ({
      id: Number(id),
      fullName: name,
      username: `staff_${id}`,
      role: 'STAFF',
    } as unknown as UserDTO)); 
  }
  
  return [];
}

export async function getStaffById(id: string): Promise<Staff> {
  try {
    const res = await client.get<Staff>(`/api/staff/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching staff details:", error);
    throw error;
  }
}

export default { configureToken, getStaffs, getStaffById };
