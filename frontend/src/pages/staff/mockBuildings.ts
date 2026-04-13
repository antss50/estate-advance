export interface BuildingCard {
  id: string;
  title: string;
  price: string;
  area: string;
  bedrooms: string;
  baths: string;
  location: string;
  description: string;
  imageUrl: string;
}

const MOCK: BuildingCard[] = [
  {
    id: "1",
    title: "CĂN HỘ ECO GREEN SAIGON QUẬN 7 FULL NỘI THẤT",
    price: "14 triệu/tháng",
    area: "65 m2",
    bedrooms: "2PN",
    baths: "2WC",
    location: "Hồ Chí Minh",
    description:
      "Eco Green Saigon là khu căn hộ cao cấp nội bật tại Quận 7 với không gian sống xanh, tiện ích đồng bộ và kết nối giao thông thuận tiện.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "CĂN HỘ HARMONY RIVERSIDE VIEW SÔNG",
    price: "18 triệu/tháng",
    area: "80 m2",
    bedrooms: "2PN",
    baths: "2WC",
    location: "Hồ Chí Minh",
    description: "Căn hộ hướng sông, nội thất hiện đại, thoáng mát và nhiều tiện ích xung quanh.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448071-0ad4c9f9b1d4?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "CĂN HỘ SUNRISE CENTRAL - TRUNG TÂM QUẬN 1",
    price: "28 triệu/tháng",
    area: "95 m2",
    bedrooms: "3PN",
    baths: "2WC",
    location: "Hồ Chí Minh",
    description: "Vị trí trung tâm, phù hợp gia đình, gần tiện ích, giao thông thuận lợi.",
    imageUrl:
      "https://images.unsplash.com/photo-1505691723518-36a5b6a3b5c1?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "CĂN HỘ LAKE VIEW - GẦN CÔNG VIÊN",
    price: "12 triệu/tháng",
    area: "55 m2",
    bedrooms: "1PN",
    baths: "1WC",
    location: "Hồ Chí Minh",
    description:
      "Căn hộ nhỏ gọn, phù hợp single hoặc cặp đôi, view công viên và môi trường yên tĩnh.",
    imageUrl:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "CĂN HỘ RIVER GATE - TIỆN NGHI CAO CẤP",
    price: "22 triệu/tháng",
    area: "110 m2",
    bedrooms: "3PN",
    baths: "3WC",
    location: "Hồ Chí Minh",
    description: "Tiện nghi cao cấp, an ninh, hồ bơi, gym, phù hợp gia đình lớn.",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "CĂN HỘ CITY GARDEN - VIEW THÀNH PHỐ",
    price: "16 triệu/tháng",
    area: "70 m2",
    bedrooms: "2PN",
    baths: "2WC",
    location: "Hồ Chí Minh",
    description:
      "View thành phố, nội thất tối giản và tiện nghi, nằm trong khu dân cư an toàn.",
    imageUrl:
      "https://images.unsplash.com/photo-1560449755-8b8e1e16b7b2?w=1200&q=80&auto=format&fit=crop",
  },
];

function delay<T>(v: T, ms = 200) {
  return new Promise<T>((res) => setTimeout(() => res(v), ms));
}

export async function fetchBuildings(
  page = 1,
  size = 6
): Promise<{ items: BuildingCard[]; total: number; page: number; size: number }> {
  const start = (page - 1) * size;
  const items = MOCK.slice(start, start + size);
  return delay({ items, total: MOCK.length, page, size });
}

export const mockBuildings = MOCK;

export default { fetchBuildings, mockBuildings };
