import React from 'react';
import { Card, Typography, Tag, Space, Row, Col } from 'antd';
import { EnvironmentOutlined, AreaChartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface MatchedBuildingItemProps {
  building: {
    buildingId: number;
    buildingName: string;
    address: string;
    priceRent?: number;
    priceSale?: number;
    floorArea: number;
    totalScore: number;
    image?: string;
    // Điểm số chi tiết từ server
    priceMatchScore?: number;
    locationMatchScore?: number;
    buildingType?: string;
    transactionType?: string;
  };
}

const MatchedBuildingItem: React.FC<MatchedBuildingItemProps> = ({ building }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      hoverable
      bodyStyle={{ padding: '12px' }}
      style={{
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        width: '23.5vw',
        height: '125px',
        transition: 'all 0.3s'
      }}
    >
      <Row gutter={12} align="middle">
        {/* Ảnh tòa nhà */}
        <Col span={6}>
          <div style={{
            width: '100%',
            height: '80px',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            backgroundImage: `url(${building.image || 'https://via.placeholder.com/150'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </Col>

        {/* Thông tin chi tiết */}
        <Col span={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ margin: 0, fontSize: '14px', maxWidth: '75%' }} ellipsis = {{rows: 1}}>
              {building.buildingName}
            </Title>
            <Tag color={building.totalScore > 0.8 ? "green" : "orange"} style={{ margin: 0 }}>
              {Math.round(building.totalScore * 100)}% Match
            </Tag>
          </div>

          <div style={{ marginTop: '2px', height: '18px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }} ellipsis>
              <EnvironmentOutlined /> {building.address}
            </Text>
          </div>

          <Row style={{ marginTop: '6px' }}>
            <Col span={16}>
              <Space size={4}>
                
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Text  style={{ color: '#000000', fontSize: '13px' }}>Giá bán: <strong style={{color: '#d62121'}}>{building.priceSale ? formatPrice(building.priceSale) : "Không bán"}</strong></Text>
                      <Text  style={{ color: '#000000', fontSize: '13px' }}>Giá cho thuê: <strong style={{color: '#d62121'}}>{building.priceRent ? formatPrice(building.priceRent) + "/tháng" : "Không cho thuê"}</strong></Text>
                    </div>
                        
                   
              </Space>
            </Col>
            <Col span={8} style={{textAlign: "right"}}>
              <Space size={4}>
                <AreaChartOutlined style={{ color: '#1677ff' }} />
                <Text strong style={{ fontSize: '13px' }}>{building.floorArea} m²</Text>
              </Space>
            </Col>
          </Row>
                
          {/* Hiển thị các tiêu chí match tốt */}
          {/* <div style={{ marginTop: '6px' }}>
             {building.locationMatchScore && building.locationMatchScore > 0.9 && (
               <Tag color="cyan" style={{ fontSize: '10px', lineHeight: '16px' }}>Vị trí rất khớp</Tag>
             )}
             {building.priceMatchScore && building.priceMatchScore > 0.9 && (
               <Tag color="blue" style={{ fontSize: '10px', lineHeight: '16px' }}>Giá tối ưu</Tag>
             )}
          </div> */}
        </Col>
      </Row>
    </Card>
  );
};

export default MatchedBuildingItem;