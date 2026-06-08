# AssignmentGrid Component - Hướng dẫn sử dụng

## Tổng quan

AssignmentGrid component hiển thị danh sách nhu cầu khách hàng (Customer Requests) và danh sách các toà nhà (Buildings) được phân công cho nhân viên quản lý, với giao diện dạng grid card.

## Tính năng

### 1. Hiển thị Customer Cards

- Tên khách hàng và ID
- Số điện thoại và email
- Thông tin nhu cầu: giá, diện tích, vị trí, loại
- Trạng thái (Mới, Tư vấn, Đã phân công, Đã ký, Đã thanh toán)
- Danh sách nhân viên phụ trách (hiển thị avatar)
- Click card để mở chi tiết và quản lý phân công

### 2. Hiển thị Building Cards

- Tên và ID toà nhà
- Hình ảnh
- Thông tin: giá cho thuê, diện tích, vị trí, loại
- Danh sách nhân viên phụ trách
- Button "Cho thuê" (có thể tùy chỉnh)
- Click card để mở chi tiết và quản lý phân công

### 3. Modal Quản lý Phân công

- Xem thông tin chi tiết của khách hàng hoặc toà nhà
- Chọn/bỏ chọn nhân viên để phân công
- Lưu phân công (gọi API)
- Tự động reload dữ liệu sau khi lưu

## Cài đặt

### 1. Import Component

```tsx
import AssignmentGrid from "../components/admin/AssignmentGrid";
```

### 2. Sử dụng trong Page/Layout

```tsx
export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <h1>Quản lý Phân công</h1>
      <AssignmentGrid />
    </div>
  );
}
```

### 3. Styling (tùy chỉnh)

Component tự động import CSS file `AssignmentGrid.css`. Nếu cần tùy chỉnh styling, edit file này.

## API Endpoints được sử dụng

### Customer Requests

- **GET** `/api/customer-request` - Lấy danh sách yêu cầu khách hàng
- **GET** `/api/customer/{customerId}/assignment` - Lấy danh sách nhân viên được phân công

### Buildings

- **GET** `/api/building` - Lấy danh sách toà nhà
- **GET** `/api/building/{id}` - Lấy thông tin chi tiết toà nhà
- **GET** `/api/building/{id}/staffs` - Lấy danh sách nhân viên của toà nhà

### Assignment

- **POST** `/api/customer/{customerId}/assignment` - Phân công nhân viên cho khách hàng
- **POST** `/api/building/assignment` - Phân công nhân viên cho toà nhà

## Cấu trúc Dữ liệu

### CustomerRequestDTO

```typescript
interface CustomerRequestDTO {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  demand: {
    area: number;
    price: number;
    location: string;
    propertyType?: string;
  };
  status?: "NEW" | "CONSULTING" | "ASSIGNED" | "SIGNED" | "PAID";
}
```

### BuildingDTO

```typescript
interface BuildingDTO {
  id?: number;
  name: string;
  address?: string;
  district?: string;
  ward?: string;
  rentPrice?: number;
  floorArea?: number;
  type?: string;
  avatar?: string;
  image?: string;
  imageUrls?: string[];
  // ...
}
```

### BuildingStaffEntry

```typescript
interface BuildingStaffEntry {
  staffId: number;
  fullName: string;
  checked?: boolean;
}
```

## Responsive Design

- Desktop: Grid layout 2-3 columns tùy theo kích thước
- Tablet: 2 columns
- Mobile: 1 column

## Themes & Customization

### Color Scheme

- Primary: #ffc107 (Yellow)
- Background: #f5f5f5
- Card: #ffffff
- Text: #1a1a1a

### Status Colors

- NEW: #fff3cd (Yellow)
- CONSULTING: #cfe2ff (Blue)
- ASSIGNED: #d1e7dd (Green)
- SIGNED: #d1e7dd (Green)
- PAID: #d1e7dd (Green)

## Components Dependencies

### Main Component Files

- `AssignmentGrid.tsx` - Main grid component
- `CustomerDetailModal.tsx` - Modal for customer details
- `BuildingDetailModal.tsx` - Modal for building details
- `AssignmentGrid.css` - Grid styles
- `AssignmentModals.css` - Modal styles

### API Files

- `userApi.ts` - Customer request APIs
- `buildingApi.ts` - Building APIs
- `assignmentApi.ts` - Assignment APIs
- `staffApi.ts` - Staff APIs

### Type Files

- `user.type.ts` - User and customer types
- `building.type.ts` - Building types
- `response.type.ts` - Response wrapper types

### Utility Files

- `assignmentUtils.ts` - Helper functions for formatting and validation

## Troubleshooting

### Problem: Không hiển thị dữ liệu

**Solution:**

1. Kiểm tra console cho lỗi API
2. Đảm bảo các endpoint API hoạt động đúng
3. Kiểm tra network tab trong DevTools
4. Xem log error trong component

### Problem: Modal không mở

**Solution:**

1. Kiểm tra state `selectedModal` trong component
2. Đảm bảo các modal component được import đúng
3. Xem console cho lỗi render

### Problem: Phân công không lưu được

**Solution:**

1. Kiểm tra network request
2. Đảm bảo authentication token đúng
3. Kiểm tra payload được gửi
4. Xem error response từ backend

## Performance Optimization

### Current Implementation

- Parallel loading of customer requests and buildings
- Lazy loading of staff data per card
- Memoization không được dùng (có thể thêm nếu cần)

### Recommended Improvements

- Add React.memo() for card components
- Use useCallback() for event handlers
- Implement pagination for large datasets
- Add request caching layer

## Future Enhancements

- [ ] Filter và search functionality
- [ ] Sorting options (by date, by staff count, etc.)
- [ ] Bulk assignment
- [ ] Export to Excel/PDF
- [ ] Assignment history view
- [ ] Real-time updates with WebSocket
- [ ] Analytics dashboard
- [ ] Mobile app responsive improvements

## Support

Để báo cáo lỗi hoặc yêu cầu tính năng, vui lòng liên hệ team develop hoặc tạo issue trên repository.
