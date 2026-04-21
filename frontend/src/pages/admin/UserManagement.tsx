import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Tabs,
  Pagination,
  Modal,
  Form,
  Select,
  Spin,
  message,
  Row,
  Col,
  Space,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import userApi from "../../api/userApi";
import staffApi from "../../api/staffApi";
import StaffGrid from "../../components/admin/StaffGrid";
import StaffDetailModal from "../../components/admin/StaffDetailModal";
import type { UserDTO } from "../../types/user.type";
import type { Staff } from "../../types";
// import type { PaginatedResult } from "../../types/response.type";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PAGE_SIZE = 12;

interface UserFormValues {
  userName?: string;
  fullName: string;
  email?: string;
  phone?: string;
  roleCode: "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | string;
  password?: string;
  status?: number;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"customer" | "staff">("customer");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const selectedStaff = users.find((u) => u.id === selectedStaffId) as Staff | undefined;

  const [form] = Form.useForm();

  const fetchUsers = async (p: number, kw: string, role?: string) => {
    setLoading(true);
    try {
      const params = { page: p, size: PAGE_SIZE, keyword: kw, role };
      const res = await (activeTab === "staff"
        ? staffApi.getStaffs()
        : userApi.getAllUsers());
      if (Array.isArray(res)) {
        setUsers(res);
        setTotal((res as UserDTO[]).length || 0);
        console.log("Fetched users:", res);
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = activeTab === "staff" ? "STAFF || MANAGER" : "CUSTOMER";
    setPage(1);
    fetchUsers(1, keyword, role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const role = activeTab === "staff" ? "STAFF || MANAGER" : "CUSTOMER";
    const t = setTimeout(() => fetchUsers(1, keyword, role), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const onPageChange = (page: number) => {
    setPage(page);
    const role = activeTab === "staff" ? "STAFF || MANAGER" : "CUSTOMER";
    fetchUsers(page, keyword, role);
  };

  const openCreate = () => {
    setEditingUserId(null);
    form.resetFields();
    setModalVisible(true);
  };
  const openEdit = (user: UserDTO | Staff) => {
    setEditingUserId(user.id);
    form.setFieldsValue({
      fullName: user.fullName,
      userName: user.userName,
      role: user.role || "STAFF",
      status: user.status === "ACTIVE" ? 1 : 0,
      email: user.email,
      phone: user.phone,
    });
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const openStaffDetail = (user: UserDTO | Staff) => {
    setSelectedStaffId(user.id);
    setDetailModalVisible(true);
  };
  const closeDetail = () => {
    setDetailModalVisible(false);
    setSelectedStaffId(null);
  };

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    try {
      if (editingUserId) {
        // update payload: fullName, status, roleDTOs
        const payload = {
          fullName: (values.fullName || "").trim(),
          status: Number(values.status ?? 1),
          roleCode: values.roleCode,
        };
        await userApi.updateUser(editingUserId, payload);
        message.success("Cập nhật nhân viên thành công");
      } else {
        const userName = (values.userName || "").trim();
        const password = (values.password || "").trim();
        const fullName = (values.fullName || "").trim();
        const email = (values.email || "").trim();
        const phone = (values.phone || "").trim();
        const roleCode = (values.roleCode || "").trim();
        if (!userName) throw new Error("Tên đăng nhập không được để trống");
        if (!password) throw new Error("Mật khẩu không được để trống");
        if (!fullName) throw new Error("Họ và tên không được để trống");
        if (!roleCode) throw new Error("Vui lòng chọn chức vụ");

        const payload = {
          userName,
          password,
          fullName,
          email,
          phone,
          status: Number(values.status ?? 1),
          roleCode: values.roleCode,
        };
        console.log("Creating user with payload:", payload);
        await userApi.createUser(payload);
        message.success("Tạo nhân viên thành công");
      }
      closeModal();
      fetchUsers(1, keyword, "STAFF");
    } catch (err) {
      console.error("Submit user error", err);
      const axiosErr = err as Error & {
        response?: { data?: { message?: string; error?: string } };
      };
      const serverMsg =
        axiosErr?.response?.data?.message || axiosErr?.response?.data?.error;
      message.error(serverMsg || axiosErr?.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa nhân viên này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setDeletingId(id);
        const targetId = users.find((u) => u.id === id)?.id || id;
        console.log("Deleting user with id:", targetId);
        try {
          await userApi.deleteUser([targetId]);
          message.success("Xóa nhân viên thành công");
          fetchUsers(1, keyword, "STAFF");
        } catch (err) {
          console.error("Delete user error", err);
          message.error("Xóa thất bại");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý Người dùng
          </Title>
          <Text type="secondary">Welcome to Estate Advance</Text>
        </Col>

        <Col>
          <Space>
            <Input
              placeholder="Tìm kiếm khách hàng (Tên)"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 520, borderRadius: 30 }}
            />
            <Button type="primary" shape="circle">
              <SearchOutlined />
            </Button>
            {activeTab === "staff" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                shape="round"
                onClick={openCreate}
              >
                Thêm mới
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as "customer" | "staff")}
        tabBarStyle={{
          background: "rgb(245 247 250)",
          padding: "0 16px",
        }}
      >
        <TabPane tab="Customer" key="customer" />
        <TabPane tab="Staff" key="staff" />
      </Tabs>

      <div style={{ marginTop: 16 }}>
        <Spin spinning={loading} tip="Đang tải...">
          {activeTab === "staff" ? (
            <>
              <StaffGrid
                staffList={users as Staff[]}
                type="staff"
                onEdit={openEdit}
                onViewDetail={openStaffDetail}
                onDelete={handleDelete}
                onCardClick={openStaffDetail}
                deletingId={deletingId}
              />
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Pagination
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={onPageChange}
                />
              </div>
            </>
          ) : (
            <>
              <StaffGrid
                staffList={users as UserDTO[]}
                type="customer"
                // onEdit={openEdit}
                onDelete={handleDelete}
                // onCardClick={openStaffDetail}
                deletingId={deletingId}
              />
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Pagination
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={onPageChange}
                />
              </div>
            </>
          )}
        </Spin>
      </div>

      {/* <Modal
        title={
          editingUserId ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}/>
      </Modal> */}

      

      <Modal
        title={
          editingUserId ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={editingUserId ? undefined : [{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userName"
            label="User Name"
            rules={editingUserId ? undefined : [{ required: true }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="roleCode" label="Role" initialValue={"STAFF"}>
            <Select>
              <Select.Option value="STAFF">Staff</Select.Option>
              <Select.Option value="MANAGER">Manager</Select.Option>
            </Select>
          </Form.Item>
          {!editingUserId && (
            <Form.Item
              name="password"
              label="Password"
              rules={
                !editingUserId
                  ? [{ required: true, message: "Vui lòng nhập mật khẩu" }]
                  : undefined
              }
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              {editingUserId ? "Cập nhật" : "Tạo"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Staff Detail Modal */}
      {activeTab === "staff" && (
          <StaffDetailModal
          visible={detailModalVisible}
          staffId={selectedStaffId}
          staffData={selectedStaff}
          onClose={closeDetail}
        />
      )}
    </div>
  );
};

export default UserManagement;
