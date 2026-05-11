import axiosClient from "./axiosClient";

export interface Province {
  code: string;
  name: string;
  nameSlug: string | null;
  divisionType: string | null;
}

export interface Ward {
  code: string;
  name: string;
  nameSlug: string | null;
  divisionType: string | null;
  provinceCode: string;
  provinceName: string;
}

/**
 * Fetch all provinces
 */
export const getProvinces = async (): Promise<Province[]> => {
  const response = await axiosClient.get("/api/administrative/provinces");
  return response.data;
};

/**
 * Fetch wards by province code
 */
export const getWardsByProvince = async (
  provinceCode: string
): Promise<Ward[]> => {
  const response = await axiosClient.get(
    `/api/administrative/provinces/${provinceCode}/wards`
  );
  return response.data;
};
