import { useState, useEffect } from "react";
import { getStaffs } from "../../api/staffApi";
import { assignStaffToBuilding } from "../../api/assignmentApi";
import type { BuildingDTO } from "../../types/building.type";
import type { Staff } from "../../types";
import "./AssignmentModals.css";

interface BuildingDetailModalProps {
  building: BuildingDTO;
  assignedStaffs?: Staff[];
  onClose: () => void;
  onAssignmentChange?: () => void;
}

export function BuildingDetailModal({
  building,
  assignedStaffs = [],
  onClose,
  onAssignmentChange,
}: BuildingDetailModalProps) {
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
      if (!building.id) return;
      await assignStaffToBuilding(building.id, selectedStaffs);
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
        className="modal-content building-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{building.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Thông tin toà nhà</h3>
            <div className="detail-row">
              <span className="label">ID:</span>
              <span className="value">#{building.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">
                {building.address || `${building.ward}, ${building.district}`}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Quận:</span>
              <span className="value">{building.district}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phường:</span>
              <span className="value">{building.ward}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Chi tiết</h3>
            <div className="detail-row">
              <span className="label">Giá cho thuê:</span>
              <span className="value">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(building.rentPrice || 0)}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Diện tích sàn:</span>
              <span className="value">{building.floorArea} m²</span>
            </div>
            <div className="detail-row">
              <span className="label">Loại:</span>
              <span className="value">{building.type || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Hướng:</span>
              <span className="value">{building.direction || "-"}</span>
            </div>
            {building.managerName && (
              <div className="detail-row">
                <span className="label">Quản lý:</span>
                <span className="value">{building.managerName}</span>
              </div>
            )}
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
