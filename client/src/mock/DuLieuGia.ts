import type {
  NguoiDung,
  BaiKiemTra,
  PhongThi,
  BaiNopSinhVien,
  FileHệThong,
  NhatKyHeThong,
  DemTrangThaiHeThong
} from '../types/BoThuVienTypes';

// ------------------------------------------------------------
// THÔNG TIN TRẠNG THÁI HỆ THỐNG GỐC
// ------------------------------------------------------------
export const duLieuTrangThaiHeThongGia: DemTrangThaiHeThong = {
  lanServerOnline: true,
  cloudConnected: true,
  databaseActive: true,
  storageActive: true,
  latencyLanMs: 12,
  latencyDatabaseMs: 5,
  latencyCloudMs: 45,
  storageUsedGB: 68.4,
  storageTotalGB: 100.0,
  pendingSyncCount: 12
};

// ------------------------------------------------------------
// DANH SÁCH TÀI KHOẢN MẪU
// ------------------------------------------------------------
export const danhSachNguoiDungGia: NguoiDung[] = [
  // ADMINS
  {
    id: 'usr-admin-01',
    maDinhDanh: 'ADM001',
    hoTen: 'Nguyễn Quản Trị',
    email: 'admin.uneti@uneti.edu.vn',
    soDienThoai: '0988123456',
    vaiTro: 'ADMIN',
    khoa: 'Trung tâm CNTT',
    boMonHoacNganh: 'Quản trị hệ thống',
    lopHoacChucVu: 'Trưởng phòng KT-CNTT',
    trangThai: 'HOAT_DONG',
    quyen: {
      taoBaiKiemTra: true,
      chinhSuaBaiKiemTra: true,
      taoPhongThi: true,
      giamSatThi: true,
      chamBai: true,
      xemKetQua: true,
      quanLyNguoiDung: true,
      quanLyHeThong: true
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    ngayTao: '2025-01-10'
  },
  
  // GIẢNG VIÊN
  {
    id: 'usr-gv-01',
    maDinhDanh: 'GV001',
    hoTen: 'TS. Trần Văn Nam',
    email: 'namtv@uneti.edu.vn',
    soDienThoai: '0912345678',
    vaiTro: 'GIANG_VIEN',
    khoa: 'Công nghệ thông tin',
    boMonHoacNganh: 'Công nghệ phần mềm',
    lopHoacChucVu: 'Giảng viên chính',
    trangThai: 'HOAT_DONG',
    quyen: {
      taoBaiKiemTra: true,
      chinhSuaBaiKiemTra: true,
      taoPhongThi: true,
      giamSatThi: true,
      chamBai: true,
      xemKetQua: true,
      quanLyNguoiDung: false,
      quanLyHeThong: false
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ngayTao: '2025-02-01'
  },
  {
    id: 'usr-gv-02',
    maDinhDanh: 'GV002',
    hoTen: 'ThS. Lê Thị Hoa',
    email: 'hoalt@uneti.edu.vn',
    soDienThoai: '0977889900',
    vaiTro: 'GIANG_VIEN',
    khoa: 'Công nghệ thông tin',
    boMonHoacNganh: 'Khoa học máy tính',
    lopHoacChucVu: 'Giảng viên',
    trangThai: 'HOAT_DONG',
    quyen: {
      taoBaiKiemTra: true,
      chinhSuaBaiKiemTra: true,
      taoPhongThi: true,
      giamSatThi: true,
      chamBai: true,
      xemKetQua: true,
      quanLyNguoiDung: false,
      quanLyHeThong: false
    },
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    ngayTao: '2025-02-05'
  },

  // SINH VIÊN
  {
    id: 'usr-sv-01',
    maDinhDanh: '21103100123',
    hoTen: 'Nguyễn Văn Minh',
    email: '21103100123@sv.uneti.edu.vn',
    soDienThoai: '0355112233',
    vaiTro: 'SINH_VIEN',
    khoa: 'Công nghệ thông tin',
    boMonHoacNganh: 'Công nghệ thông tin',
    lopHoacChucVu: 'DHTI15A1HN',
    khoaHoc: 'K15',
    trangThai: 'HOAT_DONG',
    quyen: {
      taoBaiKiemTra: false,
      chinhSuaBaiKiemTra: false,
      taoPhongThi: false,
      giamSatThi: false,
      chamBai: false,
      xemKetQua: true,
      quanLyNguoiDung: false,
      quanLyHeThong: false
    },
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    ngayTao: '2025-03-01'
  }
];

// ------------------------------------------------------------
// DANH SÁCH BÀI KIỂM TRA MẪU
// ------------------------------------------------------------
export const danhSachBaiKiemTraGia: BaiKiemTra[] = [
  {
    id: 'exam-01',
    tenBaiKiemTra: 'Kiểm Tra Giữa Kỳ - Cơ Sở Dữ Liệu SQL',
    monHoc: 'Cơ sở dữ liệu',
    loai: 'TRAC_NGHIEM',
    thoiLuongPhut: 45,
    tongSoCau: 40,
    tongDiem: 10,
    tronCauHoi: true,
    tronDapAn: true,
    nganHangCauHoi: 'Ngân hàng CSDL 2026',
    ngayTao: '2026-08-10',
    nguoiTao: 'TS. Trần Văn Nam',
    trangThai: 'DA_PHAT_HANH',
    danhSachCauHoi: Array.from({ length: 40 }, (_, idx) => ({
      id: `q-${idx + 1}`,
      noiDungCauHoi: `Câu ${idx + 1}: Trong hệ quản trị CSDL quan hệ SQL, câu lệnh nào được dùng để ${
        idx % 4 === 0 ? 'lấy dữ liệu từ một bảng' :
        idx % 4 === 1 ? 'cập nhật bản ghi đã tồn tại' :
        idx % 4 === 2 ? 'xóa bản ghi thỏa mãn điều kiện' :
        'tạo chỉ mục để tối ưu tốc độ truy vấn'
      }?`,
      cacDapAn: [
        'SELECT * FROM TableName WHERE Condition',
        'UPDATE TableName SET Column = Value',
        'DELETE FROM TableName WHERE Condition',
        'CREATE INDEX idx_name ON TableName(Column)'
      ],
      dapAnDung: idx % 4,
      diem: 0.25,
      giaiThich: 'Cú pháp chuẩn của SQL theo tiêu chuẩn ANSI.'
    }))
  },
  {
    id: 'exam-02',
    tenBaiKiemTra: 'Thi Kết Thúc Học Phần - Lập Trình Web React & Node.js',
    monHoc: 'Lập trình Web nâng cao',
    loai: 'TU_LUAN',
    thoiLuongPhut: 90,
    tongSoCau: 3,
    tongDiem: 10,
    tronCauHoi: false,
    tronDapAn: false,
    nganHangCauHoi: 'Đề thi tự luận CNTT K15',
    fileDeTuLuan: {
      tenFile: 'DeThiTuLuan_LapTrinhWeb_2026.pdf',
      kichThuoc: '2.4 MB',
      duongDan: '#'
    },
    dinhDangFileNop: ['.pdf', '.zip', '.docx'],
    dungLuongToiDaMB: 25,
    ngayTao: '2026-08-15',
    nguoiTao: 'ThS. Lê Thị Hoa',
    trangThai: 'SAN_SANG',
    danhSachCauHoi: []
  }
];

// ------------------------------------------------------------
// DANH SÁCH PHÒNG THI MẪU (MÃ PHÒNG THI CHUẨN ĐÃ ĐƯỢC QUY CHUẨN)
// ------------------------------------------------------------
export const danhSachPhongThiGia: PhongThi[] = [
  {
    id: 'room-101',
    maPhong: 'A102',
    tenPhong: 'Phòng Máy 102 - Tòa A (Hà Nội)',
    monHoc: 'Cơ sở dữ liệu',
    baiKiemTraId: 'exam-01',
    tenBaiKiemTra: 'Kiểm Tra Giữa Kỳ - Cơ Sở Dữ Liệu SQL',
    giangVienPhuTach: 'TS. Trần Văn Nam',
    ngayThi: '2026-08-24',
    gioBatDau: '20:00',
    gioKetThuc: '20:45',
    thoiLuongPhut: 45,
    tongSinhVien: 45,
    daVao: 43,
    dangLam: 38,
    daNop: 3,
    matKetNoi: 2,
    trangThai: 'DANG_THI',
    danhSachSinhVien: [
      {
        maSinhVien: '21103100123',
        hoTen: 'Nguyễn Văn Minh',
        lop: 'DHTI15A1HN',
        khoa: 'CNTT',
        trangThaiKetNoi: 'ONLINE',
        trangThaiLamBai: 'DANG_LAM',
        soCauDaLam: 32,
        tongSoCau: 40,
        thoiGianConLaiSeconds: 1250,
        lanMoiNhatPing: 'Vừa xong'
      }
    ]
  },
  {
    id: 'room-102',
    maPhong: 'B201',
    tenPhong: 'Phòng Máy 201 - Tòa B (Nam Định)',
    monHoc: 'Lập trình Web nâng cao',
    baiKiemTraId: 'exam-02',
    tenBaiKiemTra: 'Thi Kết Thúc Học Phần - Lập Trình Web React & Node.js',
    giangVienPhuTach: 'ThS. Lê Thị Hoa',
    ngayThi: '2026-08-25',
    gioBatDau: '08:00',
    gioKetThuc: '09:30',
    thoiLuongPhut: 90,
    tongSinhVien: 38,
    daVao: 0,
    dangLam: 0,
    daNop: 0,
    matKetNoi: 0,
    trangThai: 'CHO_BAT_DAU',
    danhSachSinhVien: []
  },
  {
    id: 'room-103',
    maPhong: 'C305',
    tenPhong: 'Phòng Máy 305 - Tòa C (Hà Nội)',
    monHoc: 'Mạng máy tính',
    baiKiemTraId: 'exam-01',
    tenBaiKiemTra: 'Kiểm Tra Thường Xuyên - Mạng Máy Tính & LAN/WiFi',
    giangVienPhuTach: 'PGS.TS. Phạm Minh Tuấn',
    ngayThi: '2026-08-23',
    gioBatDau: '14:00',
    gioKetThuc: '15:00',
    thoiLuongPhut: 60,
    tongSinhVien: 42,
    daVao: 42,
    dangLam: 0,
    daNop: 42,
    matKetNoi: 0,
    trangThai: 'DA_KET_THUC',
    danhSachSinhVien: []
  }
];

export const danhSachBaiNopGia: BaiNopSinhVien[] = [
  {
    id: 'sub-01',
    phongThiId: 'room-101',
    maPhong: 'A102',
    maSinhVien: '21103100124',
    hoTenSinhVien: 'Đỗ Thị Thu Thảo',
    lop: 'DHTI15A1HN',
    monHoc: 'Cơ sở dữ liệu',
    tenBaiKiemTra: 'Kiểm Tra Giữa Kỳ - Cơ Sở Dữ Liệu SQL',
    loaiBaiThi: 'TRAC_NGHIEM',
    ngayNop: '2026-08-24 20:25:12',
    cauTraLoiTracNghiem: { 'q-1': 0, 'q-2': 1, 'q-3': 2, 'q-4': 3 },
    diemSo: 9.25,
    nhanXetGiangVien: 'Bài làm rất xuất sắc, nắm chắc cú pháp SQL.',
    trangThaiCham: 'DA_CHAM'
  },
  {
    id: 'sub-02',
    phongThiId: 'room-101',
    maPhong: 'A102',
    maSinhVien: '21103100125',
    hoTenSinhVien: 'Lê Hoàng Anh',
    lop: 'DHTI15A1HN',
    monHoc: 'Cơ sở dữ liệu',
    tenBaiKiemTra: 'Kiểm Tra Giữa Kỳ - Cơ Sở Dữ Liệu SQL',
    loaiBaiThi: 'TRAC_NGHIEM',
    ngayNop: '2026-08-24 20:30:45',
    cauTraLoiTracNghiem: { 'q-1': 0, 'q-2': 0, 'q-3': 1 },
    diemSo: 7.75,
    nhanXetGiangVien: 'Cần chú ý hơn ở các câu lệnh JOIN và Group By.',
    trangThaiCham: 'DA_CHAM'
  },
  {
    id: 'sub-03',
    phongThiId: 'room-102',
    maPhong: 'B201',
    maSinhVien: '21103100199',
    hoTenSinhVien: 'Phạm Thị Mai',
    lop: 'DHTI15A2ND',
    monHoc: 'Lập trình Web nâng cao',
    tenBaiKiemTra: 'Thi Kết Thúc Học Phần - Lập Trình Web React & Node.js',
    loaiBaiThi: 'TU_LUAN',
    ngayNop: '2026-08-24 20:40:10',
    fileTuLuanNop: {
      tenFile: 'BaiLamTuLuan_21103100199_PhamThiMai.zip',
      kichThuoc: '18.4 MB',
      duongDan: '#'
    },
    trangThaiCham: 'CHUA_CHAM'
  },
  {
    id: 'sub-04',
    phongThiId: 'room-103',
    maPhong: 'C305',
    maSinhVien: '21103100201',
    hoTenSinhVien: 'Trần Đức Thắng',
    lop: 'DHTI15A3HN',
    monHoc: 'Mạng máy tính',
    tenBaiKiemTra: 'Kiểm Tra Thường Xuyên - Mạng Máy Tính & LAN/WiFi',
    loaiBaiThi: 'TRAC_NGHIEM',
    ngayNop: '2026-08-23 14:55:00',
    diemSo: 8.5,
    nhanXetGiangVien: 'Hiểu rõ mô hình OSI và giao thức TCP/IP.',
    trangThaiCham: 'DA_CHAM'
  }
];

export const danhSachFileGia: FileHệThong[] = [
  {
    id: 'f-1',
    tenFile: 'DanhSachSinhVien_KhoaCNTT_K15.xlsx',
    loaiFile: 'Excel Spreadsheet',
    kichThuoc: '1.8 MB',
    nguoiTao: 'Admin',
    ngayTao: '2026-08-01'
  }
];

export const danhSachNhatKyGia: NhatKyHeThong[] = [
  {
    id: 'log-1',
    thoiGian: '20:20',
    nguoiThucHien: 'GV001 (Trần Văn Nam)',
    hànhDong: 'Mở phòng thi A102',
    chiTiet: 'Bắt đầu kỳ thi Kiểm tra giữa kỳ CSDL cho 45 sinh viên.',
    loai: 'INFO'
  }
];
