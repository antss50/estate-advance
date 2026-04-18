const formatImageSrc = (src: string) => {
  if (!src || src.trim() === "") return ""; // Loại bỏ chuỗi rỗng
  
  const cleanSrc = src.trim();

  // 1. Nếu là URL tuyệt đối (Cloudinary/S3) -> Giữ nguyên
  if (cleanSrc.startsWith("http")) return cleanSrc;

  // 2. Nếu đã có đầy đủ prefix data:image/... -> Giữ nguyên
  if (cleanSrc.startsWith("data:image")) return cleanSrc;

  // 3. Nếu chuỗi bắt đầu bằng "image/" (thiếu "data:") -> Thêm "data:" vào đầu
  if (cleanSrc.startsWith("image/")) return `data:${cleanSrc}`;

  // 4. Trường hợp còn lại: Coi như là Base64 thô -> Thêm prefix chuẩn
  // Bạn nên dùng image/png hoặc image/jpeg tùy loại ảnh hay dùng nhất
  return `data:image/jpeg;base64,${cleanSrc}`;
};
export default formatImageSrc;