import type { BuildingDTO, BuildingSearchRequest } from "../types/building.type";
import type { PaginatedResult } from "../types/response.type";
import type { UserDTO } from "../types/user.type";

const MOCK_BUILDINGS: BuildingDTO[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `b${i + 1}`,
  name: `Tòa nhà ${i + 1}`,
  address: `${100 + i} Đường A, Quận X`,
  managerName: i % 3 === 0 ? `Quản lý ${i + 1}` : null,
  floorArea: 100 + i * 10,
  rentPrice: 5000000 + i * 100000,
  createdAt: new Date().toISOString(),
}));

const MOCK_USERS: UserDTO[] = [
  { id: "s1", username: "tranvan", fullName: "Trần Văn A" },
  { id: "s2", username: "nguyenth", fullName: "Nguyễn Thị B" },
  { id: "s3", username: "phamk", fullName: "Phạm K" },
  { id: "s4", username: "lehoang", fullName: "Lê Hoàng" },
  { id: "s5", username: "phamtu", fullName: "Phạm Tú" },
  { id: "s6", username: "dangn", fullName: "Đặng N" },
];

function delay<T>(v: T, ms = 250) {
  return new Promise<T>((res) => setTimeout(() => res(v), ms));
}

export async function searchBuildings(
  params: BuildingSearchRequest
): Promise<{ data: PaginatedResult<BuildingDTO> } | null> {
  const page = params.page || 1;
  const size = params.size || 12;
  const kw = (params.name || "").toLowerCase();
  const filtered = MOCK_BUILDINGS.filter((b) => b.name.toLowerCase().includes(kw));
  const start = (page - 1) * size;
  const items = filtered.slice(start, start + size);
  return delay({ data: { items, total: filtered.length, page, size } });
}

export async function listUsers(
  params: { page?: number; size?: number; role?: string }
): Promise<{ data: PaginatedResult<UserDTO> } | null> {
  const page = params.page || 1;
  const size = params.size || 200;
  const start = (page - 1) * size;
  const items = MOCK_USERS.slice(start, start + size);
  return delay({ data: { items, total: MOCK_USERS.length, page, size } });
}

export async function createUser(payload: UserDTO & { password?: string }): Promise<{ data: UserDTO } | null> {
  const id = `u${MOCK_USERS.length + 1}`;
  const now = new Date().toISOString();
  const newUser: UserDTO = {
    id,
    username: payload.username,
    fullName: payload.fullName,
    email: payload.email || null,
    phone: payload.phone || null,
    role: payload.role || "CUSTOMER",
    avatarUrl: payload.avatarUrl || null,
    status: payload.status || "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };
  MOCK_USERS.push(newUser);
  return delay({ data: newUser });
}

export async function getBuildingStaffs(buildingId: string): Promise<{ data: string[] } | null> {
  // simple deterministic assignment: buildings with odd id get s1,s2
  const num = parseInt(buildingId.replace(/[^0-9]/g, ""), 10) || 0;
  const assigned = num % 2 === 1 ? ["s1", "s2"] : [];
  return delay({ data: assigned });
}

export async function assignBuildingStaffs(payload: {
  buildingId: string;
  staffIds: string[];
}): Promise<{ success: boolean; message?: string } | null> {
  // simulate success
  return delay({ success: true });
}

export default {
  searchBuildings,
  listUsers,
  getBuildingStaffs,
  assignBuildingStaffs,
  createUser
};
