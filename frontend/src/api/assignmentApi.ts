import type { AssignStaffDTO } from '../types/user.type';
import client, { setAuthToken } from './axiosClient';

const PATH = '/api/customer/{customerId}/assignment';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function getCustomerAssignments(customerId: number): Promise<AssignStaffDTO[]> {
  const res = await client.get(`${PATH.replace('{customerId}', encodeURIComponent(customerId.toString()))}`);
  return res.data;
}

export default {
    configureToken,
    getCustomerAssignments,
}