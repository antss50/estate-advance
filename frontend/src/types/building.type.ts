import type { PaginatedResult, ResponseDTO } from './response.type';

export interface BuildingDTO {
  id?: number;
  name?: string;
  address?: string;
  district?: string;
  ward?: string;
  street?: string;
  structure?: string;
  numberOfBasement?: number;
  floorArea?: number; // m2
  direction?: string;
  level?: number | string;
  rentArea?: string;
  rentAreaDescriptions?: string[];
  imageUrls?: string[];
  rentPrice?: number; // monthly VND
  rentPriceDescription?: string;
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
  linkOfBuilding?: string;
  map?: string;
  avatar?: string;
  image?: string;
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  typeCode?: string | string[];
  type?: string;
  managerName?: string | null;
  managerPhone?: string | null;
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
  name: string;
  address?: string;
  managerName?: string | null;
  managerPhone?: string | null;
  floorArea?: number;
  rentArea?: string;
  rentPrice?: number;
  serviceFee?: number;
  brokerageFee?: number;
  type?: string;
}

export interface AssignmentBuildingDTO {
  buildingId: number | string;
  staffIds: number[];
  assignedBy?: string;
}

export interface AssignmentStaffDTO {
  staffId: number;
  fullName: string;
  checked?: boolean;
}

export interface SuggestedBuildingDTO {
  buildingId: number;
  buildingName: string;
  address: string;
  transactionType: string;
  price: number;
  area: number;
  wardName: string;
  provinceName: string;
  buildingType: string;
  priceMatchScore: number;
  areaMatchScore: number;
  locationMatchScore: number;
  typeMatchScore: number;
  totalScore: number;
}

export interface MatchingResponseDTO {
  customerId: string;
  desiredPrice: number;
  desiredArea: number;
  desiredWard: string;
  desiredProvince: string;
  priorityType: string;
  totalMatches: number;
  suggestedBuildings: SuggestedBuildingDTO[];
}


export type BuildingListResponse = ResponseDTO<PaginatedResult<BuildingDTO>>;

export default {};
