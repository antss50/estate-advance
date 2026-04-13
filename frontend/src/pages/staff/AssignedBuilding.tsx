import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Select,
  Divider,
  Slider,
  Button,
  Row,
  Col,
  Pagination,
  Spin,
} from "antd";

import type { BuildingCard as BuildingCardType } from "./mockBuildings";
import { fetchBuildings } from "./mockBuildings";
import BuildingCard from "../../components/staff/BuildingCard";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const PRIMARY = "#27A5FF";
const MUTED = "#8B8787";

const PAGE_SIZE = 6;

const AssignedBuilding: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [buildings, setBuildings] = useState<BuildingCardType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    0, 10000000000,
  ]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBuildings(page, PAGE_SIZE);
        if (!mounted) return;
        setBuildings(res.items);
        setTotal(res.total);
      } catch (err) {
        console.error("Failed to fetch buildings", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  const onPageChange = (p: number) => setPage(p);

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Content style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>
            Toà nhà của tôi
          </Title>
          <Text style={{ color: MUTED }}>Welcome to Estate Advance</Text>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "12px 8px",
            background: "transparent",
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ minWidth: 420, flex: "0 0 420px" }}>
            <Search
              placeholder="Tìm kiếm toà nhà..."
              enterButton
              allowClear
              style={{
                borderRadius: 24,
                height: 33,
                boxShadow: "none",
              }}
            />
          </div>

          <Divider type="vertical" style={{ height: 40 }} />

          {/* Select blocks */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ color: MUTED, fontSize: 12 }}>
                Chọn loại nhà đất
              </Text>
              <Select
                defaultValue="Chung cư"
                bordered={false}
                style={{ fontWeight: 700, width: 160 }}
                options={[
                  { value: "Chung cư", label: "Chung cư" },
                  { value: "Nhà riêng", label: "Nhà riêng" },
                ]}
              />
            </div>

            <Divider type="vertical" style={{ height: 40 }} />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ color: MUTED, fontSize: 12 }}>Khu vực</Text>
              <Select
                defaultValue="Hồ Chí Minh"
                bordered={false}
                style={{ fontWeight: 700, width: 160 }}
                options={[
                  { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
                  { value: "Hà Nội", label: "Hà Nội" },
                ]}
              />
            </div>

            <Divider type="vertical" style={{ height: 40 }} />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ color: MUTED, fontSize: 12 }}>Diện tích</Text>
              <Select
                defaultValue="50 - 70 m2"
                bordered={false}
                style={{ fontWeight: 700, width: 140 }}
                options={[
                  { value: "50-70", label: "50 - 70 m2" },
                  { value: "70-100", label: "70 - 100 m2" },
                ]}
              />
            </div>
          </div>

          <Divider type="vertical" style={{ height: 40 }} />

          {/* Price slider */}
          <div
            style={{ display: "flex", flexDirection: "column", minWidth: 260 }}
          >
            <Text style={{ color: MUTED, fontSize: 12 }}>Khoảng giá</Text>
            <div style={{ padding: "8px 0", width: 260 }}>
              <Slider
                range
                min={0}
                max={10000000000}
                value={sliderValue}
                onChange={(v) => setSliderValue(v as [number, number])}
                trackStyle={[{ backgroundColor: PRIMARY }]}
                handleStyle={[
                  { borderColor: PRIMARY },
                  { borderColor: PRIMARY },
                ]}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: MUTED,
                }}
              >
                <Text style={{ color: MUTED }}>0 đ</Text>
                <Text style={{ color: MUTED }}>10 000 000 000 đ</Text>
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <Button
              type="primary"
              shape="round"
              style={{
                background: PRIMARY,
                borderColor: PRIMARY,
                borderRadius: 24,
              }}
            >
              Đặt lại
            </Button>
          </div>
        </div>

        {/* Grid */}
        <Spin spinning={loading} tip="Đang tải...">
          <Row gutter={[24, 24]}>
            {buildings.map((b) => (
              <Col
                key={b.id}
                xs={24}
                sm={12}
                md={8}
                style={{ display: "flex" }}
              >
                <Link to={`/staff/buildings/${b.id}`} style={{ width: "100%" }}>
                  <BuildingCard building={b} />
                </Link>
              </Col>
            ))}
          </Row>
        </Spin>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={onPageChange}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AssignedBuilding;
