import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Button,
  Modal,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import client from "../../api/axiosClient";
import formatImageSrc from "../../utils/format/images";
import type { BuildingDTO } from "../../types/building.type";

const { Title, Paragraph, Text } = Typography;

const PAGE_BG = "#ffffff";
const DIVIDER = "#f0f0f0";
const TEXT_PRIMARY = "#262626";
const TEXT_MUTED = "#8c8c8c";

const formatCurrency = (value?: number | string) => {
  if (value === undefined || value === null || value === "") return "-";
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) return "-";
  return `${amount.toLocaleString("vi-VN")} VND`;
};

const SpecsCard: React.FC<{ building: BuildingDTO }> = ({ building }) => {
  const rows: Array<[string, React.ReactNode]> = [
    [
      "Mức giá",
      building.rentPriceDescription ||
        (building.rentPrice ? `${formatCurrency(building.rentPrice)}` : "-"),
    ],
    ["Diện tích sàn", building.floorArea ? `${building.floorArea} m²` : "-"],
    ["Số tầng hầm", building.numberOfBasement ?? "-"],
    ["Hướng", building.direction ?? "-"],
    ["Loại công trình", building.structure ?? "-"],
    [
      "Khu vực",
      `${building.district ?? ""} ${building.ward ?? ""}`.trim() || "-",
    ],
    ["Địa chỉ", building.street ?? "-"],
  ];

  return (
    <Card
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      bodyStyle={{ padding: 20 }}
    >
      <Title level={5} style={{ marginTop: 0 }}>
        Đặc điểm bất động sản
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([k, v], idx) => (
          <div key={k}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: idx % 2 === 0 ? TEXT_MUTED : TEXT_PRIMARY,
              }}
            >
              <Text style={{ color: TEXT_MUTED }}>{k}</Text>
              <Text style={{ color: TEXT_PRIMARY, fontWeight: 600 }}>{v}</Text>
            </div>
            {idx < rows.length - 1 && (
              <Divider style={{ margin: "12px 0", borderColor: DIVIDER }} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
const BuildingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [building, setBuilding] = useState<BuildingDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setNotFound(null);
      try {
        const res = await client.get(`/api/building/${id}`);
        if (!mounted) return;
        setBuilding(res.data as BuildingDTO);
      } catch (err) {
        if (!mounted) return;
        if (err?.status === 404) {
          setNotFound("Không tìm thấy toà nhà");
        } else {
          setNotFound("Lỗi khi tải dữ liệu");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const getImages = (): string[] => {
    if (!building?.image) return [];
    return building.image
      .split(",")
      .map((u: string) => u.trim())
      .filter((u: string) => u !== "");
  };

  const prev = () => {
    const imgs = getImages();
    if (imgs.length === 0) return;
    setImgIndex((s) => (s - 1 + imgs.length) % imgs.length);
  };

  const next = () => {
    const imgs = getImages();
    if (imgs.length === 0) return;
    setImgIndex((s) => (s + 1) % imgs.length);
  };

  if (loading) {
    return (
      <div style={{ padding: 24, background: PAGE_BG }}>
        <Text>Đang tải...</Text>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ padding: 24, background: PAGE_BG }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} />
        <Title level={4} style={{ marginTop: 12 }}>
          {notFound}
        </Title>
      </div>
    );
  }

  if (!building) {
    return null;
  }

  const images = getImages();

  return (
    <div style={{ background: PAGE_BG, padding: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ padding: 0 }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title level={4} style={{ margin: 0 }}>
            BUILDINGS MANAGEMENT
          </Title>
          <Text style={{ color: TEXT_MUTED }}>Welcome to Estate Advance</Text>
        </div>
      </div>

      <Row gutter={32}>
        <Col xs={24} md={16}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                height: 400,
                overflow: "hidden",
                borderRadius: 12,
                position: "relative",
                background: "#f2f2f2",
              }}
            >
              {Array.isArray(images) && images.length > 0 ? (
                <img
                  src={formatImageSrc((images as string[])[imgIndex])}
                  alt={building.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: TEXT_MUTED,
                  }}
                >
                  Không có ảnh
                </div>
              )}

              <Button
                shape="circle"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.8)",
                  border: "none",
                }}
                icon={<LeftOutlined />}
                onClick={prev}
              />

              <Button
                shape="circle"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.8)",
                  border: "none",
                }}
                icon={<RightOutlined />}
                onClick={next}
              />
            </div>
            {/* thumbnails */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {(images as string[]).map((u, i) => (
                <div key={u} style={{ position: "relative" }}>
                  <img
                    src={formatImageSrc(u)}
                    alt={`thumb-${i}`}
                    style={{
                      width: 80,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => setImgIndex(i)}
                  />
                  <Button
                    size="small"
                    danger
                    style={{ position: "absolute", top: -6, right: -6 }}
                    onClick={async () => {
                      Modal.confirm({
                        title: "Xóa ảnh",
                        content: "Bạn có chắc muốn xóa ảnh này?",
                        okText: "Xóa",
                        okType: "danger",
                        cancelText: "Hủy",
                        onOk: async () => {
                          try {
                            const remaining = (images as string[]).filter(
                              (x) => x !== u,
                            );
                            const payload: BuildingDTO = {
                              ...(building as BuildingDTO),
                              imageUrls: remaining,
                            };
                            await client.put(`/api/building/${id}`, payload);
                            // reload
                            const r = await client.get(`/api/building/${id}`);
                            setBuilding(r.data as BuildingDTO);
                            message.success("Xóa ảnh thành công");
                            setImgIndex(0);
                          } catch (err) {
                            console.error("Delete image failed", err);
                            message.error("Xóa ảnh thất bại");
                          }
                        },
                      });
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>{building.name}</Title>
              <Paragraph style={{ color: TEXT_MUTED }}>
                {building.note}
              </Paragraph>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <Text style={{ color: TEXT_MUTED }}>
                  Mã loại: {building.typeCode?.join(", ")}
                </Text>
                {/* <Text style={{ color: TEXT_MUTED }}>
                  Diện cho thuê: {building.rentArea ?? "-"}
                </Text> */}
              </div>
            </div>
          </div>

          <Card style={{ marginTop: 24, borderRadius: 12 }}>
            <Title level={5}>Thông tin thuê & Phí</Title>
            <Row gutter={12}>
              <Col span={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Giá thuê</Text>
                  <Text style={{ color: TEXT_PRIMARY, fontWeight: 700 }}>
                    {building.rentPriceDescription ||
                      formatCurrency(building.rentPrice)}
                  </Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Phí dịch vụ</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {formatCurrency(building.serviceFee)}
                  </Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Đặt cọc</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {formatCurrency(building.deposit)}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Phí gửi ô tô</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {formatCurrency(building.carFee)}
                  </Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Phí gửi xe máy</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {formatCurrency(building.motoFee)}
                  </Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Phí OT</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {formatCurrency(building.overtimeFee)}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <div style={{ position: "sticky", top: 24 }}>
            <SpecsCard building={building} />

            <Card style={{ marginTop: 16, borderRadius: 12 }}>
              <Title level={5} style={{ marginBottom: 12 }}>
                Liên hệ quản lý
              </Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Người quản lý</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {building.managerName ?? "-"}
                  </Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>SĐT</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {building.managerPhone ?? "-"}
                  </Text>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                {/* <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>
                    Hình thức thanh toán
                  </Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {building.payment ?? "-"}
                  </Text>
                </div> */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: TEXT_MUTED }}>Thời hạn thuê</Text>
                  <Text style={{ color: TEXT_PRIMARY }}>
                    {building.rentTime ?? "-"}
                  </Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* <Text style={{ color: TEXT_MUTED }}>
                    Thời gian hoàn thiện
                  </Text> */}
                  {/* <Text style={{ color: TEXT_PRIMARY }}>
                    {building.decorationTime ?? "-"}
                  </Text> */}
                </div>
              </div>
            </Card>

            <Card style={{ marginTop: 16, borderRadius: 12 }}>
              <Title level={5}>Tài nguyên</Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {building.linkOfBuilding && (
                  <a
                    href={building.linkOfBuilding}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem chi tiết
                  </a>
                )}
                {building.map && (
                  <a href={building.map} target="_blank" rel="noreferrer">
                    Xem bản đồ
                  </a>
                )}
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                  <div>Ngày tạo: {building.createdDate ?? "-"}</div>
                  <div>Người tạo: {building.createdBy ?? "-"}</div>
                  <div>Ngày sửa: {building.modifiedDate ?? "-"}</div>
                  <div>Người sửa: {building.modifiedBy ?? "-"}</div>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BuildingDetail;
