import React from "react";
import "../../styles/FAQSection.css";

const faqs = [
  {
    question: "Cọc bao nhiêu khi thuê?",
    answer: "Thông thường 1 - 2 tháng tiền thuê, có biên nhận và ghi rõ trong hợp đồng.",
  },
  {
    question: "Có dẫn xem nhà miễn phí không?",
    answer: "Có. Bạn liên hệ Zalo, chúng tôi đặt lịch và dẫn xem hoàn toàn miễn phí.",
  },
  {
    question: "Phí dịch vụ với khách thuê là bao nhiêu?",
    answer: "Miễn phí 100% với khách thuê. Phí hoa hồng chỉ tính với chủ nhà khi giao dịch thành công.",
  },
  {
    question: "Có cho thuê ngắn hạn không?",
    answer: "Đa số chủ nhà yêu cầu thuê tối thiểu 6 tháng. Có thể thương lượng tùy căn.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Câu hỏi thường gặp</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <article className="faq-item" key={faq.question}>
              <div>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
              <span aria-hidden="true" className="faq-mark">
                ×
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;