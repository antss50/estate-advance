# USE CASE HỆ THỐNG ESTATE ADVANCE

## 1. Tổng Quan Hệ Thống

Estate Advance là hệ thống quản lý bất động sản, khách hàng, nhân viên kinh doanh và quy trình tư vấn/giao dịch. Hệ thống hỗ trợ quản trị tòa nhà, đăng ký/đăng nhập khách hàng và nhân viên, ghi nhận nhu cầu khách hàng, phân công nhân viên, gợi ý bất động sản phù hợp, gợi ý nhân viên phù hợp, cập nhật trạng thái giao dịch và thống kê doanh thu.

## 2. Tác Nhân

| Tác nhân | Mô tả |
| --- | --- |
| Quản trị viên | Quản lý nhân viên, tòa nhà, phân công tòa nhà, xem thống kê và điều phối nghiệp vụ. |
| Nhân viên | Đăng nhập, xem tòa nhà/khách hàng được phân công, tư vấn khách hàng, cập nhật tiến độ giao dịch. |
| Khách hàng | Đăng ký, đăng nhập, gửi nhu cầu mua/thuê bất động sản. |
| Hệ thống | Tự động tính điểm matching, tính hoa hồng, cập nhật doanh thu, cập nhật trạng thái tòa nhà khi giao dịch hoàn tất. |

## 3. Danh Sách Use Case

| Mã UC | Tên use case | Tác nhân chính | Mục tiêu |
| --- | --- | --- | --- |
| UC01 | Đăng ký tài khoản khách hàng | Khách hàng | Tạo tài khoản và thông tin liên hệ. |
| UC02 | Đăng nhập khách hàng | Khách hàng | Xác thực tài khoản khách hàng. |
| UC03 | Đăng ký tài khoản nhân viên | Nhân viên/Quản trị viên | Tạo tài khoản staff có role STAFF. |
| UC04 | Đăng nhập nhân viên | Nhân viên | Xác thực tài khoản staff. |
| UC05 | Quản lý nhân viên | Quản trị viên | Thêm, sửa, khóa, đổi mật khẩu, reset mật khẩu nhân viên. |
| UC06 | Quản lý tòa nhà | Quản trị viên | Thêm, sửa, xóa, tìm kiếm và xem chi tiết tòa nhà. |
| UC07 | Phân công tòa nhà cho nhân viên | Quản trị viên | Gán một tòa nhà cho một hoặc nhiều staff phụ trách. |
| UC08 | Gửi yêu cầu/nhu cầu bất động sản | Khách hàng | Tạo customer request kèm demand. |
| UC09 | Quản lý và phân công khách hàng | Quản trị viên | Xem khách hàng, phân công staff theo demand. |
| UC10 | Xem yêu cầu khách hàng theo staff | Nhân viên | Lấy danh sách customer request được phân công. |
| UC11 | Gợi ý tòa nhà phù hợp với khách hàng | Quản trị viên/Nhân viên | Tìm top tòa nhà phù hợp theo nhu cầu. |
| UC12 | Gợi ý staff phù hợp với khách hàng | Quản trị viên | Tìm staff tốt nhất theo địa bàn, hiệu suất, tải công việc. |
| UC13 | Gợi ý staff phù hợp với tòa nhà | Quản trị viên | Tìm staff tốt nhất để phụ trách tòa nhà. |
| UC14 | Cập nhật trạng thái tư vấn/giao dịch | Nhân viên/Quản trị viên | Chuyển trạng thái theo flow và xử lý PAID. |
| UC15 | Xem thống kê dashboard | Quản trị viên | Xem doanh thu, giao dịch, khách hàng, top staff. |
| UC16 | Tra cứu địa giới hành chính | Quản trị viên/Nhân viên/Khách hàng | Lấy danh sách tỉnh/thành và phường/xã. |

## 4. Đặc Tả Use Case Chi Tiết

### UC01 - Đăng Ký Tài Khoản Khách Hàng

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Khách hàng |
| API liên quan | `POST /api/customer/auth/register` |
| Tiền điều kiện | Username và email chưa tồn tại. |
| Hậu điều kiện | Tài khoản khách hàng được tạo, password được mã hóa, `is_active = 1`. Nếu có demand, demand được gán với customer. |

**Luồng chính**

1. Khách hàng nhập username, password, họ tên, số điện thoại, email, công ty và nhu cầu nếu có.
2. Hệ thống kiểm tra username tồn tại.
3. Hệ thống kiểm tra email tồn tại nếu email được nhập.
4. Hệ thống mã hóa mật khẩu.
5. Hệ thống lưu customer và demand.
6. Hệ thống trả về thông báo đăng ký thành công.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Username đã tồn tại | Trả về `success = false`, thông báo tên đăng nhập đã tồn tại. |
| Email đã được sử dụng | Trả về `success = false`, thông báo email đã được sử dụng. |

### UC02 - Đăng Nhập Khách Hàng

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Khách hàng |
| API liên quan | `POST /api/customer/auth/login` |
| Tiền điều kiện | Khách hàng đã có tài khoản. |
| Hậu điều kiện | Hệ thống cấp token đơn giản và cập nhật `last_login`. |

**Luồng chính**

1. Khách hàng nhập username và password.
2. Hệ thống tìm customer theo username.
3. Hệ thống kiểm tra tài khoản còn hoạt động.
4. Hệ thống so khớp password với BCrypt hash.
5. Hệ thống cập nhật lần đăng nhập cuối.
6. Hệ thống trả về thông tin khách hàng và token.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Username không tồn tại | Trả về thông báo tên đăng nhập không tồn tại. |
| Tài khoản bị khóa | Trả về thông báo tài khoản đã bị khóa. |
| Sai mật khẩu | Trả về thông báo mật khẩu không chính xác. |

### UC03 - Đăng Ký Tài Khoản Nhân Viên

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Nhân viên/Quản trị viên |
| API liên quan | `POST /api/staff/auth/register` |
| Tiền điều kiện | Username chưa tồn tại, role `STAFF` đã được cấu hình. |
| Hậu điều kiện | User mới có role STAFF, status = 1. |

**Luồng chính**

1. Tác nhân nhập username, password, họ tên, email, phone, working area.
2. Hệ thống kiểm tra username.
3. Hệ thống tìm role STAFF.
4. Hệ thống mã hóa password.
5. Hệ thống tạo user, gán role STAFF và status active.
6. Hệ thống trả về thông báo đăng ký thành công.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Username đã tồn tại | Trả về thông báo tên đăng nhập đã tồn tại. |
| Chưa có role STAFF | Trả về thông báo role STAFF chưa được cấu hình. |

### UC04 - Đăng Nhập Nhân Viên

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Nhân viên |
| API liên quan | `POST /api/staff/auth/login` |
| Tiền điều kiện | Nhân viên có tài khoản active và role STAFF. |
| Hậu điều kiện | Hệ thống cấp token và cập nhật `last_login`. |

**Luồng chính**

1. Nhân viên nhập username và password.
2. Hệ thống tìm user theo username.
3. Hệ thống kiểm tra status active.
4. Hệ thống kiểm tra user có role STAFF.
5. Hệ thống so khớp password.
6. Hệ thống cập nhật last login.
7. Hệ thống trả về thông tin nhân viên, working area và token.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Username không tồn tại | Trả về thông báo tên đăng nhập không tồn tại. |
| Tài khoản bị khóa | Trả về thông báo tài khoản đã bị khóa. |
| Không có quyền STAFF | Trả về thông báo tài khoản không có quyền nhân viên. |
| Sai mật khẩu | Trả về thông báo mật khẩu không chính xác. |

### UC05 - Quản Lý Nhân Viên

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `POST /api/user`, `GET /api/user/staffs`, `PUT /api/user/{id}`, `PUT /api/user/change-password/{id}`, `PUT /api/user/password/{id}/reset`, `PUT /api/user/profile/{username}`, `DELETE /api/user` |
| Tiền điều kiện | Quản trị viên có quyền quản lý user. |
| Hậu điều kiện | Thông tin user/staff được cập nhật, khóa mềm bằng `status = 0` khi xóa. |

**Luồng chính**

1. Quản trị viên mở màn hình quản lý nhân viên.
2. Hệ thống hiển thị danh sách staff active.
3. Quản trị viên thêm mới, sửa thông tin, đổi role, đổi status, đổi/reset mật khẩu hoặc xóa nhân viên.
4. Hệ thống kiểm tra trùng username/email khi cập nhật.
5. Hệ thống lưu thay đổi.
6. Hệ thống trả về thông tin user mới nhất.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Username mới đã tồn tại | Báo lỗi `Username already exists`. |
| Email mới đã tồn tại | Báo lỗi `Email already exists`. |
| Đổi mật khẩu sai mật khẩu cũ hoặc confirm không khớp | Báo lỗi đổi mật khẩu thất bại. |

### UC06 - Quản Lý Tòa Nhà

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `POST /api/building`, `GET /api/building`, `GET /api/building/{id}`, `DELETE /api/building/{ids}` |
| Tiền điều kiện | Quản trị viên có thông tin tòa nhà cần tạo/sửa. |
| Hậu điều kiện | Tòa nhà và rent area được lưu; khi xóa, assignment và rent area liên quan được xóa trước. |

**Luồng chính**

1. Quản trị viên nhập thông tin tòa nhà: tên, địa chỉ, diện tích, giá, loại giao dịch, loại bất động sản, phí dịch vụ, pháp lý, hình ảnh.
2. Hệ thống convert DTO sang entity.
3. Hệ thống lưu tòa nhà.
4. Nếu có `rentArea`, hệ thống xóa rent area cũ và tạo rent area mới.
5. Hệ thống trả về thông tin tòa nhà đã lưu.

**Tìm kiếm tòa nhà**

1. Quản trị viên nhập điều kiện tìm kiếm.
2. Hệ thống tạo `BuildingSearchBuilder`.
3. Hệ thống truy vấn tòa nhà theo điều kiện.
4. Hệ thống trả danh sách `BuildingSearchResponse`.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Lấy chi tiết ID không tồn tại | Báo lỗi `Building not found`. |
| Xóa tòa nhà | Hệ thống xóa assignmentbuilding và rentarea trước, sau đó xóa building. |

### UC07 - Phân Công Tòa Nhà Cho Nhân Viên

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `POST /api/building/assignment`, `GET /api/building/{id}/staffs`, `GET /api/building/staff/{staffId}` |
| Tiền điều kiện | Building tồn tại, staff có role STAFF. |
| Hậu điều kiện | Bảng `assignmentbuilding` được cập nhật. |

**Luồng chính**

1. Quản trị viên xem danh sách staff của một building.
2. Hệ thống trả về staff active và đánh dấu staff đã được gán.
3. Quản trị viên chọn danh sách staff phụ trách.
4. Hệ thống kiểm tra staff hợp lệ.
5. Hệ thống cập nhật danh sách staff của building.
6. Nhân viên có thể xem danh sách building được phân công.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Building không tồn tại | Báo lỗi `Building not found`. |
| Staff ID không có role STAFF | Bỏ qua staff không hợp lệ. |

### UC08 - Gửi Yêu Cầu/Nhu Cầu Bất Động Sản

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Khách hàng |
| API liên quan | `POST /api/customer/customer-request` |
| Tiền điều kiện | Customer đã tồn tại. |
| Hậu điều kiện | Demand mới và customer_request mới được tạo, status mặc định NEW nếu không truyền. |

**Luồng chính**

1. Khách hàng gửi demand gồm diện tích, giá, ward, province, transactionType, propertyType, priorityType.
2. Hệ thống tìm customer theo `customerId`.
3. Hệ thống validate các trường demand bắt buộc.
4. Hệ thống tạo demand và gán customer.
5. Hệ thống tạo customer_request gán customer và demand.
6. Hệ thống trả về ID customer.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Customer không tồn tại | Báo lỗi không tìm thấy khách hàng. |
| Demand null | Báo lỗi demand không được để trống. |
| Thiếu area/price/ward/province/transactionType/propertyType/priorityType | Báo lỗi trường bắt buộc tương ứng. |

### UC09 - Quản Lý Và Phân Công Khách Hàng

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `GET /api/customer`, `GET /api/customer/staff/{staffId}`, `POST /api/customer/assignment`, `GET /api/customer/{customerId}/assignment` |
| Tiền điều kiện | Customer và demand tồn tại. |
| Hậu điều kiện | Customer được gán cho staff theo demand; nếu customer NEW thì chuyển ASSIGNED. |

**Luồng chính**

1. Quản trị viên xem danh sách khách hàng.
2. Quản trị viên chọn một customer và demand cần phân công.
3. Hệ thống kiểm tra customer tồn tại.
4. Hệ thống kiểm tra demand tồn tại và thuộc customer.
5. Hệ thống xóa assignment cũ của customer theo demand đó.
6. Hệ thống tạo assignment mới cho các staff được chọn.
7. Nếu customer đang NEW, hệ thống cập nhật thành ASSIGNED.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Thiếu demandId | Báo lỗi `demandId là bắt buộc khi phân công staff`. |
| Demand không thuộc customer | Báo lỗi demand không thuộc customer. |
| Staff không tồn tại | Báo lỗi không tìm thấy staff. |

### UC10 - Xem Yêu Cầu Khách Hàng Theo Staff

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Nhân viên |
| API liên quan | `GET /api/customer-request/staff/{staffId}`, `GET /api/customer-request` |
| Tiền điều kiện | Staff đã được phân công customer/demand. |
| Hậu điều kiện | Nhân viên nắm được danh sách yêu cầu cần tư vấn. |

**Luồng chính**

1. Nhân viên truy cập danh sách customer request của mình.
2. Hệ thống truy vấn customer_request theo assignmentcustomer.
3. Hệ thống trả về request gồm customerId, thông tin khách hàng, demand, status, ngày tạo/ngày sửa.
4. Nhân viên xem chi tiết nhu cầu và liên hệ khách hàng.

### UC11 - Gợi Ý Tòa Nhà Phù Hợp Với Khách Hàng

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên/Nhân viên |
| API liên quan | `POST /api/customer-matching/find-buildings` |
| Tiền điều kiện | Customer tồn tại; customer có demand hoặc request truyền demand override. |
| Hậu điều kiện | Hệ thống trả về top tòa nhà AVAILABLE có điểm phù hợp cao. |

**Luồng chính**

1. Tác nhân gửi `customerId`, `topN`, `minScore` và nhu cầu bổ sung nếu cần.
2. Hệ thống lấy customer và demand hiện tại.
3. Hệ thống xác định trọng số matching theo priorityType.
4. Hệ thống lấy danh sách building có `building_status = AVAILABLE`.
5. Hệ thống tính điểm location, price, area, type cho từng building.
6. Hệ thống tính tổng điểm, lọc theo `minScore`, sắp xếp giảm dần và giới hạn topN.
7. Hệ thống trả về danh sách building phù hợp.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Thiếu customerId | Báo lỗi customerId là bắt buộc. |
| Customer không tồn tại | Báo lỗi không tìm thấy khách hàng. |

### UC12 - Gợi Ý Staff Phù Hợp Với Khách Hàng

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `POST /api/staff-customer-matching/find-staff` |
| Tiền điều kiện | Có thông tin nhu cầu/địa bàn khách hàng. |
| Hậu điều kiện | Hệ thống trả về top staff phù hợp để phân công khách. |

**Luồng chính**

1. Quản trị viên gửi thông tin customerId, demandWardName, topN, chỉ số mục tiêu doanh thu, giới hạn tải công việc.
2. Hệ thống lấy danh sách staff active.
3. Hệ thống tính điểm địa bàn theo workingArea và ward nhu cầu.
4. Hệ thống tính điểm hiệu suất theo revenue và totalDeals.
5. Hệ thống tính điểm tải công việc theo số building đang phụ trách.
6. Hệ thống tính newbie bonus nếu staff trong thời gian probation.
7. Hệ thống tính tổng điểm Score_CS, sắp xếp và trả top staff.

### UC13 - Gợi Ý Staff Phù Hợp Với Tòa Nhà

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `POST /api/building-staff-matching/find-staff` |
| Tiền điều kiện | Building tồn tại. |
| Hậu điều kiện | Hệ thống trả về top staff phù hợp với building. |

**Luồng chính**

1. Quản trị viên gửi buildingId, topN, monthsInInventory và tham số điểm.
2. Hệ thống lấy building.
3. Hệ thống tính độ khó của building theo giá, pháp lý, thanh khoản.
4. Hệ thống lấy staff active.
5. Hệ thống tính điểm địa bàn, hiệu suất, tải công việc, newbie bonus của từng staff.
6. Hệ thống sắp xếp theo Score_BS giảm dần.
7. Hệ thống trả về danh sách staff phù hợp.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Building không tồn tại | Báo lỗi không tìm thấy building id. |

### UC14 - Cập Nhật Trạng Thái Tư Vấn/Giao Dịch

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Nhân viên/Quản trị viên |
| API liên quan | `PUT /api/customer-status/update` |
| Tiền điều kiện | Customer request tồn tại. Trạng thái mới phải đúng flow: NEW -> ASSIGNED -> CONSULTING -> SIGNED -> PAID. |
| Hậu điều kiện | Customer request được cập nhật trạng thái. Nếu SIGNED -> PAID, hệ thống tính hoa hồng, cập nhật doanh thu staff và cập nhật trạng thái building. |

**Luồng chính**

1. Tác nhân gửi `customerRequestId` hoặc cặp `customerId + demandId`, kèm `newStatus`.
2. Hệ thống tìm customer request.
3. Hệ thống kiểm tra bước chuyển trạng thái hợp lệ.
4. Nếu không phải SIGNED -> PAID, hệ thống cập nhật status.
5. Nếu là SIGNED -> PAID, hệ thống tính commission theo SALE hoặc RENT.
6. Hệ thống cộng staffCommission vào revenue staff và tăng totalDeals.
7. Nếu có buildingId, hệ thống cập nhật building AVAILABLE thành SOLD hoặc RENTED.
8. Nếu RENT và có contractMonths, hệ thống set rentStartDate/rentEndDate.
9. Hệ thống trả về oldStatus, newStatus, commission và buildingStatus nếu có.

**Luồng ngoại lệ**

| Điều kiện | Xử lý |
| --- | --- |
| Không truyền customerRequestId hoặc customerId + demandId | Báo lỗi phải cung cấp thông tin định danh request. |
| Chuyển sai thứ tự status | Báo lỗi trạng thái tiếp theo phải đúng flow. |
| Staff không tồn tại khi tính commission | Báo lỗi không tìm thấy staff id. |
| Building không tồn tại | Báo lỗi không tìm thấy building id. |
| Building không AVAILABLE | Báo lỗi building đang ở trạng thái khác, không thể giao dịch. |

### UC15 - Xem Thống Kê Dashboard

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên |
| API liên quan | `GET /api/statistics/dashboard`, `GET /api/statistics/staff/{staffId}` |
| Tiền điều kiện | Hệ thống có dữ liệu staff/customer. |
| Hậu điều kiện | Quản trị viên xem được tổng quan doanh thu và hiệu suất. |

**Luồng chính dashboard**

1. Quản trị viên mở dashboard.
2. Hệ thống tính tổng doanh thu staff từ revenueSale + revenueRent.
3. Hệ thống tính doanh thu hệ thống theo cấu hình 50/50.
4. Hệ thống tính tổng deal, sale deal, rent deal.
5. Hệ thống đếm tổng khách hàng, khách active, khách NEW, khách PAID.
6. Hệ thống tính và sắp xếp top staff theo performance.
7. Hệ thống trả về thống kê.

**Luồng chính xem doanh thu staff**

1. Quản trị viên chọn staff.
2. Hệ thống lấy revenueSale, revenueRent, totalSaleDeals, totalRentDeals.
3. Hệ thống tính totalRevenue và performance.
4. Hệ thống trả về thông tin doanh thu staff.

### UC16 - Tra Cứu Địa Giới Hành Chính

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản trị viên/Nhân viên/Khách hàng |
| API liên quan | `GET /api/administrative/provinces`, `GET /api/administrative/provinces/{provinceCode}/wards` |
| Tiền điều kiện | Dữ liệu province/ward đã có trong database. |
| Hậu điều kiện | Form địa chỉ/tòa nhà/nhu cầu có dữ liệu tỉnh thành và phường xã để chọn. |

**Luồng chính**

1. Tác nhân mở form có trường địa chỉ.
2. Hệ thống lấy danh sách tỉnh/thành active.
3. Tác nhân chọn tỉnh/thành.
4. Hệ thống lấy danh sách phường/xã theo provinceCode.
5. Tác nhân chọn phường/xã cho building hoặc demand.

## 5. Quy Tắc Nghiệp Vụ Chính

| Mã | Quy tắc |
| --- | --- |
| BR01 | Customer status flow chỉ được chuyển từng bước: NEW -> ASSIGNED -> CONSULTING -> SIGNED -> PAID. |
| BR02 | Khi phân công customer, `demandId` là bắt buộc và demand phải thuộc customer. |
| BR03 | Customer NEW sau khi được phân công sẽ chuyển thành ASSIGNED. |
| BR04 | Chỉ building có `building_status = AVAILABLE` mới được matching với khách hàng. |
| BR05 | Khi SIGNED -> PAID, hệ thống tính hoa hồng và cập nhật doanh thu/số deal của staff. |
| BR06 | Khi SIGNED -> PAID với SALE, building chuyển SOLD. |
| BR07 | Khi SIGNED -> PAID với RENT, building chuyển RENTED và có thể cập nhật thời hạn thuê. |
| BR08 | Xóa user là khóa mềm bằng `status = 0`. |
| BR09 | Xóa building phải xóa assignmentbuilding và rentarea liên quan trước. |
| BR10 | Matching staff dựa trên địa bàn, hiệu suất, tải công việc và newbie bonus. |

## 6. Sơ Đồ Use Case Dạng Text

```text
Khách hàng
  -> Đăng ký tài khoản
  -> Đăng nhập
  -> Gửi yêu cầu/nhu cầu bất động sản
  -> Tra cứu tỉnh/thành, phường/xã

Nhân viên
  -> Đăng nhập
  -> Xem customer request được phân công
  -> Xem building được phân công
  -> Cập nhật trạng thái tư vấn/giao dịch
  -> Tra cứu tỉnh/thành, phường/xã

Quản trị viên
  -> Quản lý nhân viên
  -> Quản lý tòa nhà
  -> Phân công tòa nhà cho nhân viên
  -> Quản lý và phân công khách hàng
  -> Gợi ý tòa nhà phù hợp với khách hàng
  -> Gợi ý staff phù hợp với khách hàng
  -> Gợi ý staff phù hợp với tòa nhà
  -> Cập nhật trạng thái tư vấn/giao dịch
  -> Xem thống kê dashboard
  -> Tra cứu tỉnh/thành, phường/xã

Hệ thống
  -> Mã hóa mật khẩu
  -> Tính điểm matching
  -> Tính hoa hồng
  -> Cập nhật revenue/stats
  -> Cập nhật building status
```
