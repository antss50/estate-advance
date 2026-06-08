-- Test seed data for estateadvance
-- Import after Hibernate creates/updates schema.
-- Login password for seeded users/customers: password

SET NAMES utf8mb4;

-- Roles
INSERT INTO role (id, createddate, createdby, modifieddate, modifiedby, name, code)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 'Admin', 'ADMIN'),
    (1002, NOW(), 'seed', NOW(), 'seed', 'Staff', 'STAFF'),
    (1003, NOW(), 'seed', NOW(), 'seed', 'Customer', 'CUSTOMER')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    code = VALUES(code),
    modifieddate = NOW(),
    modifiedby = 'seed';

-- Users / staffs
-- BCrypt hash below matches raw password: password
INSERT INTO `user` (
    id, createddate, createdby, modifieddate, modifiedby,
    username, fullname, password, status, email, phone, working_area,
    revenue, total_deals, performance, last_login,
    total_sale_deals, total_rent_deals, revenue_sale, revenue_rent
)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed',
     'admin_test', 'Admin Test',
     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     1, 'admin.test@example.com', '0901000001', 'ALL',
     0.00, 0, 0.00, NOW(),
     0, 0, 0.00, 0.00),
    (1002, NOW(), 'seed', NOW(), 'seed',
     'staff_hanoi', 'Tran Thi Staff Ha Noi',
     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     1, 'staff.hanoi@example.com', '0902000001', 'Ha Noi',
     350000000.00, 5, 0.78, NOW(),
     2, 3, 250000000.00, 100000000.00),
    (1003, NOW(), 'seed', NOW(), 'seed',
     'staff_danang', 'Le Van Staff Da Nang',
     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     1, 'staff.danang@example.com', '0902000002', 'Da Nang',
     180000000.00, 3, 0.54, NOW(),
     1, 2, 120000000.00, 60000000.00),
    (1004, NOW(), 'seed', NOW(), 'seed',
     'staff_hcm', 'Nguyen Van Staff HCM',
     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     1, 'staff.hcm@example.com', '0902000003', 'TP. Ho Chi Minh',
     90000000.00, 1, 0.31, NOW(),
     0, 1, 0.00, 90000000.00)
ON DUPLICATE KEY UPDATE
    fullname = VALUES(fullname),
    password = VALUES(password),
    status = VALUES(status),
    email = VALUES(email),
    phone = VALUES(phone),
    working_area = VALUES(working_area),
    revenue = VALUES(revenue),
    total_deals = VALUES(total_deals),
    performance = VALUES(performance),
    total_sale_deals = VALUES(total_sale_deals),
    total_rent_deals = VALUES(total_rent_deals),
    revenue_sale = VALUES(revenue_sale),
    revenue_rent = VALUES(revenue_rent),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO user_role (id, createddate, createdby, modifieddate, modifiedby, user_id, role_id)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 1001, 1001),
    (1002, NOW(), 'seed', NOW(), 'seed', 1002, 1002),
    (1003, NOW(), 'seed', NOW(), 'seed', 1003, 1002),
    (1004, NOW(), 'seed', NOW(), 'seed', 1004, 1002)
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    role_id = VALUES(role_id),
    modifieddate = NOW(),
    modifiedby = 'seed';

-- Administrative data
INSERT INTO province (id, createddate, createdby, modifieddate, modifiedby, code, name, name_slug, division_type, phone_code, is_active)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 'HN', 'Ha Noi', 'ha-noi', 'thanh-pho-trung-uong', '24', 1),
    (1002, NOW(), 'seed', NOW(), 'seed', 'DN', 'Da Nang', 'da-nang', 'thanh-pho-trung-uong', '236', 1),
    (1003, NOW(), 'seed', NOW(), 'seed', 'HCM', 'TP. Ho Chi Minh', 'tp-ho-chi-minh', 'thanh-pho-trung-uong', '28', 1)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    name_slug = VALUES(name_slug),
    division_type = VALUES(division_type),
    phone_code = VALUES(phone_code),
    is_active = VALUES(is_active),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO ward (id, createddate, createdby, modifieddate, modifiedby, code, name, name_slug, division_type, is_active, province_id)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 'HN001', 'Phuong Hang Bac', 'phuong-hang-bac', 'phuong', 1, 1001),
    (1002, NOW(), 'seed', NOW(), 'seed', 'HN002', 'Phuong Cau Giay', 'phuong-cau-giay', 'phuong', 1, 1001),
    (1003, NOW(), 'seed', NOW(), 'seed', 'DN001', 'Phuong Hoa Cuong Bac', 'phuong-hoa-cuong-bac', 'phuong', 1, 1002),
    (1004, NOW(), 'seed', NOW(), 'seed', 'HCM001', 'Phuong Ben Nghe', 'phuong-ben-nghe', 'phuong', 1, 1003)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    name_slug = VALUES(name_slug),
    division_type = VALUES(division_type),
    is_active = VALUES(is_active),
    province_id = VALUES(province_id),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO ward_adjacency (ward_code_a, ward_code_b, ward_name_a, ward_name_b)
VALUES
    ('HN001', 'HN002', 'Phuong Hang Bac', 'Phuong Cau Giay'),
    ('HN002', 'HN001', 'Phuong Cau Giay', 'Phuong Hang Bac'),
    ('DN001', 'HCM001', 'Phuong Hoa Cuong Bac', 'Phuong Ben Nghe')
ON DUPLICATE KEY UPDATE
    ward_name_a = VALUES(ward_name_a),
    ward_name_b = VALUES(ward_name_b);

-- Buildings
INSERT INTO building (
    id, createddate, createdby, modifieddate, modifiedby,
    name, street, province_code, province_name, ward_code, ward_name,
    ward_legacy, district_legacy, structure, numberofbasement, floorarea,
    direction, level, rentprice, rentpricedescription,
    servicefee, carfee, motofee, overtimefee, waterfee, electricityfee,
    deposit, payment, renttime, decorationtime, brokeragefee, type,
    note, linkofbuilding, map, avatar, image,
    price_sale, price_rent, transaction_type,
    managername, managerphone, legal, building_status,
    rent_start_date, rent_end_date
)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed',
     'Bach Dang Office Tower', '12 Bach Dang', 'HN', 'Ha Noi', 'HN001', 'Phuong Hang Bac',
     'Hang Bac', 'Hoan Kiem', '2 ham, 15 tang', 2, 300.0,
     'Nam', 'A', 25000000.0, 'Gia thue theo thang, da gom phi quan ly',
     3.0, 2000000.0, 300000.0, 500000.0, 100000.0, 3500.0,
     '3 thang', 'Theo thang', '36 thang', '30 ngay', 1.5, 'OFFICE,RETAIL',
     'Gan pho co, phu hop van phong dai dien', 'https://example.com/buildings/1001',
     'https://maps.example.com/1001', '/uploads/buildings/1001/avatar.jpg', '/uploads/buildings/1001/1.jpg',
     0.0, 25000000.0, 'RENT',
     'Mr Quan', '0911000001', 'CLEAR', 'AVAILABLE',
     NULL, NULL),
    (1002, NOW(), 'seed', NOW(), 'seed',
     'Hoa Cuong Warehouse', '88 Nguyen Huu Tho', 'DN', 'Da Nang', 'DN001', 'Phuong Hoa Cuong Bac',
     'Hoa Cuong Bac', 'Hai Chau', '1 ham, 5 tang', 1, 900.0,
     'Bac', 'B', 70000000.0, 'Kho hang co san bai xe tai',
     2.0, 3000000.0, 300000.0, 800000.0, 150000.0, 3500.0,
     '2 thang', 'Theo quy', '24 thang', '15 ngay', 2.0, 'WAREHOUSE',
     'Phu hop logistics va trung chuyen', 'https://example.com/buildings/1002',
     'https://maps.example.com/1002', '/uploads/buildings/1002/avatar.jpg', '/uploads/buildings/1002/1.jpg',
     0.0, 70000000.0, 'RENT',
     'Ms Linh', '0911000002', 'PENDING', 'RENTED',
     '2026-01-01', '2026-12-31'),
    (1003, NOW(), 'seed', NOW(), 'seed',
     'Ben Nghe Apartment', '45 Le Loi', 'HCM', 'TP. Ho Chi Minh', 'HCM001', 'Phuong Ben Nghe',
     'Ben Nghe', 'Quan 1', '30 tang', 3, 120.0,
     'Dong', 'A', 0.0, 'Can ho cao cap dang ban',
     4.0, 2500000.0, 250000.0, 400000.0, 120000.0, 4000.0,
     '10%', 'Theo tien do', 'So huu lau dai', '45 ngay', 1.0, 'APARTMENT',
     'Can ho trung tam thanh pho', 'https://example.com/buildings/1003',
     'https://maps.example.com/1003', '/uploads/buildings/1003/avatar.jpg', '/uploads/buildings/1003/1.jpg',
     5200000000.0, 0.0, 'SALE',
     'Mr Phuc', '0911000003', 'CLEAR', 'SOLD',
     NULL, NULL),
    (1004, NOW(), 'seed', NOW(), 'seed',
     'Cau Giay Retail Center', '99 Tran Thai Tong', 'HN', 'Ha Noi', 'HN002', 'Phuong Cau Giay',
     'Cau Giay', 'Cau Giay', '3 ham, 20 tang', 3, 450.0,
     'Tay', 'A', 45000000.0, 'Mat bang ban le va van phong',
     3.5, 2200000.0, 300000.0, 600000.0, 100000.0, 3500.0,
     '3 thang', 'Theo thang', '60 thang', '20 ngay', 1.2, 'RETAIL,OFFICE',
     'Nhieu mat tien, luu luong cao', 'https://example.com/buildings/1004',
     'https://maps.example.com/1004', '/uploads/buildings/1004/avatar.jpg', '/uploads/buildings/1004/1.jpg',
     0.0, 45000000.0, 'BOTH',
     'Ms Anh', '0911000004', 'DISPUTED', 'AVAILABLE',
     NULL, NULL)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    street = VALUES(street),
    province_code = VALUES(province_code),
    province_name = VALUES(province_name),
    ward_code = VALUES(ward_code),
    ward_name = VALUES(ward_name),
    structure = VALUES(structure),
    numberofbasement = VALUES(numberofbasement),
    floorarea = VALUES(floorarea),
    rentprice = VALUES(rentprice),
    price_sale = VALUES(price_sale),
    price_rent = VALUES(price_rent),
    transaction_type = VALUES(transaction_type),
    legal = VALUES(legal),
    building_status = VALUES(building_status),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO rentarea (id, createddate, createdby, modifieddate, modifiedby, value, buildingid)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 80, 1001),
    (1002, NOW(), 'seed', NOW(), 'seed', 150, 1001),
    (1003, NOW(), 'seed', NOW(), 'seed', 300, 1002),
    (1004, NOW(), 'seed', NOW(), 'seed', 500, 1002),
    (1005, NOW(), 'seed', NOW(), 'seed', 120, 1003),
    (1006, NOW(), 'seed', NOW(), 'seed', 220, 1004)
ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    buildingid = VALUES(buildingid),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO assignmentbuilding (id, createddate, createdby, modifieddate, modifiedby, buildingid, staffid)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed', 1001, 1002),
    (1002, NOW(), 'seed', NOW(), 'seed', 1002, 1003),
    (1003, NOW(), 'seed', NOW(), 'seed', 1003, 1004),
    (1004, NOW(), 'seed', NOW(), 'seed', 1004, 1002),
    (1005, NOW(), 'seed', NOW(), 'seed', 1004, 1003)
ON DUPLICATE KEY UPDATE
    buildingid = VALUES(buildingid),
    staffid = VALUES(staffid),
    modifieddate = NOW(),
    modifiedby = 'seed';

-- Customers
INSERT INTO customer (
    id, createddate, createdby, modifieddate, modifiedby,
    username, password, fullname, phone, email, companyname,
    status, is_active, last_login
)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed',
     'customer_hanoi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     'Tran Thi Demo', '0923456789', 'test2@example.com', 'Demo Ha Noi Co',
     'NEW', 1, NOW()),
    (1002, NOW(), 'seed', NOW(), 'seed',
     'customer_danang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     'Le Van Khach', '0934567890', 'test3@example.com', 'Demo Da Nang Co',
     'CONSULTING', 1, NOW()),
    (1003, NOW(), 'seed', NOW(), 'seed',
     'customer_hcm', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     'Nguyen Van Test', '0912345678', 'test1@example.com', 'Demo HCM Co',
     'PAID', 1, NOW()),
    (1004, NOW(), 'seed', NOW(), 'seed',
     'customer_inactive', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSf8qWhIRdV3ogv4kGb7o5mEq',
     'Pham Thi Inactive', '0945678901', 'inactive@example.com', 'Inactive Co',
     'SIGNED', 0, NULL)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    fullname = VALUES(fullname),
    phone = VALUES(phone),
    email = VALUES(email),
    companyname = VALUES(companyname),
    status = VALUES(status),
    is_active = VALUES(is_active),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO demand (
    id, customer_id, area, price, ward, province, property_type, priority_type,
    transaction_type, number_of_basement, direction, legal_status, brokerage_fee
)
VALUES
    (1001, 1001, 80.0, 15000000.0, 'Phuong Hang Bac', 'Ha Noi', 'APARTMENT', 'CONVENIENT',
     'RENT', 0, 'Nam', 'PENDING', 1.5),
    (1002, 1002, 300.0, 50000000.0, 'Phuong Hoa Cuong Bac', 'Da Nang', 'WAREHOUSE', 'SAVING',
     'RENT', 2, 'Bac', 'FULL', 2.0),
    (1003, 1003, 120.0, 5000000000.0, 'Phuong Ben Nghe', 'TP. Ho Chi Minh', 'APARTMENT', 'DEFAULT',
     'SALE', 1, 'Dong', 'CLEAR', 1.0),
    (1004, 1004, 220.0, 45000000.0, 'Phuong Cau Giay', 'Ha Noi', 'OFFICE', 'SPACIOUS',
     'BOTH', 1, 'Tay', 'PENDING', 1.2)
ON DUPLICATE KEY UPDATE
    customer_id = VALUES(customer_id),
    area = VALUES(area),
    price = VALUES(price),
    ward = VALUES(ward),
    province = VALUES(province),
    property_type = VALUES(property_type),
    priority_type = VALUES(priority_type),
    transaction_type = VALUES(transaction_type),
    number_of_basement = VALUES(number_of_basement),
    direction = VALUES(direction),
    legal_status = VALUES(legal_status),
    brokerage_fee = VALUES(brokerage_fee);

INSERT INTO customer_request (
    id, createddate, createdby, modifieddate, modifiedby,
    email, fullname, phone, status, customer_id, demand_id
)
VALUES
    (1001, NOW(), 'seed', NOW(), 'seed',
     'test2@example.com', 'Tran Thi Demo', '0923456789', 'NEW', 1001, 1001),
    (1002, NOW(), 'seed', NOW(), 'seed',
     'test3@example.com', 'Le Van Khach', '0934567890', 'CONSULTING', 1002, 1002),
    (1003, NOW(), 'seed', NOW(), 'seed',
     'test1@example.com', 'Nguyen Van Test', '0912345678', 'PAID', 1003, 1003),
    (1004, NOW(), 'seed', NOW(), 'seed',
     'inactive@example.com', 'Pham Thi Inactive', '0945678901', 'SIGNED', 1004, 1004)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    fullname = VALUES(fullname),
    phone = VALUES(phone),
    status = VALUES(status),
    customer_id = VALUES(customer_id),
    demand_id = VALUES(demand_id),
    modifieddate = NOW(),
    modifiedby = 'seed';

INSERT INTO assignmentcustomer (
    id, staffid, customerid, demand_id, createddate, modifieddate, createdby, modifiedby
)
VALUES
    (1001, 1002, 1001, 1001, NOW(), NOW(), 'seed', 'seed'),
    (1002, 1003, 1002, 1002, NOW(), NOW(), 'seed', 'seed'),
    (1003, 1004, 1003, 1003, NOW(), NOW(), 'seed', 'seed'),
    (1004, 1002, 1004, 1004, NOW(), NOW(), 'seed', 'seed')
ON DUPLICATE KEY UPDATE
    staffid = VALUES(staffid),
    customerid = VALUES(customerid),
    demand_id = VALUES(demand_id),
    modifieddate = NOW(),
    modifiedby = 'seed';
