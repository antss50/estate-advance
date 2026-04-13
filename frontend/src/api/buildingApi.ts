import client, { setAuthToken } from './axiosClient';
import type { BuildingDTO, BuildingSearchRequest, AssignmentBuildingDTO, BuildingSearchResponse } from '../types/building.type';
import type {  ResponseDTO } from '../types/response.type';
// staff list response shape for building/{id}/staffs
export type BuildingStaffEntry = { staffId: number; fullName: string; checked: boolean };
const PATH = '/api/building';

// Helper: include token when available
export function configureToken(token: string | null) {
  setAuthToken(token);
}

/**
 * Search buildings — backend expects GET /api/building with query params (ModelAttribute)
 */
export async function searchBuildings(request: BuildingSearchRequest): Promise<BuildingSearchResponse[]> {
  const params = { ...request };
  const res = await client.get<BuildingSearchResponse[]>(PATH, { params });
  return res.data;
}

export async function getBuilding(id: string): Promise<ResponseDTO<BuildingDTO>> {
  const res = await client.get<ResponseDTO<BuildingDTO>>(`${PATH}/${encodeURIComponent(id)}`);
  return res.data;
}

export async function createBuilding(payload: BuildingDTO): Promise<ResponseDTO<BuildingDTO>> {
  const res = await client.post<ResponseDTO<BuildingDTO>>(PATH, payload);
  return res.data;
}

/** Create building with multipart/form-data. Expect backend to accept 'data' (json) and files[] */
export async function createBuildingForm(formData: FormData): Promise<ResponseDTO<BuildingDTO>> {
  const res = await client.post<ResponseDTO<BuildingDTO>>(PATH, formData, {
  });
  return res.data;
}

export async function updateBuilding(id: string, payload: BuildingDTO): Promise<ResponseDTO<BuildingDTO>> {
  const res = await client.post<ResponseDTO<BuildingDTO>>(`${PATH}`, payload);
  return res.data;
}

/** Update building using multipart/form-data. */
export async function updateBuildingForm(id: string, formData: FormData): Promise<ResponseDTO<BuildingDTO>> {
  const res = await client.post<ResponseDTO<BuildingDTO>>(`${PATH}`, formData, {
  });
  return res.data;
}

// delete by array of ids — backend expects path variable with comma-separated ids: DELETE /api/building/{ids}
export async function deleteBuildings(ids: (string|number)[]): Promise<ResponseDTO<null>> {
  const joined = ids.map((i) => encodeURIComponent(String(i))).join(',');
  const res = await client.delete<ResponseDTO<null>>(`${PATH}/${joined}`);
  return res.data;
}

export async function getBuildingStaffs(buildingId: string | number): Promise<ResponseDTO<BuildingStaffEntry[]>> {
  const res = await client.get<ResponseDTO<BuildingStaffEntry[]>>(`${PATH}/${encodeURIComponent(String(buildingId))}/staffs`);
  return res.data;
}

export async function assignBuildingStaffs(payload: AssignmentBuildingDTO): Promise<ResponseDTO<null>> {
  // backend expects { buildingId: number, staffs: [2,3] }
  const res = await client.post<ResponseDTO<null>>(`${PATH}/assignment`, payload);
  return res.data;
}

export default {
  configureToken,
  searchBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuildings,
  getBuildingStaffs,
  assignBuildingStaffs,
  updateBuildingForm,
  createBuildingForm,
};
