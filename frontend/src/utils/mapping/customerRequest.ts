import type { UserDemandDTO } from "../../types/user.type";

const mapRequestToMatchingPayload = (customerRequest: UserDemandDTO) => {
  // 1. Tách chuỗi location
  // Giả sử format luôn là "Phường..., Tỉnh/Thành phố"
  const locationParts = customerRequest.demand?.location?.split(",").map((s: string) => s.trim());
  const ward = locationParts?.[0] || "";
  const province = locationParts?.[1] || "";

  // 2. Trả về cấu trúc Payload như Hình 1
  return {
    customerId: customerRequest.id, // Lưu ý lấy đúng Customer ID[cite: 1, 2]
    transactionType: "SALE", // Mặc định hoặc dựa trên logic activeTab của bạn
    desiredPriceSale: Number(customerRequest.demand.price), // Convert từ 3.6E9[cite: 2]
    desiredArea: customerRequest.demand.area,
    desiredWard: ward,
    desiredProvince: province,
    buildingType: "APARTMENT", // Có thể map từ propertyType nếu có
    priorityType: "DEFAULT",
    priceTolerance: 0.2, // Các thông số sai số mặc định
    areaTolerance: 0.2,
    limit: 5
  };
};

export default mapRequestToMatchingPayload;