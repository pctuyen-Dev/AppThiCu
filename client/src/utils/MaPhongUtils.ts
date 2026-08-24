// ============================================================
// HÀM TIỆN ÍCH XỬ LÝ VÀ KIỂM TRA MÃ PHÒNG THI (UNETI EXAM)
// ============================================================

/**
 * Chuẩn hóa mã phòng thi:
 * - Loại bỏ tất cả khoảng trắng (spaces)
 * - Loại bỏ các ký tự đặc biệt (chỉ giữ lại chữ cái a-z, A-Z và chữ số 0-9)
 * - Chuyển thành chữ in hoa (Upper Case) không phân biệt hoa thường
 */
export const chuanHoaMaPhong = (maInput: string): string => {
  if (!maInput) return '';
  return maInput
    .replace(/\s+/g, '') // Xóa toàn bộ dấu cách
    .replace(/[^a-zA-Z0-9]/g, '') // Chỉ giữ lại chữ và số
    .toUpperCase(); // Chuyển thành chữ hoa
};

/**
 * Kiểm tra mã phòng thi có hợp lệ theo tiêu chuẩn hệ thống không:
 * - Tối thiểu 4 ký tự
 * - Liền nhau, không dấu cách
 * - Không chứa ký tự đặc biệt
 */
export const kiemTraMaPhongHopLe = (maInput: string): { hopLe: boolean; loi?: string } => {
  if (!maInput || maInput.trim().length === 0) {
    return { hopLe: false, loi: 'Vui lòng nhập mã phòng thi.' };
  }

  const maChuẩn = chuanHoaMaPhong(maInput);

  if (maChuẩn.length < 4) {
    return { hopLe: false, loi: 'Mã phòng thi phải có tối thiểu 4 ký tự liền nhau.' };
  }

  // Kiểm tra nếu chuỗi gốc có dấu cách hoặc ký tự đặc biệt
  if (/\s/.test(maInput)) {
    return { hopLe: false, loi: 'Mã phòng thi không được chứa khoảng trắng.' };
  }

  if (/[^a-zA-Z0-9]/.test(maInput)) {
    return { hopLe: false, loi: 'Mã phòng thi không được chứa ký tự đặc biệt.' };
  }

  return { hopLe: true };
};

/**
 * Tự động sinh mã phòng thi hợp lệ (Ví dụ: UNET8492, ROOM1024, A1029)
 */
export const taoMaPhongTuDong = (): string => {
  const tienTo = ['UNETI', 'ROOM', 'EXAM', 'PHONG'][Math.floor(Math.random() * 4)];
  const soNgauNhien = Math.floor(1000 + Math.random() * 9000);
  return `${tienTo}${soNgauNhien}`;
};
