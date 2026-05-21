import client, { setAuthToken } from './axiosClient';
import type { UserDTO, PasswordDTO, CreateUserPayload, UpdateUserPayload, UserDemandDTO, MatchingPayload, RegisterUserPayload, RegisterUserResponse, LoginResponse } from '../types/user.type';
import type { ResponseDTO, PaginatedResult } from '../types/response.type';
import type { Staff } from '../types';
import type { MatchingResponseDTO } from '../types/building.type';

const PATH = '/api/user';

export function configureToken(token: string | null) {
  setAuthToken(token);
}

export async function listUsers(params?: { page?: number; size?: number; role?: string; keyword?: string; }): Promise<ResponseDTO<PaginatedResult<UserDTO>>> {
  const res = await client.get<ResponseDTO<PaginatedResult<UserDTO>>>(`${PATH}`, { params });
  return res.data;
}

export async function getAllUsers(): Promise<ResponseDTO<UserDTO>> {
  const res = await client.get<ResponseDTO<UserDTO>>(`/api/customer`);
  return res.data;
}

export async function getCustomerRequests(): Promise<UserDemandDTO[]> {
  const res = await client.get<UserDemandDTO[]>('/api/customer-request');
  return res.data;
}

export async function getCustomerAssignment(customerId: number | string): Promise<ResponseDTO<Staff[]>> {
  const res = await client.get<ResponseDTO<Staff[]>>(`/api/customer/${encodeURIComponent(String(customerId))}/assignment`);
  return res.data;
}

export async function createUser(payload: CreateUserPayload): Promise<ResponseDTO<UserDTO>> {
  const res = await client.post<ResponseDTO<UserDTO>>(PATH, payload);
  return res.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<ResponseDTO<UserDTO>> {
  const res = await client.put<ResponseDTO<UserDTO>>(`${PATH}/${encodeURIComponent(id)}`, payload);
  return res.data;
}

export async function deleteUser(ids: (string | number)[]): Promise<ResponseDTO<null>> {
  const res = await client.delete<ResponseDTO<null>>(PATH, { data: ids });
  return res.data;
}

export async function changePassword(payload: PasswordDTO): Promise<ResponseDTO<null>> {
  const res = await client.post<ResponseDTO<null>>(`${PATH}/password`, payload);
  return res.data;
}

export async function registerUser(payload: RegisterUserPayload): Promise<ResponseDTO<RegisterUserResponse>> {
  const res = await client.post<ResponseDTO<RegisterUserResponse>>(`api/customer/auth/register`, payload);
  return res.data;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>(`api/customer/auth/login`, { username, password });
  return res.data;
}

export async function matchCustomerRequest(payload: MatchingPayload): Promise<ResponseDTO<MatchingResponseDTO>> {
  const res = await client.post<ResponseDTO<MatchingResponseDTO>>(`/api/customer-matching/find-buildings`, payload);
  return res.data;
}
export default {
  configureToken,
  listUsers,
  getAllUsers,
  getCustomerRequests,
  getCustomerAssignment,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  registerUser,
  loginUser,
  matchCustomerRequest
};
