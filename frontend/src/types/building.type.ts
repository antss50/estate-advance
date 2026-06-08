import type { PaginatedResult, ResponseDTO } from './response.type';

export interface BuildingDTO {
  id?: number;
  name?: string;
  address?: string;
  province?: string;
  provinceCode?: string;
  provinceName?: string;
  disctict?: string | null;
  ward?: string;
  wardCode?: string;
  wardName?: string;
  street?: string;
  structure?: string;
  numberOfBasement?: number;
  floorArea?: number; // m2
  direction?: string;
  level?: number | string;
  rentArea?: string;
  rentAreaDescriptions?: string[];
  imageUrls?: string[];
  rentPrice?: number; 
  priceSale?: number;
  priceRent?: number;
  // rentPriceDescription?: string;
  serviceFee?: number;
  carFee?: number;
  motoFee?: number;
  overtimeFee?: number;
  waterFee?: number;
  electricityFee?: number;
  deposit?: number;
  payment?: string;
  rentTime?: string;
  decorationTime?: string;
  brokerageFee?: number;
  note?: string;
  // linkOfBuilding?: string;
  map?: string;
  avatar?: string;
  image?: string;
  // createdDate?: string;
  // modifiedDate?: string;
  // createdBy?: string;
  // modifiedBy?: string;
  // typeCode?: string | string[];
  // type?: string;
  managerName?: string | null;
  managerPhone?: string | null;
  transactionType?: string;
  propertyType?: string;
  legal?: string;
}

export interface BuildingSearchRequest {
  name?: string;
  floorArea?: number;
  district?: string;
  ward?: string;
  street?: string;
  numberOfBasement?: number;
  direction?: string;
  level?: number;
  rentAreaFrom?: number;
  rentAreaTo?: number;
  rentPriceFrom?: number;
  rentPriceTo?: number;
  managerName?: string;
  managerPhone?: string;
  staffId?: number;
  typeCode?: Array<string>;
  page?: number;
  size?: number;
  sort?: string;
}

export interface BuildingSearchResponse {
  id?: number;
  buildingId?: number;
  name?: string;
  address?: string;
  managerName?: string | null;
  managerPhone?: string | null;
  floorArea?: number;
  rentArea?: string;
  rentPrice?: number;
  serviceFee?: number;
  brokerageFee?: number;
  type?: string;
  priceSale?: number;
  priceRent?: number;
  rentPriceDescription?: string;
  imageUrls?: string[];
  buildingName?: string;
  transactionType?: string;
  avatar?: string;
  note?: string;
  structure?: string;
}

export interface AssignmentBuildingDTO {
  buildingId: number | string;
  staffIds: number[];
  // assignedBy?: string;
}

export interface AssignmentStaffDTO {
  staffId: number;
  fullName: string;
  checked?: string; // "checked" hoặc true/false
}

export interface SuggestedBuildingDTO {
  buildingId: number;
  buildingName: string;
  address: string;
  priceRent?: number;
  priceSale?: number;
  floorArea: number;
  scorePrice: number;
  scoreArea: number;
  scoreLocation: number;
  scoreType: number;
  totalScore: number;
}

export interface MatchingResponseDTO {
  customerId: string;
  customerName: string;
  priorityType: string;
  totalFound: number;
  results: SuggestedBuildingDTO[];
}

export type BuildingStaffEntry = { 
  staffId: number; 
  fullName: string; 
  checked: boolean;
  
};

export type BuildingListResponse = ResponseDTO<PaginatedResult<BuildingDTO>>;

export default {};
