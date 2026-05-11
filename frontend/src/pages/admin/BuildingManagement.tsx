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
  Radio,
  message,
  Typography,
  Spin,
  InputNumber,
  Select,
  Upload,
  Tag,
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
} from "../../types/building.type";
import formatImageSrc from "../../utils/format/images";
import type { MatchedStaffDTO } from "../../types/user.type";
import type { ResponseDTO } from "../../types/response.type";

const { Title } = Typography;

const PAGE_SIZE = 12;

// Toggle to use mock data while real endpoints are not available.
// Set to false to use real APIs.

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

  const [staffOptions, setStaffOptions] = useState<MatchedStaffDTO[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);

  const [form] = Form.useForm();
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

  const onSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const openAssign = async (building: BuildingDTO) => {
  if (!building.id) return;
  
  setCurrentBuilding(building);
  setAssignVisible(true);
  setSelectedStaff(null);
  setStaffOptions([]);
  setAssigning(true); // Dùng loading state của modal để chờ fetch dữ liệu

  try {
    // Gọi API matching nhân viên mới
    const response = await buildingApi.matchingStaffs(Number(building.id));
    const matchedData = Array.isArray(response) ? response : (response as ResponseDTO<MatchedStaffDTO[]>)?.data;

    if (Array.isArray(matchedData)) {
      // Sắp xếp nhân viên theo điểm totalScore giảm dần
      const sortedStaff = [...matchedData].sort(
        (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
      );
      setStaffOptions(sortedStaff);

      // Nếu cần hiển thị nhân viên đã gán trước đó (optional tùy logic backend)
      // Hiện tại API matching trả về danh sách gợi ý, admin sẽ chọn mới
    }
  } catch (err) {
    console.error("Error matching staffs", err);
    message.error("Không thể tải danh sách nhân viên phù hợp");
    
    // Xử lý hiển thị lỗi 500 nếu buildingId không tồn tại
    if ((err as any).response?.status === 500) {
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
        const response = await buildingApi.getBuilding(String(building.id));

        // 2. Extract data từ ResponseDTO wrapper
        const buildingData = response?.data;

        // 3. Kiểm tra buildingDetail có tồn tại trước khi xử lý typeCode
        if (buildingData && typeof buildingData === "object") {
          setEditingBuilding(buildingData);

          // Mở Modal ngay sau khi xác nhận có data
          setEditVisible(true);

          // 4. Xử lý typeCode cực kỳ an toàn
          let finalTypeCode: string[] = [];
          const rawTypeCode = buildingData.typeCode;

          if (Array.isArray(rawTypeCode)) {
            finalTypeCode = rawTypeCode;
          } else if (
            typeof rawTypeCode === "string" &&
            rawTypeCode.trim() !== ""
          ) {
            finalTypeCode = rawTypeCode.split(",").map((s: string) => s.trim());
          }

          // 5. Chuẩn hóa dữ liệu Form
          const formattedData = {
            ...buildingData,
            typeCode: finalTypeCode,
          };

          formEdit.setFieldsValue(formattedData);

          // 6. Xử lý ảnh an toàn
          if (buildingData.image && typeof buildingData.image === "string") {
            const urls = buildingData.image
              .split(",")
              .filter((u: string) => u.trim() !== "");
            const files = urls.map((u: string, idx: number) => ({
              uid: `existing-${idx}-${Date.now()}`,
              name: `image-${idx}.png`,
              status: "done",
              url: formatImageSrc(u),
            }));
            setUploadList(files);
          } else {
            setUploadList([]);
          }
        } else {
          message.error("Dữ liệu tòa nhà trả về không hợp lệ");
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
      // 1. Clone payload và chuẩn hóa typeCode từ Array sang String
      const payload: BuildingDTO = {
        ...editingBuilding,
        ...values,
        // Convert mảng typeCode thành chuỗi "TANG_TRET,VAN_PHONG"
        typeCode: Array.isArray(values.typeCode)
          ? values.typeCode.join(",")
          : values.typeCode,
      };

      // 2. Xử lý ảnh nếu có thay đổi
      if (uploadList.length > 0) {
        const validFiles = uploadList.filter((f) => f.status === "done");

        const imagePromises = validFiles.map(async (file) => {
          // Nếu là file mới upload (originFileObj)
          if (file.originFileObj instanceof File) {
            return await getBase64(file.originFileObj);
          }
          // Nếu là ảnh cũ đã có URL/Base64
          if (file.url) {
            if (file.url.startsWith("data:image")) {
              return file.url.split(",")[1]; // Chỉ lấy phần base64 thô
            }
            // Nếu là URL từ server (ví dụ: /repository/building_1.jpg)
            // Bạn nên giữ nguyên hoặc xử lý theo logic backend yêu cầu
            return file.url.replace(window.location.origin, "");
          }
          return "";
        });

        const images = (await Promise.all(imagePromises)).filter(
          (img) => img !== "",
        );

        // Gộp thành chuỗi LONGTEXT để lưu vào DB
        payload.image = images.join(",");
        payload.avatar = images[0] || "";
      } else {
        payload.image = "";
        payload.avatar = "";
      }

      // 3. Gửi request đến API
      let res;
      if (payload.id) {
        // Đảm bảo truyền đúng ID và object payload
        res = await buildingApi.updateBuilding(String(payload.id), payload);
      } else {
        res = await buildingApi.createBuilding(payload);
      }

      if (res) {
        message.success("Lưu tòa nhà thành công");
        closeEdit();
        fetchBuildings(page, keyword); // Refresh lại đúng trang hiện tại
      }
    } catch (err) {
      console.error("Save building error", err);
      // Hiển thị lỗi chi tiết từ backend nếu có
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

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const result = reader.result as string;
          // Tách base64 thô từ data URL
          const parts = result.split(",");
          const base64String =
            parts.length > 1 ? parts[parts.length - 1] : result;

          if (!base64String) {
            reject(new Error("Không thể chuyển ảnh sang Base64"));
            return;
          }

          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleAssign = async () => {
    if (!currentBuilding) return;
    setAssigning(true);
    try {
      const payload: AssignmentBuildingDTO = {
        buildingId: Number(currentBuilding.id),
        staffIds: selectedStaff ? [selectedStaff] : [],
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
      dataIndex: "rentPrice",
      key: "rentPrice",
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
            Quản lý tòa nhà
          </Title>
        </Col>

        <Col>
          <Space>
            <Input
              placeholder="Tìm kiếm tòa nhà theo tên"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 420 }}
            />
            <Button type="primary" onClick={() => fetchBuildings(1, keyword)}>
              Tìm
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
      <TeamOutlined /> Đề xuất nhân viên phù hợp cho: <strong>{currentBuilding?.name}</strong>
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
      <Form.Item label="Danh sách nhân viên (Sắp xếp theo độ phù hợp)">
        <Radio.Group
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(Number(e.target.value))}
          style={{ width: "100%" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {staffOptions.length > 0 ? (
              staffOptions.map((staff) => (
                <Radio 
                  key={staff.staffId} 
                  value={staff.staffId}
                  style={{ 
                    padding: '12px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: '8px',
                    width: '100%',
                    margin: 0
                  }}
                >
                  <div style={{ display: 'inline-flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', position: 'relative' }}>
                    <div>
                      <strong style={{ fontSize: '15px' }}>{staff.staffName}</strong>
                      <div style={{ fontSize: '12px', color: '#363636' }}>
                        Khu vực làm việc: <strong>{staff.workingArea}</strong> | Giao dịch thành công: <strong>{staff.totalDeals}</strong> | Số khách phụ trách: <strong>{staff.currentWorkload}</strong>
                      </div>
                    </div>
                    {/* Hiển thị điểm số Matching */}
                    <div style={{ textAlign: 'right' }}>
                      <Tag color={staff.totalScore! > 0.8 ? "green" : "orange"}>
                        {Math.round(staff.totalScore! * 100)}% Match
                      </Tag>
                    </div>
                  </div>
                </Radio>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy nhân viên phù hợp</div>
            )}
          </div>
        </Radio.Group>
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
        visible={editVisible}
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
            </Col>

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

            {/* Địa chỉ (Quận - Phường - Đường) */}
            <Col span={8}>
              <Form.Item name="district" label="Quận">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ward" label="Phường">
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
              <Form.Item name="rentPrice" label="Giá thuê (VND)">
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
