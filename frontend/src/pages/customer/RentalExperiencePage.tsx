import React, { useState } from "react";
import { Button, Layout, Modal } from "antd";
import { CloseOutlined, ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import AppHeader from "../../components/customer/Header";
import "../../styles/RentalExperiencePage.css";
import Footer from "../../components/customer/Footer";

type ExperienceKey = "legal" | "furniture" | "payment";

interface ExperienceItem {
  key: ExperienceKey;
  tag: string;
  title: string;
  summary: string;
  readTime: string;
  detail: React.ReactNode;
}

const experienceItems: ExperienceItem[] = [
  {
    key: "legal",
    tag: "Pháp lý",
    title: "Lưu ý quan trọng khi ký hợp đồng thuê căn hộ",
    summary: "Các điều khoản dễ bị bỏ qua: tiền cọc, thời hạn báo trước, sửa chữa, tăng giá.",
    readTime: "6 phút đọc",
    detail: (
      <>
        <p>Hợp đồng thuê căn hộ thường dao động 6 - 12 tháng. Bạn cần lưu ý:</p>
        <ul>
          <li>Tiền cọc tiêu chuẩn là 1 - 2 tháng, đặt cọc giữ chỗ thường 5 - 10 triệu.</li>
          <li>Thời hạn báo trước khi trả nhà: 30 ngày, ghi rõ trong hợp đồng.</li>
          <li>Điều khoản tăng giá khi gia hạn - nên cố định giá trong suốt thời hạn.</li>
          <li>Bên nào chịu chi phí sửa chữa nhỏ vs. hư hỏng do hao mòn tự nhiên.</li>
          <li>Quy định về thú cưng, sửa chữa, khoan đục.</li>
          <li>Quy trình hoàn cọc khi kết thúc hợp đồng - cần biên bản bàn giao.</li>
        </ul>
        <p>Luôn yêu cầu hợp đồng có chữ ký của chính chủ và bản photo CCCD chủ nhà.</p>
      </>
    ),
  },
  {
    key: "furniture",
    tag: "Nội thất",
    title: "Nên thuê căn nội thất cơ bản hay đầy đủ?",
    summary: "Đầy đủ tiện hơn nhưng đắt hơn 1 - 2 triệu/tháng. Cách chọn phù hợp với bạn.",
    readTime: "4 phút đọc",
    detail: (
      <>
        <ul>
          <li>Nội thất cơ bản: chỉ có rèm, máy lạnh, đèn, bếp - bạn tự mua sofa, giường, tủ.</li>
          <li>Nội thất đầy đủ: sẵn sàng dọn vào, bao gồm cả thiết bị bếp, máy giặt.</li>
        </ul>
        <p>Nếu thuê ngắn hạn (dưới 1 năm), chọn đầy đủ. Nếu thuê dài (2 năm+) và đã có đồ riêng, chọn cơ bản để tiết kiệm.</p>
      </>
    ),
  },
  {
    key: "payment",
    tag: "Thanh toán",
    title: "Hình thức thanh toán và đặt cọc phổ biến",
    summary: "Thanh toán theo tháng, quý, hay năm? Mỗi cách có ưu nhược điểm.",
    readTime: "4 phút đọc",
    detail: (
      <>
        <ul>
          <li>Thanh toán theo tháng: linh hoạt, ít rủi ro nếu chuyển nhà sớm.</li>
          <li>Theo quý: được giảm nhẹ 200 - 500k/tháng.</li>
          <li>Theo năm: thường được giảm 5 - 10%, nhưng cần ngân sách lớn.</li>
        </ul>
        <p>Cọc tiêu chuẩn: 2 tháng tiền thuê. Yêu cầu biên nhận có chữ ký để bảo vệ quyền lợi.</p>
      </>
    ),
  },
];

const RentalExperiencePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Layout className="rental-experience-page">
      <AppHeader
        isLoggedIn={!!localStorage.getItem("accessToken")}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="rental-experience-main">
        <section className="rental-experience-hero">
          <h1>Kinh nghiệm thuê nhà</h1>
          <p>Tổng hợp những điều cần biết trước khi thuê - từ checklist xem nhà, hợp đồng, đến chi phí thực tế.</p>
        </section>

        <section className="experience-card-grid" aria-label="Kinh nghiệm thuê nhà">
          {experienceItems.map((item) => (
            <button
              type="button"
              key={item.key}
              className="experience-card"
              onClick={() => setSelectedItem(item)}
            >
              <span className="experience-tag">{item.tag}</span>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <span className="experience-read-time">
                <ClockCircleOutlined />
                {item.readTime}
              </span>
            </button>
          ))}
        </section>
      </main>

      <div className="rental-floating-actions">
        <Button type="primary" shape="circle" icon={<MessageOutlined />} />
      </div>

      <Modal
        open={!!selectedItem}
        footer={null}
        centered
        width={980}
        closeIcon={<CloseOutlined />}
        onCancel={() => setSelectedItem(null)}
        className="experience-detail-modal"
        rootClassName="experience-detail-modal-root"
      >
        {selectedItem && (
          <article>
            <span className="detail-tag">{selectedItem.tag}</span>
            <h2>{selectedItem.title}</h2>
            <span className="detail-read-time">{selectedItem.readTime}</span>
            <div className="detail-content">{selectedItem.detail}</div>
          </article>
        )}
      </Modal>

      <Footer/>
    </Layout>
  );
};

export default RentalExperiencePage;
