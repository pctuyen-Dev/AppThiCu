// ============================================================
// ĐỊNH NGHĨA TYPE HỆ THỐNG THI CỬ UNETI EXAM (VIETNAMESE NAMING)
// ============================================================

export type VaiTroNguoiDung = 'ADMIN' | 'GIANG_VIEN' | 'SINH_VIEN';

export type TrangThaiTaiKhoan = 'HOAT_DONG' | 'BI_KHOA' | 'CHUA_KICH_HOAT';

export interface QuyenTruyCapNguoiDung {
  taoBaiKiemTra: boolean;
  chinhSuaBaiKiemTra: boolean;
  taoPhongThi: boolean;
  giamSatThi: boolean;
  chamBai: boolean;
  xemKetQua: boolean;
  quanLyNguoiDung: boolean;
  quanLyHeThong: boolean;
}

export interface NguoiDung {
  id: string;
  maDinhDanh: string; // MSV hoặc Mã GV
  hoTen: string;
  email: string;
  soDienThoai?: string;
  vaiTro: VaiTroNguoiDung;
  khoa: string;
  boMonHoacNganh: string;
  lopHoacChucVu?: string;
  khoaHoc?: string; // Ví dụ K16, K17
  trangThai: TrangThaiTaiKhoan;
  quyen: QuyenTruyCapNguoiDung;
  avatarUrl?: string;
  ngayTao: string;
}

export type LoaiBaiKiemTra = 'TRAC_NGHIEM' | 'TU_LUAN' | 'KET_HOP';

export interface CauHoiTracNghiem {
  id: string;
  noiDungCauHoi: string;
  cacDapAn: string[]; // [A, B, C, D]
  dapAnDung: number; // Index 0-3
  diem: number;
  giaiThich?: string;
}

export interface BaiKiemTra {
  id: string;
  tenBaiKiemTra: string;
  monHoc: string;
  loai: LoaiBaiKiemTra;
  thoiLuongPhut: number;
  tongSoCau: number;
  tongDiem: number;
  tronCauHoi: boolean;
  tronDapAn: boolean;
  nganHangCauHoi: string;
  danhSachCauHoi: CauHoiTracNghiem[];
  fileDeTuLuan?: {
    tenFile: string;
    kichThuoc: string;
    duongDan: string;
  };
  dinhDangFileNop?: string[];
  dungLuongToiDaMB?: number;
  ngayTao: string;
  nguoiTao: string;
  trangThai: 'NHAP' | 'SAN_SANG' | 'DA_PHAT_HANH';
}

export type TrangThaiPhongThi = 'CHO_BAT_DAU' | 'DANG_THI' | 'TAM_DUNG' | 'KHOA' | 'DA_KET_THUC';

export type TrangThaiKetNoi = 'ONLINE' | 'OFFLINE' | 'DISCONNECTED';

export type TrangThaiLamBaiSinhVien = 'CHUA_VAO' | 'DANG_LAM' | 'DA_NOP' | 'MAT_KET_NOI';
export type TrangThaiDuyetSinhVien = 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI';

export interface SinhVienPhongThi {
  maSinhVien: string;
  hoTen: string;
  lop: string;
  khoa: string;
  trangThaiKetNoi: TrangThaiKetNoi;
  trangThaiLamBai: TrangThaiLamBaiSinhVien;
  trangThaiDuyet?: TrangThaiDuyetSinhVien;
  soCauDaLam: number;
  tongSoCau: number;
  thoiGianConLaiSeconds: number;
  lanMoiNhatPing: string;
}

export interface PhongThi {
  id: string;
  maPhong: string;
  tenPhong: string;
  monHoc: string;
  baiKiemTraId: string;
  tenBaiKiemTra: string;
  giangVienPhuTach: string;
  ngayThi: string;
  gioBatDau: string;
  gioKetThuc: string;
  thoiLuongPhut: number;
  tongSinhVien: number;
  daVao: number;
  dangLam: number;
  daNop: number;
  matKetNoi: number;
  trangThai: TrangThaiPhongThi;
  danhSachSinhVien: SinhVienPhongThi[];
  soLuongDe?: number; // 1 đề hoặc 2 đề
  baiKiemTraPhuId?: string; // nếu chọn 2 đề
  tenBaiKiemTraPhu?: string;
  tronCauHoi?: boolean;
  tronDapAn?: boolean;
  choXemDiem?: boolean;
  phamViThi?: 'LAN' | 'INTERNET';
  cheDoDuyet?: 'TU_DONG' | 'THU_CONG';
  danhSachMsvDuocPhep?: string[];
}

export interface LoiViPhamChiTiet {
  id: string;
  thoiGian: string;
  noiDung: string;
  loai?: 'CHUYEN_TAB' | 'MAT_KHUON_MAT' | 'NHIEU_NGUOI' | 'ROI_MAN_HINH' | 'KHAC';
}

export interface BaiNopSinhVien {
  id: string;
  phongThiId: string;
  maPhong: string;
  maSinhVien: string;
  hoTenSinhVien: string;
  lop: string;
  monHoc: string;
  tenBaiKiemTra: string;
  loaiBaiThi: LoaiBaiKiemTra;
  ngayNop: string;
  cauTraLoiTracNghiem?: Record<string, number>; // questionId -> answerIndex
  fileTuLuanNop?: {
    tenFile: string;
    kichThuoc: string;
    duongDan: string;
  };
  diemSo?: number;
  nhanXetGiangVien?: string;
  trangThaiCham: 'CHUA_CHAM' | 'DANG_CHAM' | 'DA_CHAM';
  tinhTrangNop?: {
    loai: 'DUNG_GIO' | 'SOM' | 'MUON';
    moTa: string;
    soPhut?: number;
    thoiGianChiTiet?: string;
  };
  soLanViPham?: number;
  chiTietViPham?: string;
  nhatKyViPhamChiTiet?: LoiViPhamChiTiet[];
}

export interface FileHệThong {
  id: string;
  tenFile: string;
  loaiFile: string;
  kichThuoc: string;
  nguoiTao: string;
  ngayTao: string;
}

export interface NhatKyHeThong {
  id: string;
  thoiGian: string;
  nguoiThucHien: string;
  hànhDong: string;
  chiTiet: string;
  loai: 'INFO' | 'WARNING' | 'ERROR';
}

export interface DemTrangThaiHeThong {
  lanServerOnline: boolean;
  cloudConnected: boolean;
  databaseActive: boolean;
  storageActive: boolean;
  latencyLanMs: number;
  latencyDatabaseMs: number;
  latencyCloudMs: number;
  storageUsedGB: number;
  storageTotalGB: number;
  pendingSyncCount: number;
}
