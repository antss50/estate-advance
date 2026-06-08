import React from 'react';
import { Carousel, Typography } from 'antd';

const { Title, Text } = Typography;

// --- DỮ LIỆU CÁC SLIDE HÌNH ẢNH ---
const heroSlides = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
    slogan: 'Giải Pháp Không Gian Làm Việc Hoàn Hảo',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
    slogan: 'Nâng Tầm Vị Thế Doanh Nghiệp Của Bạn',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&q=80&w=2000',
    slogan: 'Kết Nối Nhu Cầu - Kiến Tạo Tương Lai',
  }
];

const HeroCarousel: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Thuộc tính effect="fade" giúp chuyển slide mượt mà hơn kiểu trượt ngang (scroll) mặc định.
        autoplay chuyển ảnh tự động.
      */}
      <Carousel autoplay effect="fade" autoplaySpeed={4000} dotPosition="bottom">
        {heroSlides.map((slide) => (
          <div key={slide.id}>
            <div style={{ position: 'relative', height: '600px', width: '100%', overflow: 'hidden' }}>
              
              {/* LỚP 1: BACKGROUND BỊ LÀM MỜ VÀ TỐI ĐI */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  // Làm mờ 4px và giảm độ sáng xuống 60% để chữ trắng nổi bật
                  filter: 'blur(4px) brightness(0.6)', 
                  // Scale to hơn 1 chút để che đi phần viền bị mờ nhòe của thuộc tính blur
                  transform: 'scale(1.05)',
                  zIndex: 1,
                }}
              />

              {/* LỚP 2: NỘI DUNG CHỮ (SẮC NÉT, NẰM ĐÈ LÊN TRÊN) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2, // Phải lớn hơn zIndex của background
                  textAlign: 'center',
                  padding: '0 20px',
                }}
              >
                <Title 
                  style={{ 
                    color: '#ffffff', 
                    fontSize: '64px', // Chữ to nổi bật
                    fontWeight: 900, 
                    margin: 0, 
                    letterSpacing: '4px', // Chữ giãn cách tạo cảm giác sang trọng
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)' // Đổ bóng nhẹ cho chữ
                  }}
                >
                  ESTATE ADVANCE
                </Title>
                
                <Text 
                  style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '24px', 
                    marginTop: '20px', 
                    fontWeight: 300,
                    letterSpacing: '1px'
                  }}
                >
                  {slide.slogan}
                </Text>
              </div>

            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;