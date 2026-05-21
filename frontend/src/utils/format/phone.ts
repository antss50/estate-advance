export const formatPhoneNumber = (phone: string | null | undefined) => {
  if (!phone) return "---";
  
  const cleaned = phone.replace(/\D/g, "");
  
  // Định dạng theo nhóm: 4 số đầu - 3 số giữa - các số còn lại
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{1,4})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  
  return phone; 
};