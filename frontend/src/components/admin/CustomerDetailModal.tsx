import { useState, useEffect } from "react";
import { getStaffs } from "../../api/staffApi";
import { assignStaffToCustomer } from "../../api/assignmentApi";
import type { UserDemandDTO } from "../../types/user.type";
import type { Staff } from "../../types";
import "./AssignmentModals.css";

interface CustomerDetailModalProps {
  customer: UserDemandDTO;
  assignedStaffs?: Staff[];
  onClose: () => void;
  onAssignmentChange?: () => void;
}

export function CustomerDetailModal({
  customer,
  assignedStaffs = [],
  onClose,
  onAssignmentChange,
}: CustomerDetailModalProps) {
  const [allStaffs, setAllStaffs] = useState<Staff[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<number[]>(
    assignedStaffs?.map((s) => s.id) || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    try {
      const staffsData = await getStaffs();
      setAllStaffs(staffsData);
    } catch (err) {
      console.error("Error loading staffs:", err);
    }
  };

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaffs((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId],
    );
  };

  const handleAssign = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Payload for assignment:", {
        customerId: customer.customerId,
        demandId: customer.demand?.id,
        staffIds: selectedStaffs,
      });
      await assignStaffToCustomer({
        customerId: customer.customerId,
        demandId: customer.demand?.id,
        staffIds: selectedStaffs
      });
      onAssignmentChange?.();
      onClose();
    } catch (err) {
      console.error("Error assigning staff:", err);
      setError("Không thể phân công nhân viên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content customer-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{customer.fullName}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Thông tin khách hàng</h3>
            <div className="detail-row">
              <span className="label">ID:</span>
              <span className="value">#{customer.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Điện thoại:</span>
              <span className="value">{customer.phone}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{customer.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Trạng thái:</span>
              <span className="value">{customer.status || "Mới"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Nhu cầu</h3>
            <div className="detail-row">
              <span className="label">Giá tiền:</span>
              <span className="value">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(customer.demand?.price || 0)}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Diện tích:</span>
              <span className="value">{customer.demand?.area} m²</span>
            </div>
            <div className="detail-row">
              <span className="label">Vị trí:</span>
              <span className="value">{customer.demand?.ward}, {customer.demand?.province}</span>
            </div>
            <div className="detail-row">
              <span className="label">Loại:</span>
              <span className="value">
                {customer.demand?.propertyType || "-"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Phân công nhân viên</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="staff-selection">
              {allStaffs.map((staff) => (
                <label key={staff.id} className="staff-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStaffs.includes(Number(staff.id))}
                    onChange={() => handleStaffSelect(Number(staff.id))}
                  />
                  <span className="checkbox-label">
                    {staff.fullName} ({staff.role})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAssign}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu phân công"}
          </button>
        </div>
      </div>
    </div>
  );
}
