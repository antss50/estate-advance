import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
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
  Space,
} from "antd";
import {
  SearchOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined as IconComponent,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import userApi from "../../api/userApi";
import staffApi from "../../api/staffApi";
import type { UserDTO } from "../../types/user.type";
// import type { PaginatedResult } from "../../types/response.type";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PAGE_SIZE = 12;

// Toggle to use mock data while real endpoints are not available.
// Set to false to use real APIs later.

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
  const openEdit = (user: UserDTO) => {
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

  interface UserFormValues {
    userName?: string;
    fullName: string;
    email?: string;
    phone?: string;
    roleCode: "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | string;
    password?: string;
    status?: number;
  }

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
      const axiosErr = err as any;
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
          background: 'rgb(245 247 250)', 
          padding: '0 16px', 
        }}
      >
        <TabPane tab="Customer" key="customer" />
        <TabPane tab="Staff" key="staff" />
      </Tabs>

      <div style={{ marginTop: 16 }}>
        <Spin spinning={loading} tip="Đang tải...">
          <Row gutter={[16, 16]}>
            {" "}
            {/* gap between cards: 16px */}
            {users.map((u) => (
              <Col key={u.id} xs={24} sm={12} md={8} lg={8} xl={8}
                >
                <Card
                  hoverable
                  style={{
                    borderRadius: 10,
                    background: "#E3EDFF",
                    border: "none",
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Row align="middle" gutter={16} style={{ gap: 16 }}>
                    <Col flex="56px">
                      <Avatar
                        size={56}
                        src={u.avatarUrl}
                        icon={!u.avatarUrl ? <IconComponent /> : undefined}
                        style={{
                          border: "2px solid #000000",
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    </Col>

                    <Col flex="auto">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            color: "#000000",
                            fontSize: 24,
                            fontWeight: 700,
                            lineHeight: "28px",
                            textTransform: "uppercase",
                          }}
                        >
                          {u.fullName}
                        </Title>

                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: "22px",
                            color: "#000000",
                          }}
                        >
                          #{u.userName} &nbsp;{" "}
                          <Text style={{ color: "#000000" }}>ID:{u.id}</Text>
                        </Text>

                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <PhoneOutlined style={{ color: "#000000" }} />
                          <Text
                            style={{
                              marginLeft: 8,
                              fontSize: 14,
                              lineHeight: "22px",
                              color: "#000000",
                            }}
                          >
                            {u.phone || "---"}
                          </Text>
                        </div>
                        {activeTab === "staff" && (
                          <div
                            style={{ marginTop: 12, display: "flex", gap: 8 }}
                          >
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => openEdit(u)}
                            />
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDelete(u.id)}
                              loading={deletingId === u.id}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={onPageChange}
            />
          </div>
        </Spin>
      </div>

      <Modal
        title={editingUserId ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng"}
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
              rules={editingUserId ? undefined : [{ required: true }]
              }
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
    </div>
  );
};

export default UserManagement;
