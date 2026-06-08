import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Modal,
  Form,
  message,
  Typography,
  Spin,
  InputNumber,
  Select,
  Upload,
  Tag,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import buildingApi from "../../api/buildingApi";
import type {
  BuildingDTO,
  BuildingSearchRequest,
  BuildingSearchResponse,
  AssignmentBuildingDTO,
  AssignmentStaffDTO,
} from "../../types/building.type";
import formatImageSrc from "../../utils/format/images";
import type { MatchedStaffForBuildingDTO } from "../../types/user.type";
import type { ResponseDTO } from "../../types/response.type";
import { uploadImageToCloudinary } from "../../api/axiosClient";
import staffApi from "../../api/staffApi";

const { Title } = Typography;

const PAGE_SIZE = 12;

const BuildingManagement: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingSearchResponse[]>([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const [assignVisible, setAssignVisible] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState<BuildingDTO | null>(
    null,
  );

  // Create / Edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingDTO | null>(
    null,
  );
  const [formEdit] = Form.useForm();
  const [uploadList, setUploadList] = useState<UploadFile[]>([]);

  const [staffOptions, setStaffOptions] = useState<MatchedStaffForBuildingDTO[]>([]);
  // const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);

  const [form] = Form.useForm();
  const propertyType = Form.useWatch("propertyType", form);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchBuildings = async (page = 1, kw = "") => {
    setLoading(true);
    try {
      const params: BuildingSearchRequest = {
        name: kw || "",
        page: page,
        size: PAGE_SIZE,
      };

      // backend returns List<BuildingSearchResponse>
      const res = await buildingApi.searchBuildings(params);
      if (Array.isArray(res)) {
        setBuildings(res as BuildingSearchResponse[]);
        setTotal((res as BuildingSearchResponse[]).length || 0);
      } else {
        setBuildings([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error fetching buildings", err);
      message.error("Lấy danh sách tòa nhà thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings(page, keyword);
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => fetchBuildings(1, keyword), 200);
    return () => clearTimeout(t);
  }, [keyword]);

  // useEffect(() => {
  //   if (assignVisible && staffOptions.length > 0) {
  //     const assignedIds = staffOptions
  //       .filter((staff) => staff.checked === true)
  //       .map((staff) => staff.staffId);

  //     console.log("Danh sách ID nhân viên đã gán sẵn:", assignedIds);

  //     // Điền trực tiếp mảng ID vào Checkbox.Group thông qua instance form
  //     form.setFieldsValue({
  //       staffIds: assignedIds,
  //     });
  //   } else if (!assignVisible) {
  //     form.resetFields(); // Reset làm sạch dữ liệu biểu mẫu khi đóng Modal
  //   }
  // }, [assignVisible, staffOptions, form]);

  const onSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const openAssign = async (building: BuildingDTO) => {
    if (!building.id) return;

    setCurrentBuilding(building);
    setAssignVisible(true);
    setAssigning(true);

    try {
      const [matchingRes, assignedStaffRes] = await Promise.all([
        staffApi.getMatchingStaffsForBuilding({
          buildingId: Number(building.id),
          topN: 5,
        }), 
        buildingApi.getBuildingStaffs(String(building.id)), 
      ]);

      const matchingData = matchingRes.results ?? [];

      console.log("📡 matchingRes from API:", matchingRes);
      console.log("📡 assignedStaffRes from API:", assignedStaffRes);

      const assignedData = Array.isArray(assignedStaffRes)
        ? assignedStaffRes
        : (assignedStaffRes as ResponseDTO<AssignmentStaffDTO[]>)?.data;

      console.log("✅ matchingData extracted:", matchingData);
      console.log("✅ assignedData extracted:", assignedData);

      const matchingList: MatchedStaffForBuildingDTO[] = Array.isArray(matchingData)
        ? (matchingData as MatchedStaffForBuildingDTO[])
        : [];
      const assignedList: AssignmentStaffDTO[] = Array.isArray(assignedData)
        ? assignedData
        : [];

      console.log("📊 matchingList length:", matchingList.length);
      console.log("📊 matchingList content:", matchingList);

      // 2. Tạo một Bản đồ Map lưu trữ trạng thái checked thực tế theo từng staffId từ assignedList
      // Key: staffId (number), Value: string (giá trị "checked" hoặc "")
      const assignedMap = new Map<number, string>();
      assignedList.forEach((item) => {
        if (item.staffId) {
          assignedMap.set(item.staffId, String(item.checked) || "");
        }
      });

      // 3. Tiến hành đồng bộ trộn dữ liệu: Thêm properties cho render component
      const finalStaffOptions: MatchedStaffForBuildingDTO[] = matchingList.map((staff) => {
        console.log("🔄 Mapping staff:", staff.staffId, staff.staffName);
        
        // Thêm properties cho render component cần
        const transformed: MatchedStaffForBuildingDTO = {
          ...staff,
          totalDeals: staff.totalDeals || 0,
          currentWorkload: staff.currentLoad || 0,
        };
        
        console.log("✔ Transformed object:", transformed);
        return transformed;
      });

      console.log("📋 finalStaffOptions after mapping:", finalStaffOptions);
      console.log("📋 finalStaffOptions length:", finalStaffOptions.length);

      // 4. Sắp xếp danh sách nhân viên theo điểm totalScoreBS giảm dần
      finalStaffOptions.sort(
        (a, b) => (b.totalScoreBS || 0) - (a.totalScoreBS || 0),
      );

      console.log("📋 finalStaffOptions after sorting:", finalStaffOptions);

      // Đổ mảng dữ liệu đã chuẩn hóa cấu trúc vào state mà không lo lỗi Type
      setStaffOptions(finalStaffOptions);
      console.log("✅ State updated with finalStaffOptions");
      console.log(
        "Danh sách nhân viên sau khi đồng bộ cấu trúc:",
        finalStaffOptions,
      );
    } catch (err) {
      console.error("Error matching staffs", err);
      message.error("Không thể tải danh sách nhân viên phù hợp");

      // Xử lý hiển thị lỗi 500 nếu buildingId không tồn tại
      if ((err as { response?: { status: number } }).response?.status === 500) {
        message.error("Lỗi server: Tòa nhà không tồn tại hệ thống matching");
      }
    } finally {
      setAssigning(false);
    }
  };

  const closeAssign = () => {
    setAssignVisible(false);
    setCurrentBuilding(null);
    form.resetFields();
  };

  const openCreate = () => {
    setEditingBuilding(null);
    formEdit.resetFields();
    setUploadList([]);
    setEditVisible(true);
  };

  const openEdit = (building: BuildingDTO) => {
    (async () => {
      setEditLoading(true);
      try {
        // 1. Fetch dữ liệu từ API
        const data = (await buildingApi.getBuilding(
          String(building.id),
        )) as BuildingDTO;
        if (data) {
          setEditingBuilding(data);

          // Đổ dữ liệu vào Form
          formEdit.setFieldsValue(data);

          // 3. Xử lý danh sách ảnh (uploadList)
          const imageUrlString = data.image || "";

          // Tách chuỗi bằng dấu phẩy và loại bỏ các phần tử rỗng (tránh ghost images)
          const urls = imageUrlString
            .split(",")
            .map((u: string) => u.trim())
            .filter((u: string) => u !== "");

          const files: UploadFile[] = urls.map((u: string, idx: number) => ({
            uid: `existing-${idx}-${Date.now()}`, // Tạo UID duy nhất để tránh lỗi render
            name: `image-${idx}.jpg`,
            status: "done",
            url: formatImageSrc(u),
          }));

          setUploadList(files);
          setEditVisible(true);
        }
      } catch (err) {
        console.error("Open edit error:", err);
        message.error("Lấy chi tiết tòa nhà thất bại");
      } finally {
        setEditLoading(false);
      }
    })();
  };

  const closeEdit = () => {
    setEditVisible(false);
    setEditingBuilding(null);
    formEdit.resetFields();
  };

  const handleSave = async (values: BuildingDTO) => {
    setEditLoading(true);
    try {
      const payload: BuildingDTO = {
        ...editingBuilding,
        ...values,
        ward: values.ward,
        propertyType: Array.isArray(values.propertyType)
          ? values.propertyType.join(",")
          : values.propertyType,
      };

      // 2. Xử lý ảnh bằng Cloudinary thay vì đổi sang Base64
      if (uploadList.length > 0) {
        const imagePromises = uploadList.map(async (file) => {
          // TRƯỜNG HỢP 1: Nếu là file mới được chọn từ máy tính (originFileObj)
          if (file.originFileObj instanceof File) {
            // Upload trực tiếp lên Cloudinary và lấy URL về
            return await uploadImageToCloudinary(file.originFileObj);
          }

          // TRƯỜNG HỢP 2: Nếu là ảnh cũ đã có sẵn URL (không thay đổi)
          if (file.url) {
            if (file.url.startsWith("data:image")) {
              return file.url;
            }
            return file.url;
          }
          return "";
        });

        // Đợi tất cả các ảnh upload xong
        const images = await Promise.all(imagePromises);
        const validImages = images.filter((img) => img);

        // Gộp các đường dẫn URL (rất ngắn gọn, sạch sẽ) để gửi lên DB
        payload.image = validImages.join(",");
        payload.avatar = validImages[0] || "";
      } else {
        payload.image = "";
        payload.avatar = "";
      }

      // 3. Gửi request đến API
      let res;
      if (payload.id) {
        res = await buildingApi.updateBuilding(String(payload.id), payload);
      } else {
        res = await buildingApi.createBuilding(payload);
      }

      if (res) {
        message.success("Lưu tòa nhà thành công");
        closeEdit();
        fetchBuildings(page, keyword);
      }
    } catch (err) {
      console.error("Save building error", err);
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Lưu tòa nhà thất bại";
      message.error(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  // Upload handlers
  const beforeUpload = (file: File) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/webp";
    if (!isImage) {
      message.error("Chỉ cho phép file ảnh JPG/PNG/WEBP");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB");
      return Upload.LIST_IGNORE;
    }
    // prevent auto upload
    return false;
  };

  const onUploadChange = ({
    fileList: newList,
  }: {
    file: UploadFile;
    fileList: UploadFile[];
  }) => {
    // keep our state controlled, show preview and allow remove
    setUploadList(newList);
  };

  const onRemoveUpload = (file: UploadFile) => {
    setUploadList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleAssign = async () => {
    if (!currentBuilding) return;
    //   if (selectedStaffs.length === 0) {
    //   message.warning("Vui lòng chọn ít nhất một nhân viên để gán");
    //   return;
    // }
    const formValues = form.getFieldsValue();
    const staffIdsFromForm: number[] = formValues.staffIds || [];

    // 2. Kiểm tra tính hợp lệ của dữ liệu biểu mẫu
    if (staffIdsFromForm.length === 0) {
      message.warning("Vui lòng chọn ít nhất một nhân viên để gán");
      return;
    }

    setAssigning(true);
    try {
      const payload: AssignmentBuildingDTO = {
        buildingId: Number(currentBuilding.id),
        staffIds: staffIdsFromForm,
      };
      const res = await buildingApi.assignBuildingStaffs(payload);
      if (res && (res.success === true || res.success === undefined)) {
        message.success("Gán nhân viên thành công");
        closeAssign();
      } else {
        message.error(res?.message || "Gán nhân viên thất bại");
      }
    } catch (err) {
      console.error("Assign error", err);
      message.error("Gán nhân viên thất bại");
    } finally {
      setAssigning(false);
    }
  };

  const confirmDelete = (ids: (string | number)[] | React.Key[]) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa ${ids.length} tòa nhà? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await buildingApi.deleteBuildings(ids as (string | number)[]);
          message.success("Xóa thành công");
          setSelectedRowKeys([]);
          // refresh list, go to first page to avoid empty page
          fetchBuildings(1, keyword);
        } catch (err) {
          console.error("Delete error", err);
          const msg = (err as Error).message || "Xóa tòa nhà thất bại";
          message.error(msg);
        }
      },
    });
  };

  const handleDeleteSingle = (id: string | number) => confirmDelete([id]);

  const handleBulkDelete = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    confirmDelete(selectedRowKeys);
  };

  const columns = [
    {
      title: "Tên tòa nhà",
      dataIndex: "name",
      key: "name",
      render: (val: string) => <strong>{val}</strong>,
    },
    {
      title: "Loại tòa nhà",
      dataIndex: "structure",
      key: "structure",
      render: (val: string) => val || "-",
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Nhân viên quản lý",
      dataIndex: "managerName",
      key: "managerName",
    },
    {
      title: "Diện tích (m²)",
      dataIndex: "floorArea",
      key: "floorArea",
      render: (v: number) => (v ? v.toLocaleString() + " m²" : "-"),
    },
    {
      title: "Giá thuê",
      dataIndex: "priceRent",
      key: "priceRent",
      render: (v: number) => (v ? v.toLocaleString() + " VND" : "-"),
    },
    {
      title: "Giá bán",
      dataIndex: "priceSale",
      key: "priceSale",
      render: (v: number) => (v ? v.toLocaleString() + " VND" : "-"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: BuildingDTO) => (
        <Space>
          <Button icon={<TeamOutlined />} onClick={() => openAssign(record)}>
            Gán nhân viên
          </Button>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/buildings/${record.id}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSingle(record.id as string | number)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý Toà Nhà
          </Title>
          <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            Chào mừng đến với Estate Advance
          </span>
        </Col>

        <Col>
          <Space>
            <Input
              placeholder="Tìm kiếm tòa nhà theo tên"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 420, borderRadius: "30px" }}
            />
            <Button type="primary" shape="circle">
              <SearchOutlined />
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBulkDelete}
              disabled={!selectedRowKeys.length}
            >
              Xóa
            </Button>
            <Button icon={<PlusOutlined />} onClick={openCreate}>
              Tạo mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          dataSource={buildings}
          columns={columns}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (page) => setPage(page),
          }}
        />
      </Spin>

      <Modal
        title={
          <span>
            <TeamOutlined /> Đề xuất nhân viên phù hợp cho:{" "}
            <strong>{currentBuilding?.name}</strong>
          </span>
        }
        open={assignVisible}
        onCancel={closeAssign}
        onOk={handleAssign}
        confirmLoading={assigning}
        width={600}
      >
        <Spin spinning={assigning}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Danh sách nhân viên (Sắp xếp theo độ phù hợp)"
              name="staffIds"
            >
              <Checkbox.Group
                // value={selectedStaffs}
                // onChange={(checkedValues) => setSelectedStaffs(checkedValues as number[])}
                style={{ width: "100%" }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {staffOptions.length > 0 ? (
                    staffOptions.map((staff) => (
                      <Checkbox
                        key={staff.staffId}
                        value={staff.staffId}
                        style={{
                          padding: "12px",
                          border: "1px solid #f0f0f0",
                          borderRadius: "8px",
                          width: "100%",
                          margin: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "15px" }}>
                              {staff.staffName}
                            </strong>
                            <div style={{ fontSize: "12px", color: "#363636" }}>
                              Khu vực làm việc:{" "}
                              <strong>{staff.workingArea}</strong> | Giao dịch
                              thành công: <strong>{staff.totalDeals}</strong> |
                              Số khách phụ trách:{" "}
                              <strong>{staff.currentWorkload}</strong>
                            </div>
                          </div>
                          {/* Hiển thị điểm số Matching */}
                          <div style={{ textAlign: "right" }}>
                            <Tag
                              color={
                                staff.totalScoreBS! > 0.8 ? "green" : "orange"
                              }
                            >
                              {Math.round(staff.totalScoreBS! * 100)}% Match
                            </Tag>
                          </div>
                        </div>
                      </Checkbox>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      Không tìm thấy nhân viên phù hợp
                    </div>
                  )}
                </div>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        title={
          editingBuilding?.id
            ? `Cập nhật tòa nhà: ${editingBuilding.name}`
            : "Tạo tòa nhà mới"
        }
        open={editVisible}
        onCancel={closeEdit}
        onOk={() => formEdit.submit()}
        confirmLoading={editLoading}
        width={800}
      >
        <Form
          layout="vertical"
          form={formEdit}
          onFinish={handleSave}
          initialValues={{ typeCode: [] }}
        >
          <Row gutter={12}>
            {/* Tên tòa nhà và Loại */}
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên tòa nhà"
                rules={[
                  {
                    required: true,
                    message: "Tên tòa nhà không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="propertyType" label="Loại nhà đất">
                <Select
                  options={[
                    { label: "Nhà đất thuê", value: "RENT" },
                    { label: "Nhà đất bán", value: "SALE" },
                    { label: "Nhà đất cho thuê và bán", value: "BOTH" },
                  ]}
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item name="typeCode" label="Loại (typeCode)">
                <Select
                  mode="multiple"
                  options={[
                    { label: "Tầng trệt", value: "TANG_TRET" },
                    { label: "Nội thất", value: "NOI_THAT" },
                    { label: "Văn phòng", value: "VAN_PHONG" },
                    { label: "Shophouse", value: "SHOPHOUSE" },
                    { label: "Nhà phố", value: "NHA_PHO" },
                  ]}
                />
              </Form.Item>
            </Col> */}

            {/* Phần ảnh */}
            <Col span={24}>
              <Form.Item label="Ảnh (hỗ trợ nhiều ảnh)">
                <Upload
                  listType="picture-card"
                  multiple
                  fileList={uploadList}
                  beforeUpload={beforeUpload}
                  onChange={onUploadChange}
                  onRemove={onRemoveUpload}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            {/* Địa chỉ (Tỉnh - Phường - Đường) */}
            <Col span={8}>
              <Form.Item name="provinceName" label="Tỉnh/Thành phố">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="wardName" label="Phường/Xã">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="street" label="Đường">
                <Input />
              </Form.Item>
            </Col>

            {/* Thông số kỹ thuật (Diện tích - Hướng - Kết cấu) */}
            <Col span={8}>
              <Form.Item name="floorArea" label="Diện tích (m²)">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="direction" label="Hướng">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="structure" label="Loại kết cấu">
                <Input />
              </Form.Item>
            </Col>

            {/* YÊU CẦU 1: Số tầng hầm và Số tầng ở 1 dòng */}
            <Col span={12}>
              <Form.Item name="numberOfBasement" label="Số tầng hầm">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="Số tầng">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* YÊU CẦU 2: Giá và các loại phí nằm trên 2 dòng (Mỗi dòng 3 cột) */}
            {/* Dòng phí 1 */}
            <Col span={8}>
              {/* <Form.Item name="propertyType" label="Loại nhà đất">
                <Select
                  mode="multiple"
                  options={[
                    { label: "Nhà đất thuê", value: "RENT" },
                    { label: "Nhà đất bán", value: "SALE" },
                    { label: "Nhà đất cho thuê và bán", value: "BOTH" },
                  ]}
                />
              </Form.Item> */}
              {propertyType === "SALE" && (
                <Form.Item name="legal" label="Pháp lý">
                  <Select
                    mode="multiple"
                    options={[
                      { label: "Sổ hồng", value: "SO_HONG" },
                      { label: "Sổ đỏ", value: "SO_DO" },
                      { label: "Không sổ", value: "KHONG_SO" },
                    ]}
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              <Form.Item name="priceRent" label="Giá thuê (VND)">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priceSale" label="Giá bán (VND)">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="serviceFee" label="Phí dịch vụ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="deposit" label="Đặt cọc">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Dòng phí 2 */}
            <Col span={8}>
              <Form.Item name="carFee" label="Phí gửi ô tô">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="motoFee" label="Phí gửi xe máy">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="overtimeFee" label="Phí OT">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="waterFee" label="Phí nước">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="electricityFee" label="Phí điện">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* YÊU CẦU 3: Thời hạn thuê 1 dòng */}
            <Col span={24}>
              <Form.Item name="rentTime" label="Thời hạn thuê">
                <Input />
              </Form.Item>
            </Col>

            {/* YÊU CẦU 4: Chủ sở hữu và Số điện thoại 1 dòng */}
            <Col span={12}>
              <Form.Item name="managerName" label="Chủ sở hữu / Quản lý">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerPhone" label="Số điện thoại">
                <Input />
              </Form.Item>
            </Col>

            {/* Ghi chú */}
            <Col span={24}>
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default BuildingManagement;
