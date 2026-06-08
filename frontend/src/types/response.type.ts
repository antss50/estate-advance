/** Generic API response wrapper */
export interface ResponseDTO<T> {
  items: import("c:/Do_An_1/estate-advance/frontend/src/types/user.type").UserDTO[] | undefined;
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, unknown> | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export default {};
