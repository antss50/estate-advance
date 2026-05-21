import type { AssignStaffDTO } from '../types/user.type';
import client, { setAuthToken } from './axiosClient';
import type { ResponseDTO } from '../types/response.type';

const CUSTOMER_PATH = '/api/customer/{customerId}/assignment';
const BUILDING_PATH = '/api/building/assignment';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function getCustomerAssignments(customerId: number): Promise<AssignStaffDTO[]> {
  const res = await client.get(`${CUSTOMER_PATH.replace('{customerId}', encodeURIComponent(customerId.toString()))}`);
  return res.data;
}

export interface AssignmentRequest {
  staffIds: number[];
}

export interface AssignmentResponse {
  id?: number;
  customerId?: number;
  buildingId?: number;
  staffIds: number[];
  assignedDate?: string;
  assignedBy?: string;
}

/**
 * Assign staff to customer
 */
export async function assignStaffToCustomer(
  customerId: number,
  staffIds: number[]
): Promise<ResponseDTO<AssignmentResponse>> {
  const res = await client.post<ResponseDTO<AssignmentResponse>>(
    CUSTOMER_PATH.replace('{customerId}', encodeURIComponent(customerId.toString())),
    { staffIds }
  );
  return res.data;
}

/**
 * Assign staff to building (using existing endpoint)
 */
export async function assignStaffToBuilding(
  buildingId: number,
  staffIds: number[]
): Promise<ResponseDTO<AssignmentResponse>> {
  const res = await client.post<ResponseDTO<AssignmentResponse>>(
    BUILDING_PATH,
    { buildingId, staffIds }
  );
  return res.data;
}

export default {
    configureToken,
    getCustomerAssignments,
    assignStaffToCustomer,
    assignStaffToBuilding,
}