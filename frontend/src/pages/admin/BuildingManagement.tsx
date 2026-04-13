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
// import type { ResponseDTO } from "../../types/response.type";

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

  const [staffOptions, setStaffOptions] = useState<
    { label: string; value: number }[]
  >([]);
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
    setCurrentBuilding(building);
    setAssignVisible(true);
    setSelectedStaff(null);
    setStaffOptions([]);
    try {
      const ass = await buildingApi.getBuildingStaffs(building.id as number);
      if (ass && Array.isArray(ass.data)) {
        const opts = ass.data.map(
          (it: { staffId: number; fullName: string }) => ({
            label: it.fullName || String(it.staffId),
            value: Number(it.staffId),
          }),
        );

        const selected = ass.data
          .filter((it: { checked: boolean }) => it.checked)
          .map((it: { staffId: number }) => Number(it.staffId));
        setSelectedStaff(selected?.[0] ?? null);
        setStaffOptions(opts);
      }
      console.log(ass);
    } catch (err) {
      console.error("Error preparing assign modal", err);
      message.error("Không thể tải danh sách nhân viên");
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
        const res = await buildingApi.getBuilding(String(building.id));
        const data = res?.data as BuildingDTO | undefined;
        setEditingBuilding(data ?? building);
        // set form fields
        formEdit.setFieldsValue({ ...(data ?? building) });

        // populate upload list from existing image URLs
        const urls = data?.imageUrls ?? [];
        const files: UploadFile[] = urls.map((u, idx) => ({
          uid: `existing-${idx}`,
          name: u.split("/").pop() || `image-${idx}`,
          status: "done",
          url: u,
        }));
        setUploadList(files);
        setEditVisible(true);
      } catch (err) {
        console.error("Failed load building detail", err);
        message.error("Không thể tải chi tiết tòa nhà");
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
      // Build payload and FormData for multipart upload
      const payload: BuildingDTO = {
        ...editingBuilding,
        ...values,
      };
      // existing image URLs (from files without originFileObj)
      // const existingUrls: string[] = uploadList
      //   .filter((f) => !f.originFileObj && f.url)
      //   .map((f) => String(f.url));
      // payload.imageUrls = existingUrls;

      // // if there are no newly added files, send JSON to backend (some servers don't accept multipart)
      // const hasNewFiles = uploadList.some(
      //   (f) => f.originFileObj instanceof File,
      // );

      // console.debug(
      //   "Saving building payload:",
      //   payload,
      //   "hasNewFiles=",
      //   hasNewFiles,
      // );
      if (uploadList.length > 0) {
        const fileObj = uploadList[0].originFileObj;
        if (fileObj instanceof File) {
          // Nếu là ảnh mới upload từ local -> Chuyển sang Base64
          const base64Image = await getBase64(fileObj);
          payload.image = base64Image; 
        } else {
          // Nếu là ảnh cũ đã có sẵn URL (user không đổi ảnh)
          payload.image = uploadList[0].url;
        }
      } else {
        payload.image = undefined; // User đã xóa ảnh
      }

      let res;
      // if (hasNewFiles) {
      //   const formData = new FormData();
      //   formData.append("data", JSON.stringify(payload));
      //   uploadList.forEach((f) => {
      //     if (f.originFileObj instanceof File)
      //       formData.append("files", f.originFileObj);
      //   });
      //   if (editingBuilding && editingBuilding.id) {
      //     res = await buildingApi.updateBuildingForm(
      //       String(editingBuilding.id),
      //       formData,
      //     );
      //   } else {
      //     res = await buildingApi.createBuildingForm(formData);
      //   }
      // } else {
      //   // send JSON body (create/update uses POST /api/building with BuildingDTO)
      //   if (editingBuilding && editingBuilding.id) {
      //     res = await buildingApi.updateBuilding(
      //       String(editingBuilding.id),
      //       payload,
      //     );
      //   } else {
      //     res = await buildingApi.createBuilding(payload);
      //   }
      // }
      if (payload.id) {
        // Dùng hàm updateBuilding cũ của bạn
        res = await buildingApi.updateBuilding(String(payload.id), payload);
      } else {
        // Dùng hàm createBuilding cũ của bạn
        res = await buildingApi.createBuilding(payload);
      }

      if (res) {
        message.success('Lưu tòa nhà thành công');
        closeEdit();
        fetchBuildings(1, keyword);
      }

      if (res) {
        message.success("Lưu tòa nhà thành công");
        closeEdit();
        fetchBuildings(1, keyword);
      }
    } catch (err) {
      console.error("Save building error", err);
      const msg =
        (err as any)?.response?.data?.message || "Lưu tòa nhà thất bại";
      message.error(msg);
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
      const result = reader.result as string;
      const base64String = result.split(',')[1]; 
      resolve(base64String);
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
          const msg = (err as any)?.data?.message || "Xóa tòa nhà thất bại";
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
      dataIndex: "type",
      key: "typeCode",
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
        title={`Gán nhân viên cho: ${currentBuilding?.name || ""}`}
        open={assignVisible}
        onCancel={closeAssign}
        onOk={handleAssign}
        confirmLoading={assigning}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Chọn nhân viên">
            <Radio.Group
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(Number(e.target.value))}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {staffOptions.map((opt) => (
                <Radio key={opt.value} value={opt.value}>
                  {opt.label} (ID: {opt.value})
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
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
                  ]}
                />
              </Form.Item>
            </Col>

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

            <Col span={8}>
              <Form.Item name="floorArea" label="Diện tích (m²)">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numberOfBasement" label="Số tầng hầm">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="level" label="Số tầng">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

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

            <Col span={8}>
              <Form.Item name="carFee" label="Phí gửi ô tô">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="motorbikeFee" label="Phí gửi xe máy">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="overtimeFee" label="Phí OT">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="rentTime" label="Thời hạn thuê">
                <Input />
              </Form.Item>
            </Col>

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
