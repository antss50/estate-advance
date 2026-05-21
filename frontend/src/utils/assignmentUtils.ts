/**
 * Assignment Management Utilities
 */

export const statusMap = {
  'NEW': { label: 'Mới', class: 'status-new' },
  'CONSULTING': { label: 'Tư vấn', class: 'status-consulting' },
  'ASSIGNED': { label: 'Đã phân công', class: 'status-assigned' },
  'SIGNED': { label: 'Đã ký', class: 'status-signed' },
  'PAID': { label: 'Đã thanh toán', class: 'status-paid' }
};

export function getStatusLabel(status?: string): string {
  if (!status) return 'Mới';
  const key = status.toUpperCase() as keyof typeof statusMap;
  return statusMap[key]?.label || 'Mới';
}

export function getStatusClass(status?: string): string {
  if (!status) return 'status-new';
  const key = status.toUpperCase() as keyof typeof statusMap;
  return statusMap[key]?.class || 'status-new';
}

export function formatPrice(price?: number): string {
  if (!price && price !== 0) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
}

export function formatArea(area?: number): string {
  if (!area && area !== 0) return '-';
  return `${area} m²`;
}

export function formatPhone(phone?: string): string {
  if (!phone) return '-';
  // Format Vietnamese phone number: 0123456789 -> 0123 456 789
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  return phone;
}

export function generateInitials(fullName?: string): string {
  if (!fullName) return '?';
  return fullName
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getPlaceholderColor(index: number): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[index % colors.length];
}

export interface StaffStats {
  totalAssignments: number;
  activeAssignments: number;
  assignedBuildings: number;
  assignedCustomers: number;
}

export function calculateStaffStats(assignments: any[]): StaffStats {
  return {
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter((a) => a.status === 'ACTIVE').length,
    assignedBuildings: assignments.filter((a) => a.type === 'BUILDING').length,
    assignedCustomers: assignments.filter((a) => a.type === 'CUSTOMER').length
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
