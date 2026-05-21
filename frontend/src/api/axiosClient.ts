import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const CLOUD_NAME = "dptvhlfwo"; 
const UPLOAD_PRESET = "estate_advance_preset";

// Central axios instance used across the app
const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
client.interceptors.request.use(
  (config) => {
    // Lấy token đã lưu từ lúc đăng nhập thành công
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    if (token) {
      // Đính kèm Bearer Token vào header Authorization theo chuẩn Spring Security
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Helper to set token (call after login). Stored only in header (bearer).
export function setAuthToken(token: string | null) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

/**
 * Hàm hỗ trợ upload file thô lên Cloudinary và trả về đường dẫn URL hình ảnh
 * @param file Đối tượng File lấy từ Ant Design Upload
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    // Gửi request POST đến endpoint public của Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Trả về đường dẫn URL dạng https rút gọn bảo mật
    return response.data.secure_url; 
  } catch (error) {
    console.error("Lỗi khi upload hình ảnh lên Cloudinary:", error);
    throw new Error("Không thể upload hình ảnh");
  }
};

export default client;
