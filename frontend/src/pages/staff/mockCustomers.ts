
export interface Customer {
  id: string;
  name: string;
  username: string;
  isExpanded?: boolean;
  status: "CHUA_TIEP_NHAN" | "DANG_TU_VAN" | "DA_KI_HOP_DONG" | "DA_THANH_TOAN";
  priceRange?: string;
  areaRange?: string;
  location?: string;
  propertyType?: string;
  priority?: boolean;
  matchedBuildingIds?: string[]; // reference to mockBuildings ids
}

const MOCK: Customer[] = [
  {
    id: "c1",
    name: "Tạ Ngọc Ân",
    username: "@antss50",
    isExpanded: true,
    status: "CHUA_TIEP_NHAN",
    priceRange: "7 - 15 triệu/tháng",
    areaRange: "50 - 70 m2",
    location: "Phường Bến Thành, Hồ Chí Minh",
    propertyType: "Chung cư",
    priority: true,
    matchedBuildingIds: ["1", "2", "3"],
  },
  {
    id: "c2",
    name: "Nguyễn Văn B",
    username: "@nvb123",
    status: "DANG_TU_VAN",
    priceRange: "5 - 10 triệu/tháng",
    areaRange: "40 - 60 m2",
    location: "Phường 1, Quận 3",
    propertyType: "Chung cư",
    matchedBuildingIds: ["4", "5"],
  },
  {
    id: "c3",
    name: "Lê Thị C",
    username: "@ltc99",
    status: "DANG_TU_VAN",
    priceRange: "10 - 20 triệu/tháng",
    areaRange: "70 - 100 m2",
    location: "Phường 2, Quận 1",
    propertyType: "Nhà riêng",
    matchedBuildingIds: ["1", "6"],
  },
  {
    id: "c4",
    name: "Phạm D",
    username: "@pduser",
    status: "DA_KI_HOP_DONG",
    priceRange: "20 - 30 triệu/tháng",
    areaRange: "100 - 140 m2",
    location: "Phường X, Quận Y",
    propertyType: "Chung cư",
    matchedBuildingIds: ["2"],
  },
  {
    id: "c5",
    name: "Trần E",
    username: "@tran.e",
    status: "DA_THANH_TOAN",
    priceRange: "8 - 12 triệu/tháng",
    areaRange: "60 - 80 m2",
    location: "Phường Z, Quận W",
    propertyType: "Chung cư",
    matchedBuildingIds: ["3", "5"],
  },
];


export function fetchCustomers(): Promise<Customer[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK), 500);
  });
}

export const mockCustomers = MOCK;

export default { mockCustomers: MOCK, fetchCustomers };
