## Báo cáo tiến độ — Frontend (Estate Advance)

### 1. Kiến trúc & Công nghệ Frontend

- **Framework / Runtime:** React 19 + TypeScript, build bằng Vite.
- **UI library:** Ant Design (antd) + @ant-design/icons.
- **HTTP client:** Axios, tập trung qua `client` trong `src/api/axiosClient.ts` (cấu hình `baseURL`, `withCredentials`, helper `setAuthToken`).
- **Routing:** react-router-dom.
- **Tooling:** TypeScript, ESLint, Vite.
- **Cấu trúc thư mục trọng tâm:**
  - `src/api` — wrappers cho các endpoint: `userApi.ts`, `buildingApi.ts`, `staffApi.ts`, `assignmentApi.ts`, `axiosClient.ts` và module giả `mockApi.ts`.
  - `src/pages` — các màn hình phân theo role: `admin/` (Dashboard, BuildingManagement, UserManagement), `staff/` (Assignment, AssignedBuilding, BuildingDetail), `customer/` (CustomerDemand).
  - `src/components` — component tái sử dụng (ví dụ `components/staff/BuildingCard.tsx`, `components/admin/StaffGrid.tsx`).
- **Quản lý state:** toàn bộ state UI hiện dùng React local state (`useState`, `useEffect`). Không tìm thấy store toàn cục (Redux/Zustand). API layer tách riêng giúp tái sử dụng và mock dễ thay thế.

### 2. Các tính năng ĐÃ tích hợp API thật (Real Data)

Ghi chú: "Gọi API thật" = gọi `axios` instance (`client`) hoặc gọi các wrapper trong `src/api` (vd. `userApi`, `buildingApi`).

- **Quản lý Người dùng (Admin)**
  - File: `src/pages/admin/UserManagement.tsx`.
  - Calls thật: `userApi.getAllUsers()` (-> `client.get('/api/customer')`), `userApi.createUser(...)`, `userApi.updateUser(...)`, `userApi.deleteUser(...)` — tất cả sử dụng `client` (xem `src/api/userApi.ts`).
  - Chức năng hoàn thiện: tải danh sách, create/update/delete người dùng, form validation, hiển thị lỗi server.

- **Quản lý Tòa nhà (Admin)**
  - File: `src/pages/admin/BuildingManagement.tsx`.
  - Calls thật: `buildingApi.searchBuildings(params)` (`client.get('/api/building', { params })`), `buildingApi.getBuilding(id)`, `createBuilding`, `updateBuilding`, `deleteBuildings`, `getBuildingStaffs`, `assignBuildingStaffs` (tất cả gọi `client`).
  - Chức năng hoàn thiện: tìm kiếm, phân trang, tạo/sửa tòa nhà (form, xử lý file), gán nhân viên (assignment), xóa (single/bulk).

- **Dashboard (Admin)**
  - File: `src/pages/admin/Dashboard.tsx`.
  - Calls thật: `buildingApi.searchBuildings(...)`, `userApi.listUsers(...)` để lấy số liệu tổng hợp (tòa nhà, user, staff).

- **Customer Assignment (CustomerDemand)**
  - File: `src/pages/customer/CustomerDemand.tsx`.
  - Calls thật: `getAllUsers()` / `getStaffs()` (via `userApi` / `staffApi`), `assignmentApi.getCustomerAssignments(...)` và trực tiếp `client.post('/api/customer/assignment', payload)` để phân công (thao tác POST thật). Đây là ví dụ rõ ràng của POST thực thi assignment.

- **Chi tiết tòa nhà (Staff)**
  - File: `src/pages/staff/BuildingDetail.tsx`.
  - Calls thật: `client.get('/api/building/{id}')`, `client.put('/api/building/{id}', payload)` (ví dụ xóa ảnh bằng PUT).

Tổng kết: các màn hình quản trị chính (User, Building, Dashboard) và flows phân công/chi tiết đã tích hợp với backend qua `axios` wrappers hoặc trực tiếp `client`.

### 3. Các tính năng đang dùng Mock Data hoặc chỉ có UI

Phân biệt rõ: hàm mock / module mock được liệt kê phía dưới — KHÔNG nhầm lẫn với các call thật.

- **Chi tiết nhu cầu khách hàng (CustomerDemand)**
  - File: `src/pages/customer/CustomerDemand.tsx`.
  - Mock function: `mockFetchCustomerDemand()` (cục bộ) — trả dữ liệu giả qua `setTimeout` (500ms).
  - UI: split-pane (danh sách khách hàng bên trái, panel phân công bên phải), expandable detail, matching button. Logic chi tiết nhu cầu hiện dùng mock — cần endpoint demands để chuyển sang real API.

- **Assignment (Staff)**
  - File: `src/pages/staff/Assignment.tsx` cùng `src/pages/staff/mockCustomers.ts`, `src/pages/staff/mockBuildings.ts`.
  - Mock datasets / helpers: `mockCustomers`, `mockBuildings`, `fetchCustomers()`, `fetchBuildings()` — trả Promise với `setTimeout`.
  - UI hoàn chỉnh: danh sách khách hàng, mở chi tiết, chọn toà nhà phù hợp, gửi khách hàng — nhưng backend chưa tích hợp, mọi data là mock.

- **AssignedBuilding (Staff)**
  - File: `src/pages/staff/AssignedBuilding.tsx` — dùng `fetchBuildings` từ `mockBuildings`.
  - UI: grid, filters, pagination — dữ liệu mock.

- **Mock API module**
  - File: `src/api/mockApi.ts` chứa `MOCK_BUILDINGS`, `MOCK_USERS` và các hàm `searchBuildings`, `listUsers`, `createUser`, `getBuildingStaffs`, `assignBuildingStaffs` — tất cả trả Promise delay.
  - Lưu ý: module này tồn tại để hỗ trợ phát triển cục bộ nhưng nhiều trang staff vẫn dùng `mockCustomers`/`mockBuildings` nằm trong `src/pages/staff`.

Kết luận: phần chức năng dành cho staff (assignment, assigned building) hiện còn phụ thuộc mock; CustomerDemand là hybrid (danh sách + phân công thật, nhưng chi tiết nhu cầu mock).

### 4. Kế hoạch Sprint tiếp theo cho Frontend (đề xuất)

Mục tiêu sprint (2 tuần): chuyển mock sang API thật, hoàn thiện Dashboard thống kê và tích hợp Matching.

- **Xác nhận API & Auth**
  - Đồng bộ contract response với backend (các endpoint trong `src/api` và file `API Contracts - Quản lý Người dùng...` trong `src/api`).
  - Kiểm tra `setAuthToken` / cookie / CORS.

- **Chuyển mock → real**
  - Thay `mockCustomers` / `mockBuildings` bằng endpoint list/search.
  - Thay `mockFetchCustomerDemand()` bằng endpoint demands (GET /api/customer/{id}/demand hoặc tương đương).
  - Implement send-gợi-ý / matching: POST /api/match hoặc endpoint tương đương.

- **Hoàn thiện Dashboard & Thống kê**
  - Thiết kế API trả doanh thu / leads / conversion theo thời gian.
  - Dùng dữ liệu thật để render chart (SVG hiện có hoặc chart library).

- **File upload & multipart**
  - Hoàn thiện `createBuildingForm` / `updateBuildingForm` để dùng multipart/form-data theo spec backend.

- **QA & Tests**
  - Viết unit tests cho API wrappers (mock axios) và component smoke tests; checklist manual cho flows CRUD & assignment.

---

### Ghi chú kỹ thuật quan trọng (rõ ràng phân biệt)

- Ví dụ gọi API thật:
  - `client.post('/api/customer/assignment', payload)` — thực hiện trong `src/pages/customer/CustomerDemand.tsx` (thao tác phân công thực tế).
  - `buildingApi.searchBuildings(params)` → `client.get('/api/building', { params })` (trong `src/pages/admin/BuildingManagement.tsx`).
  - `userApi.createUser(payload)` → `client.post('/api/user', payload)` (trong `src/pages/admin/UserManagement.tsx`).
- Ví dụ hàm mock / dữ liệu giả:
  - `mockFetchCustomerDemand()` (cục bộ trong `CustomerDemand.tsx`) — trả via `setTimeout`.
  - `mockBuildings.fetchBuildings()` và `mockCustomers.fetchCustomers()` trong `src/pages/staff/` — trả Promise với `setTimeout`.
  - `src/api/mockApi.ts` — chứa `MOCK_BUILDINGS` / `MOCK_USERS` và các hàm giả lập.

Nếu bạn muốn, tôi có thể tiếp tục với một trong các lựa chọn sau:

- (A) Sinh bảng mapping Endpoint ↔ Màn hình ↔ Payload mẫu (dùng để sync với backend).
- (B) Chuyển một trang mock cụ thể (ví dụ `AssignedBuilding`) sang gọi endpoint thật nếu bạn cung cấp URL/response shape.
- (C) Commit file này vào repo và tạo PR draft.

---

File báo cáo đã tạo: `frontend/FRONTEND_PROGRESS.md`
