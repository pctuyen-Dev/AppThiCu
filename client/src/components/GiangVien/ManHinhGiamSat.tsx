import React, { useState, useEffect } from 'react';
import {
  User,
  Edit3,
  Upload,
  WifiOff,
  AlertTriangle,
  Sliders,
  Search,
  RotateCcw,
  X,
  Power,
  Mail,
  Pause,
  Clock,
  Save,
  Volume2,
  BarChart2,
  Play,
  ArrowRight,
  ShieldAlert,
  Send,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Rocket
} from 'lucide-react';
import type { PhongThi, TrangThaiPhongThi } from '../../types/BoThuVienTypes';

export interface HocSinhGiamSat {
  stt: number;
  msv: string;
  hoTen: string;
  trangThai: 'DANG_LAM' | 'DA_NOP' | 'MAT_KET_NOI';
  trangThaiDuyet: 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI';
  soViPham: number;
  thoiGianNop: string; // '--' hoặc '16:05:13'
  thoiGianCong: string; // '--' hoặc '+5p', '+10p'
  lanMoiNhatPing?: string;
  lop?: string;
  thoiGianVaoPhong?: string;
}

export interface NhatKyViPham {
  id: string;
  thoiGian: string;
  msv: string;
  hoTen: string;
  hanhVi: string;
  loaiHanhVi: 'CHUYEN_TAB' | 'COPY_PASTE' | 'DEV_TOOLS' | 'MAT_KET_NOI';
  mucDo: 'CANH_BAO' | 'NGHIEM_TRONG';
}

export interface ThongBaoHeThongItem {
  id: string;
  thoiGian: string;
  noiDung: string;
  loai: 'SUCCESS' | 'WARNING' | 'DANGER';
}

interface ManHinhGiamSatProps {
  phongThi: PhongThi;
  danhSachPhongThi?: PhongThi[];
  onChonPhongThi?: (phongId: string) => void;
  onChuyenToiPhongCho?: (phongId: string) => void;
  onKetThucPhong: () => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
  onQuayLai?: () => void;
}

// Dữ liệu mẫu khởi tạo chuẩn theo đúng ảnh chụp và mở rộng chức năng duyệt
const danhSachHocSinhMacDinh: HocSinhGiamSat[] = [
  {
    stt: 1,
    msv: '20210001',
    hoTen: 'Nguyễn Thị A',
    trangThai: 'DANG_LAM',
    trangThaiDuyet: 'DA_DUYET',
    soViPham: 0,
    thoiGianNop: '--',
    thoiGianCong: '+5p',
    lanMoiNhatPing: '1 giây trước',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '16:00:12'
  },
  {
    stt: 2,
    msv: '20210002',
    hoTen: 'Võ Thành B',
    trangThai: 'DANG_LAM',
    trangThaiDuyet: 'CHO_DUYET',
    soViPham: 1,
    thoiGianNop: '--',
    thoiGianCong: '--',
    lanMoiNhatPing: '3 giây trước',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '16:01:45'
  },
  {
    stt: 3,
    msv: '20210003',
    hoTen: 'Lê Phương C',
    trangThai: 'DANG_LAM',
    trangThaiDuyet: 'CHO_DUYET',
    soViPham: 0,
    thoiGianNop: '--',
    thoiGianCong: '--',
    lanMoiNhatPing: 'Vừa xong',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '16:02:10'
  },
  {
    stt: 4,
    msv: '20210004',
    hoTen: 'Hoàng Tuấn D',
    trangThai: 'DA_NOP',
    trangThaiDuyet: 'DA_DUYET',
    soViPham: 0,
    thoiGianNop: '16:05:13',
    thoiGianCong: '--',
    lanMoiNhatPing: 'Đã nộp bài',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '15:58:30'
  },
  {
    stt: 5,
    msv: '20210005',
    hoTen: 'Phạm Ngọc E',
    trangThai: 'MAT_KET_NOI',
    trangThaiDuyet: 'TU_CHOI',
    soViPham: 0,
    thoiGianNop: '--',
    thoiGianCong: '--',
    lanMoiNhatPing: '32 giây trước',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '16:03:00'
  },
  {
    stt: 6,
    msv: '20210006',
    hoTen: 'Đỗ Kim F',
    trangThai: 'DANG_LAM',
    trangThaiDuyet: 'DA_DUYET',
    soViPham: 2,
    thoiGianNop: '--',
    thoiGianCong: '+10p',
    lanMoiNhatPing: '2 giây trước',
    lop: 'DHTI15A1HN',
    thoiGianVaoPhong: '16:00:50'
  }
];

const danhSachThongBaoMacDinh: ThongBaoHeThongItem[] = [
  { id: 'tb-1', thoiGian: '10:15', noiDung: 'Nguyễn Văn A đã nộp bài', loai: 'SUCCESS' },
  { id: 'tb-2', thoiGian: '10:14', noiDung: 'Phát hiện 2 vi phạm mới', loai: 'WARNING' },
  { id: 'tb-3', thoiGian: '10:12', noiDung: 'Trần Thị B mất kết nối', loai: 'DANGER' }
];

const initialNhatKyViPham: NhatKyViPham[] = [
  {
    id: 'log-1',
    thoiGian: '10:14:02',
    msv: '20210002',
    hoTen: 'Võ Thành B',
    hanhVi: 'Chuyển tab trình duyệt rời khỏi màn hình bài thi 12 giây',
    loaiHanhVi: 'CHUYEN_TAB',
    mucDo: 'CANH_BAO'
  },
  {
    id: 'log-2',
    thoiGian: '10:13:45',
    msv: '20210006',
    hoTen: 'Đỗ Kim F',
    hanhVi: 'Thực hiện thao tác Copy / Paste trên bài thi',
    loaiHanhVi: 'COPY_PASTE',
    mucDo: 'CANH_BAO'
  },
  {
    id: 'log-3',
    thoiGian: '10:14:10',
    msv: '20210006',
    hoTen: 'Đỗ Kim F',
    hanhVi: 'Chuyển tab lần 2 rời khỏi giao diện kiểm tra',
    loaiHanhVi: 'CHUYEN_TAB',
    mucDo: 'NGHIEM_TRONG'
  }
];

export const ManHinhGiamSat: React.FC<ManHinhGiamSatProps> = ({
  phongThi,
  danhSachPhongThi = [],
  onChonPhongThi,
  onChuyenToiPhongCho,
  onKetThucPhong,
  onHienThiToast
}) => {
  // State Trạng thái phòng & Học sinh
  const [trangThaiPhong, setTrangThaiPhong] = useState<TrangThaiPhongThi>(phongThi.trangThai || 'DANG_THI');
  
  const [danhSachHocSinh, setDanhSachHocSinh] = useState<HocSinhGiamSat[]>(danhSachHocSinhMacDinh);
  const [danhSachThongBao, setDanhSachThongBao] = useState<ThongBaoHeThongItem[]>(danhSachThongBaoMacDinh);
  const [danhSachViPham] = useState<NhatKyViPham[]>(initialNhatKyViPham);

  // State bộ lọc & tìm kiếm
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [locTrangThai, setLocTrangThai] = useState<'TAT_CA' | 'DANG_LAM' | 'DA_NOP' | 'MAT_KET_NOI'>('TAT_CA');
  const [locDuyet, setLocDuyet] = useState<'TAT_CA' | 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI'>('TAT_CA');
  
  const [isThuGon, setIsThuGon] = useState<boolean>(false);
  // ------------------------------------------------------------------
  // STATE & EFFECT: HẸN GIỜ TỰ ĐỘNG BẮT ĐẦU CA THI
  // ------------------------------------------------------------------
  const [thoiGianAutoStart, setThoiGianAutoStart] = useState<number | null>(null);
  const [demNguocGiay, setDemNguocGiay] = useState<number | null>(null);
  const [hienThiModalHenGio, setHienThiModalHenGio] = useState<boolean>(false);
  const [gioBatDauInput, setGioBatDauInput] = useState<string>('');

  useEffect(() => {
    if (!thoiGianAutoStart) {
      setDemNguocGiay(null);
      return;
    }

    const capNhatDemNguoc = () => {
      const remaining = Math.max(0, Math.floor((thoiGianAutoStart - Date.now()) / 1000));
      setDemNguocGiay(remaining);

      if (remaining <= 0) {
        setThoiGianAutoStart(null);
        setDemNguocGiay(null);
        xuLyBatDauCaThi();
        onHienThiToast(
          '⏰ Tự động bắt đầu ca thi',
          `Đã đến giờ hẹn. Ca thi phòng ${phongThi.maPhong} chính thức bắt đầu!`,
          'success'
        );
      }
    };

    capNhatDemNguoc();
    const intervalId = setInterval(capNhatDemNguoc, 1000);
    return () => clearInterval(intervalId);
  }, [thoiGianAutoStart, phongThi.id, phongThi.maPhong, onHienThiToast]);

  const xuLyHenGioSauPhut = (phut: number) => {
    const target = Date.now() + phut * 60 * 1000;
    setThoiGianAutoStart(target);
    const timeStr = new Date(target).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    onHienThiToast('Đã hẹn giờ', `Hệ thống sẽ tự động bắt đầu thi sau ${phut} phút (lúc ${timeStr}).`, 'info');
    setHienThiModalHenGio(false);
  };

  const xuLyHenGioTheoGio = () => {
    if (!gioBatDauInput) {
      onHienThiToast('Cảnh báo', 'Vui lòng chọn hoặc nhập giờ bắt đầu!', 'error');
      return;
    }
    const [hours, minutes] = gioBatDauInput.split(':').map(Number);
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0).getTime();

    if (target <= Date.now()) {
      onHienThiToast('Cảnh báo', 'Giờ hẹn phải lớn hơn thời gian hiện tại!', 'error');
      return;
    }

    setThoiGianAutoStart(target);
    onHienThiToast('Đã hẹn giờ', `Hệ thống sẽ tự động bắt đầu thi vào lúc ${gioBatDauInput}.`, 'info');
    setHienThiModalHenGio(false);
  };

  const xuLyHuyHenGio = () => {
    setThoiGianAutoStart(null);
    setDemNguocGiay(null);
    onHienThiToast('Đã hủy hẹn giờ', 'Đã hủy cài đặt tự động bắt đầu thi.', 'info');
  };

  const formatDemNguoc = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [isTamDungAll, setIsTamDungAll] = useState<boolean>(false);

  // State thu gọn / mở rộng bảng điều khiển bên phải (Kéo / đóng mở khung thao tác)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);

  // State đóng / mở cho Thao tác nhanh & Thống kê tổng quan
  const [isThaoTacNhanhMo, setIsThaoTacNhanhMo] = useState<boolean>(true);
  const [isThongKeTongQuanMo, setIsThongKeTongQuanMo] = useState<boolean>(false);

  // Modal State
  const [modalType, setModalType] = useState<
    'NHAN_THONG_BAO' | 'TAM_DUNG' | 'CONG_PHUT' | 'THU_BAI_ALL' | 'KET_THUC_PHONG' | 'XEM_VI_PHAM' | 'XEM_ALL_LOGS' | 'THEM_SV_NGOAI_LE' | null
  >(null);
  
  const [noiDungThongBao, setNoiDungThongBao] = useState<string>('Chú ý: Phụ trách phòng thi nhắc nhở các em tập trung làm bài!');
  const [soPhutCongModal, setSoPhutCongModal] = useState<number>(5);
  const [hocSinhDuocChonModal, setHocSinhDuocChonModal] = useState<HocSinhGiamSat | null>(null);

  // Form Thêm Sinh Viên Ngoại Lệ
  const [msvThemMoi, setMsvThemMoi] = useState<string>('');
  const [hoTenThemMoi, setHoTenThemMoi] = useState<string>('');
  const [lopThemMoi, setLopThemMoi] = useState<string>('DHTI15A1HN');

  // Giả lập nhận cảnh báo realtime khi đang thi
  useEffect(() => {
    if (trangThaiPhong === 'DANG_THI') {
      const timer = setTimeout(() => {
        onHienThiToast(
          'Cảnh báo vi phạm mới',
          'Học sinh Đỗ Kim F (20210006) vừa chuyển tab trình duyệt!',
          'warning'
        );
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [trangThaiPhong, onHienThiToast]);

  // Đồng bộ props phòng thi
  useEffect(() => {
    if (phongThi) {
      setTrangThaiPhong(phongThi.trangThai);
    }
  }, [phongThi]);

  // Thống kê số lượng
  const tongSoHocSinh = danhSachHocSinh.length;
  const soTrucTuyen = danhSachHocSinh.filter((h) => h.trangThai !== 'MAT_KET_NOI').length;
  const soDangLam = danhSachHocSinh.filter((h) => h.trangThai === 'DANG_LAM').length;
  const soDaNop = danhSachHocSinh.filter((h) => h.trangThai === 'DA_NOP').length;
  const soMatKetNoi = danhSachHocSinh.filter((h) => h.trangThai === 'MAT_KET_NOI').length;
  const soCanhBao = danhSachHocSinh.filter((h) => h.soViPham > 0).length;

  // Thống kê duyệt
  const soChoDuyet = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'CHO_DUYET').length;
  const soDaDuyet = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'DA_DUYET').length;
  const soTuChoi = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'TU_CHOI').length;

  const pctTrucTuyen = Math.round((soTrucTuyen / (tongSoHocSinh || 1)) * 100);
  const pctDangLam = Math.round((soDangLam / (tongSoHocSinh || 1)) * 100);
  const pctDaNop = Math.round((soDaNop / (tongSoHocSinh || 1)) * 100);
  const pctMatKetNoi = Math.round((soMatKetNoi / (tongSoHocSinh || 1)) * 100);
  const pctCanhBao = Math.round((soCanhBao / (tongSoHocSinh || 1)) * 100);

  // Lọc học sinh cho bảng giám sát
  const danhSachHocSinhLoc = danhSachHocSinh.filter((h) => {
    if (trangThaiPhong === 'CHO_BAT_DAU') {
      if (locDuyet !== 'TAT_CA' && h.trangThaiDuyet !== locDuyet) return false;
    } else {
      if (locTrangThai !== 'TAT_CA' && h.trangThai !== locTrangThai) return false;
    }
    if (tuKhoaTimKiem.trim() !== '') {
      const tk = tuKhoaTimKiem.toLowerCase().trim();
      return h.hoTen.toLowerCase().includes(tk) || h.msv.toLowerCase().includes(tk);
    }
    return true;
  });

  // ------------------------------------------------------------
  // CÁC HÀM XỬ LÝ PHÊ DUYỆT NGƯỜI THAM GIA
  // ------------------------------------------------------------
  const xuLyDuyetSinhVien = (msv: string) => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => (h.msv === msv ? { ...h, trangThaiDuyet: 'DA_DUYET' } : h))
    );
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setDanhSachThongBao((prev) => [
      { id: `tb-${Date.now()}`, thoiGian: timeNow, noiDung: `Đã duyệt sinh viên ${msv} vào phòng thi`, loai: 'SUCCESS' },
      ...prev
    ]);
    onHienThiToast('Đã duyệt sinh viên', `Sinh viên ${msv} đã được chấp thuận vào phòng thi.`, 'success');
  };

  const xuLyTuChoiSinhVien = (msv: string) => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => (h.msv === msv ? { ...h, trangThaiDuyet: 'TU_CHOI' } : h))
    );
    onHienThiToast('Đã từ chối', `Đã từ chối/khóa sinh viên ${msv} tham gia phòng thi.`, 'warning');
  };

  const xuLyThemSVNgoaiLe = () => {
    if (!msvThemMoi.trim() || !hoTenThemMoi.trim()) {
      onHienThiToast('Cảnh báo', 'Vui lòng nhập đầy đủ Mã sinh viên và Họ tên!', 'error');
      return;
    }
    const svMoi: HocSinhGiamSat = {
      stt: danhSachHocSinh.length + 1,
      msv: msvThemMoi.trim(),
      hoTen: hoTenThemMoi.trim(),
      lop: lopThemMoi.trim() || 'DHTI15A1HN',
      trangThai: 'DANG_LAM',
      trangThaiDuyet: 'DA_DUYET',
      soViPham: 0,
      thoiGianNop: '--',
      thoiGianCong: '--',
      lanMoiNhatPing: 'Vừa thêm',
      thoiGianVaoPhong: new Date().toLocaleTimeString('vi-VN')
    };

    setDanhSachHocSinh((prev) => [svMoi, ...prev]);
    onHienThiToast('Cấp quyền ngoại lệ', `Đã bổ sung và duyệt cho sinh viên ${svMoi.hoTen} (${svMoi.msv}).`, 'success');
    setMsvThemMoi('');
    setHoTenThemMoi('');
    setModalType(null);
  };

  const xuLyBatDauCaThi = () => {
    setTrangThaiPhong('DANG_THI');
    onHienThiToast('Bắt đầu ca thi', 'Ca thi đã chính thức bắt đầu! Tất cả sinh viên đã duyệt có thể bắt đầu làm bài.', 'success');
  };

  // Thao tác gửi thông báo
  const xuLyGuiThongBao = () => {
    if (!noiDungThongBao.trim()) return;
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setDanhSachThongBao((prev) => [
      { id: `tb-${Date.now()}`, thoiGian: timeNow, noiDung: `Gửi TB: ${noiDungThongBao}`, loai: 'SUCCESS' },
      ...prev
    ]);
    onHienThiToast('Đã gửi thông báo', `Đã phát thông báo tới toàn bộ học sinh trong phòng.`, 'success');
    setModalType(null);
  };

  // Thao tác tạm dừng / tiếp tục
  const xuLyToggleTamDung = () => {
    const statusNew = !isTamDungAll;
    setIsTamDungAll(statusNew);
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setDanhSachThongBao((prev) => [
      {
        id: `tb-${Date.now()}`,
        thoiGian: timeNow,
        noiDung: statusNew ? 'Cán bộ đã tạm dừng bài thi toàn phòng' : 'Cán bộ tiếp tục bài thi toàn phòng',
        loai: statusNew ? 'WARNING' : 'SUCCESS'
      },
      ...prev
    ]);
    onHienThiToast(
      statusNew ? 'Đã tạm dừng bài thi' : 'Đã tiếp tục bài thi',
      statusNew ? 'Tất cả máy học sinh đã bị tạm dừng làm bài.' : 'Tất cả máy học sinh đã tiếp tục làm bài.',
      statusNew ? 'warning' : 'success'
    );
    setModalType(null);
  };

  // Thao tác cộng thời gian
  const xuLyCongPhut = () => {
    if (hocSinhDuocChonModal) {
      setDanhSachHocSinh((prev) =>
        prev.map((h) =>
          h.msv === hocSinhDuocChonModal.msv
            ? { ...h, thoiGianCong: `+${parseInt(h.thoiGianCong.replace(/\D/g, '') || '0') + soPhutCongModal}p` }
            : h
        )
      );
      onHienThiToast('Cộng phút thành công', `Đã cộng thêm ${soPhutCongModal} phút cho học sinh ${hocSinhDuocChonModal.hoTen}.`, 'success');
    } else {
      setDanhSachHocSinh((prev) =>
        prev.map((h) => ({
          ...h,
          thoiGianCong: `+${parseInt(h.thoiGianCong.replace(/\D/g, '') || '0') + soPhutCongModal}p`
        }))
      );
      onHienThiToast('Cộng phút thành công', `Đã cộng thêm ${soPhutCongModal} phút cho tất cả học sinh.`, 'success');
    }
    setModalType(null);
    setHocSinhDuocChonModal(null);
  };

  // Thu bài toàn bộ
  const xuLyThuBaiToanBo = () => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => ({ ...h, trangThai: 'DA_NOP', thoiGianNop: new Date().toLocaleTimeString('vi-VN') }))
    );
    onHienThiToast('Đã thu bài toàn bộ', 'Hệ thống đã tự động khóa và thu bài của tất cả học sinh.', 'error');
    setModalType(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--bg-app)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* ------------------------------------------------------------ */}
      {/* HEADER: GIÁM SÁT TRỰC TIẾP & BẮT ĐẦU CA THI */}
      {/* ------------------------------------------------------------ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 24px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Giám sát trực tiếp
            </h1>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: trangThaiPhong === 'CHO_BAT_DAU' ? '#fef3c7' : '#d1fae5',
                color: trangThaiPhong === 'CHO_BAT_DAU' ? '#b45309' : '#047857',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              ● {trangThaiPhong === 'CHO_BAT_DAU' ? 'Phòng đang chờ bắt đầu' : 'Phòng đang diễn ra'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Theo dõi realtime & phê duyệt học sinh phòng thi
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Trạng thái kết nối */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#475569' }}>
            <span>Kết nối:</span>
            <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Đang kết nối
            </span>
          </div>

          {/* Chọn phòng thi */}
          <select
            value={phongThi.id}
            onChange={(e) => onChonPhongThi && onChonPhongThi(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {danhSachPhongThi.length > 0 ? (
              danhSachPhongThi.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.maPhong} - {p.tenPhong}
                </option>
              ))
            ) : (
              <option value={phongThi.id}>P001 - {phongThi.tenPhong}</option>
            )}
          </select>

          {/* Nút Nổi Bật: BẮT ĐẦU CA THI NGAY (Khi ở trạng thái chờ) */}
          {trangThaiPhong === 'CHO_BAT_DAU' ? (
            <button
              type="button"
              onClick={xuLyBatDauCaThi}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Rocket size={18} />
              Bắt đầu ca thi ngay
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onHienThiToast('Làm mới', 'Đã đồng bộ dữ liệu giám sát realtime.', 'success')}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Làm mới
            </button>
          )}
        </div>
      </div>

      {trangThaiPhong === 'CHO_BAT_DAU' && (
        <div
          style={{
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Phòng thi [{phongThi.maPhong}] đang ở trạng thái Chờ bắt đầu
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                Màn hình <b>Giám sát thi</b> quản lý các phòng đang thi & lưu lịch sử ca thi hoàn thành. Việc phê duyệt sinh viên được quản lý ở mục <b>Phòng chờ thi</b>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChuyenToiPhongCho && onChuyenToiPhongCho(phongThi.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Chuyển tới Mục Phòng chờ
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 5 THẺ THỐNG KÊ TIẾN ĐỘ HOẶC THỐNG KÊ DUYỆT (TỐI GIẢN MÀU SẮC) */}
      {/* ------------------------------------------------------------ */}
      {trangThaiPhong === 'CHO_BAT_DAU' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {/* Thẻ 1: Tổng đăng ký */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tổng sĩ số đăng ký</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{tongSoHocSinh}</div>
          </div>

          {/* Thẻ 2: Đang chờ duyệt */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đang chờ duyệt</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soChoDuyet}</div>
          </div>

          {/* Thẻ 3: Đã được duyệt */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đã phê duyệt</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soDaDuyet}</div>
          </div>

          {/* Thẻ 4: Bị từ chối */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đã từ chối / Khóa</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soTuChoi}</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {/* Thẻ 1: Trực tuyến */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                <User size={16} />
                <span>Trực tuyến</span>
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pctTrucTuyen}%</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{soTrucTuyen}</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${pctTrucTuyen}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '999px' }} />
            </div>
          </div>

          {/* Thẻ 2: Đang làm bài */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                <Edit3 size={16} />
                <span>Đang làm bài</span>
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pctDangLam}%</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{soDangLam}</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${pctDangLam}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '999px' }} />
            </div>
          </div>

          {/* Thẻ 3: Đã nộp */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                <Upload size={16} />
                <span>Đã nộp</span>
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pctDaNop}%</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{soDaNop}</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${pctDaNop}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '999px' }} />
            </div>
          </div>

          {/* Thẻ 4: Mất kết nối */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                <WifiOff size={16} />
                <span>Mất kết nối</span>
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pctMatKetNoi}%</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{soMatKetNoi}</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${pctMatKetNoi}%`, height: '100%', backgroundColor: 'var(--text-tertiary)', borderRadius: '999px' }} />
            </div>
          </div>

          {/* Thẻ 5: Cảnh báo */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                <AlertTriangle size={16} />
                <span>Cảnh báo</span>
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pctCanhBao}%</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{soCanhBao}</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${pctCanhBao}%`, height: '100%', backgroundColor: 'var(--text-tertiary)', borderRadius: '999px' }} />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* KHỐI CHÍNH: BẢNG GIÁM SÁT HOẶC PHÊ DUYỆT (TRÁI) & KHUNG PHẢI (THU GỌN / MỞ RỘNG) */}
      {/* ------------------------------------------------------------ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isRightSidebarOpen ? '1fr 340px' : '1fr',
          gap: '16px',
          alignItems: 'start',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        
        {/* CỘT TRÁI: BẢNG HỌC SINH */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '480px'
          }}
        >
          <div>
            {/* THANH LỌC & TÌM KIẾM */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <Sliders size={15} />
                  Bộ lọc:
                </button>

                {/* Ô tìm kiếm */}
                <div style={{ position: 'relative', minWidth: '200px', flex: 1, maxWidth: '280px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm học sinh..."
                    value={tuKhoaTimKiem}
                    onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      paddingLeft: '32px',
                      paddingRight: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  {tuKhoaTimKiem && (
                    <X
                      size={14}
                      onClick={() => setTuKhoaTimKiem('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                    />
                  )}
                </div>

                {/* Dropdown Trạng thái */}
                {trangThaiPhong === 'CHO_BAT_DAU' ? (
                  <select
                    value={locDuyet}
                    onChange={(e) => setLocDuyet(e.target.value as any)}
                    style={{
                      height: '36px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="TAT_CA">Tất cả duyệt</option>
                    <option value="CHO_DUYET">Chờ duyệt</option>
                    <option value="DA_DUYET">Đã duyệt</option>
                    <option value="TU_CHOI">Từ chối</option>
                  </select>
                ) : (
                  <select
                    value={locTrangThai}
                    onChange={(e) => setLocTrangThai(e.target.value as any)}
                    style={{
                      height: '36px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="TAT_CA">Tất cả bài thi</option>
                    <option value="DANG_LAM">Đang làm bài</option>
                    <option value="DA_NOP">Đã nộp bài</option>
                    <option value="MAT_KET_NOI">Mất kết nối</option>
                  </select>
                )}

                {/* Nút Xóa lọc */}
                <button
                  type="button"
                  onClick={() => {
                    setTuKhoaTimKiem('');
                    setLocTrangThai('TAT_CA');
                    setLocDuyet('TAT_CA');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  <RotateCcw size={14} />
                  Xóa lọc
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '12.5px'
                  }}
                >
                  {danhSachHocSinhLoc.length} / {tongSoHocSinh} học sinh
                </span>

                <button
                  type="button"
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: isRightSidebarOpen ? '1px solid var(--border-color)' : '1px solid var(--primary)',
                    backgroundColor: isRightSidebarOpen ? 'var(--bg-surface)' : 'var(--primary-light)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: isRightSidebarOpen ? 'var(--text-secondary)' : 'var(--primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isRightSidebarOpen ? 'Thu gọn bảng phải ➔' : '◧ Mở bảng thao tác'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsThuGon(!isThuGon)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isThuGon ? 'Mở rộng bảng' : 'Thu gọn bảng'}
                </button>
              </div>
            </div>

            {/* BẢNG DANH SÁCH HỌC SINH */}
            {!isThuGon && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: 'var(--bg-surface-subtle)',
                        height: '44px',
                        borderBottom: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <th style={{ padding: '0 14px', width: '50px', textAlign: 'center' }}>STT</th>
                      <th style={{ padding: '0 14px', width: '110px' }}>MSV</th>
                      <th style={{ padding: '0 14px' }}>HỌ TÊN</th>
                      {trangThaiPhong === 'CHO_BAT_DAU' ? (
                        <>
                          <th style={{ padding: '0 14px', width: '130px' }}>TRẠNG THÁI DUYỆT</th>
                          <th style={{ padding: '0 14px', width: '120px', textAlign: 'center' }}>THỜI GIAN VÀO</th>
                          <th style={{ padding: '0 14px', width: '170px', textAlign: 'right' }}>THAO TÁC DUYỆT</th>
                        </>
                      ) : (
                        <>
                          <th style={{ padding: '0 14px', width: '140px' }}>TRẠNG THÁI</th>
                          <th style={{ padding: '0 14px', width: '100px', textAlign: 'center' }}>VI PHẠM</th>
                          <th style={{ padding: '0 14px', width: '110px', textAlign: 'center' }}>NỘP BÀI</th>
                          <th style={{ padding: '0 14px', width: '100px', textAlign: 'center' }}>THỜI GIAN</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {danhSachHocSinhLoc.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                          Không tìm thấy học sinh phù hợp với điều kiện lọc.
                        </td>
                      </tr>
                    ) : (
                      danhSachHocSinhLoc.map((h) => {
                        const isNop = h.trangThai === 'DA_NOP';
                        const isOffline = h.trangThai === 'MAT_KET_NOI';
                        const hasViPham = h.soViPham > 0;

                        return (
                          <tr
                            key={h.msv}
                            style={{
                              height: '52px',
                              borderBottom: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)'
                            }}
                          >
                            {/* STT */}
                            <td style={{ padding: '0 14px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {h.stt}
                            </td>

                            {/* MSV */}
                            <td style={{ padding: '0 14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                              {h.msv}
                            </td>

                            {/* HỌ TÊN */}
                            <td style={{ padding: '0 14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                              {h.hoTen}
                            </td>

                            {trangThaiPhong === 'CHO_BAT_DAU' ? (
                              <>
                                {/* TRẠNG THÁI DUYỆT */}
                                <td style={{ padding: '0 14px' }}>
                                  {h.trangThaiDuyet === 'CHO_DUYET' ? (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Chờ duyệt
                                    </span>
                                  ) : h.trangThaiDuyet === 'TU_CHOI' ? (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Từ chối
                                    </span>
                                  ) : (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Đã duyệt
                                    </span>
                                  )}
                                </td>

                                {/* THỜI GIAN VÀO */}
                                <td style={{ padding: '0 14px', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                  {h.thoiGianVaoPhong || '16:00:00'}
                                </td>

                                {/* THAO TÁC DUYỆT */}
                                <td style={{ padding: '0 14px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    {h.trangThaiDuyet !== 'DA_DUYET' && (
                                      <button
                                        type="button"
                                        onClick={() => xuLyDuyetSinhVien(h.msv)}
                                        style={{
                                          padding: '5px 14px',
                                          borderRadius: '6px',
                                          border: '1px solid var(--border-color)',
                                          backgroundColor: 'var(--bg-surface-subtle)',
                                          color: 'var(--text-primary)',
                                          fontSize: '12.5px',
                                          fontWeight: 600,
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        Duyệt
                                      </button>
                                    )}
                                    {h.trangThaiDuyet !== 'TU_CHOI' && (
                                      <button
                                        type="button"
                                        onClick={() => xuLyTuChoiSinhVien(h.msv)}
                                        style={{
                                          padding: '5px 14px',
                                          borderRadius: '6px',
                                          border: '1px solid var(--border-color)',
                                          backgroundColor: 'transparent',
                                          color: 'var(--text-secondary)',
                                          fontSize: '12.5px',
                                          fontWeight: 500,
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        Từ chối
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                {/* TRẠNG THÁI LÀM BÀI */}
                                <td style={{ padding: '0 14px' }}>
                                  {isNop ? (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Đã nộp bài
                                    </span>
                                  ) : isOffline ? (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Mất kết nối
                                    </span>
                                  ) : (
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      Đang làm bài
                                    </span>
                                  )}
                                </td>

                                {/* VI PHẠM */}
                                <td style={{ padding: '0 14px', textAlign: 'center' }}>
                                  {hasViPham ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHocSinhDuocChonModal(h);
                                        setModalType('XEM_VI_PHAM');
                                      }}
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                      <AlertTriangle size={14} style={{ color: 'var(--text-secondary)' }} />
                                      <span>{h.soViPham}</span>
                                    </button>
                                  ) : (
                                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>0</span>
                                  )}
                                </td>

                                {/* NỘP BÀI */}
                                <td style={{ padding: '0 14px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                  {h.thoiGianNop}
                                </td>

                                {/* THỜI GIAN CỘNG */}
                                <td style={{ padding: '0 14px', textAlign: 'center', color: h.thoiGianCong !== '--' ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: h.thoiGianCong !== '--' ? 600 : 400 }}>
                                  {h.thoiGianCong}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* FOOTER BẢNG THEO DÕI */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
              <span>{trangThaiPhong === 'CHO_BAT_DAU' ? 'Phòng thi đã mở và sẵn sàng chờ bắt đầu' : 'Phòng thi đang hoạt động trực tiếp'}</span>
            </div>


            {trangThaiPhong === 'CHO_BAT_DAU' && (
              demNguocGiay !== null ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--primary)'
                  }}
                >
                  <Clock size={15} />
                  <span>Tự động bắt đầu sau: <b>{formatDemNguoc(demNguocGiay)}</b></span>
                  <button
                    type="button"
                    onClick={xuLyHuyHenGio}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-secondary)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setHienThiModalHenGio(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Clock size={15} />
                  <span>Hẹn giờ bắt đầu</span>
                </button>
              )
            )}
              {trangThaiPhong === 'CHO_BAT_DAU' ? (
              <button
                type="button"
                onClick={xuLyBatDauCaThi}
                style={{
                  padding: '9px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                🚀 Bắt đầu ca thi
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalType('KET_THUC_PHONG')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                }}
              >
                Kết thúc thi
              </button>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: CÁC KHỐI THAO TÁC VÀ THÔNG BÁO (THU GỌN LẠI KHI CẦN) */}
        {isRightSidebarOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Thanh tiêu đề cột phải kèm nút đóng thu gọn */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>BẢNG ĐIỀU HÀNH & THAO TÁC</span>
              <button
                type="button"
                onClick={() => setIsRightSidebarOpen(false)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: '#0284c7', fontSize: '12.5px', cursor: 'pointer', fontWeight: 700 }}
              >
                Thu gọn ➔
              </button>
            </div>

            {/* KHỐI 1: THAO TÁC NHANH */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
            <div
              onClick={() => setIsThaoTacNhanhMo(!isThaoTacNhanhMo)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Power size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Thao tác nhanh</h3>
              </div>
              {isThaoTacNhanhMo ? <ChevronUp size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
            </div>

            {isThaoTacNhanhMo && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalType('NHAN_THONG_BAO')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--success)',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={20} />
                  <span>Nhắn thông báo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalType('TAM_DUNG')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--warning)',
                    backgroundColor: 'var(--warning-light)',
                    color: 'var(--warning)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {isTamDungAll ? <Play size={20} /> : <Pause size={20} />}
                  <span>{isTamDungAll ? 'Tiếp tục bài thi' : 'Tạm dừng bài thi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHocSinhDuocChonModal(null);
                    setModalType('CONG_PHUT');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <Clock size={20} />
                  <span>Cộng thêm phút</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalType('THU_BAI_ALL')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--danger)',
                    backgroundColor: 'var(--danger-light)',
                    color: 'var(--danger)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={20} />
                  <span>Thu bài toàn bộ</span>
                </button>
              </div>
            )}
          </div>

          {/* KHỐI 2: THÔNG BÁO HỆ THỐNG */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Volume2 size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Thông báo hệ thống</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {danhSachThongBao.map((tb) => (
                <div key={tb.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', lineHeight: 1.4 }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: tb.loai === 'SUCCESS' ? '#10b981' : tb.loai === 'WARNING' ? '#f59e0b' : '#ef4444',
                      marginTop: '6px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '12.5px' }}>{tb.thoiGian}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tb.noiDung}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalType('XEM_ALL_LOGS')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginTop: '4px'
              }}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* KHỐI 3: THỐNG KÊ TỔNG QUAN */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              onClick={() => setIsThongKeTongQuanMo(!isThongKeTongQuanMo)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '14.5px', fontWeight: 700 }}>Thống kê tổng quan</span>
              </div>
              {isThongKeTongQuanMo ? <ChevronUp size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
            </div>

            {isThongKeTongQuanMo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tổng sĩ số phòng thi:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{tongSoHocSinh} học sinh</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Đang ở phòng chờ / đã duyệt:</span>
                  <strong style={{ color: 'var(--primary)' }}>{soDaDuyet} / {tongSoHocSinh}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Trạng thái ca thi:</span>
                  <strong style={{ color: trangThaiPhong === 'CHO_BAT_DAU' ? 'var(--warning)' : 'var(--success)' }}>
                    {trangThaiPhong === 'CHO_BAT_DAU' ? 'Chờ bắt đầu' : 'Đang diễn ra'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

      {/* ------------------------------------------------------------ */}
      {/* CẠNH DƯỚI CÙNG TRẠNG THÁI: SẴN SÀNG */}
      {/* ------------------------------------------------------------ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0284c7', fontWeight: 600, marginTop: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
        <span>Sẵn sàng</span>
      </div>

      {/* ============================================================ */}
      {/* MODAL MỚI: THÊM SINH VIÊN NGOẠI LỆ */}
      {/* ============================================================ */}
      {modalType === 'THEM_SV_NGOAI_LE' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '460px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="#059669" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Cấp quyền tham gia ngoại lệ</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setModalType(null)} />
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '16px' }}>
              Thêm sinh viên bổ sung vào phòng thi và phê duyệt ngay lập tức.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>MÃ SINH VIÊN (MSV)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 20210099"
                  value={msvThemMoi}
                  onChange={(e) => setMsvThemMoi(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>HỌ VÀ TÊN</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn G"
                  value={hoTenThemMoi}
                  onChange={(e) => setHoTenThemMoi(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>LỚP HỌC</label>
                <input
                  type="text"
                  placeholder="Ví dụ: DHTI15A1HN"
                  value={lopThemMoi}
                  onChange={(e) => setLopThemMoi(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={xuLyThemSVNgoaiLe}
                style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#059669', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Cấp quyền & Duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: NHẮN THÔNG BÁO TOÀN PHÒNG */}
      {/* ============================================================ */}
      {modalType === 'NHAN_THONG_BAO' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '480px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="#059669" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Nhắn thông báo tới học sinh</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setModalType(null)} />
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
              Thông báo sẽ hiển thị trực tiếp trên màn hình bài thi của toàn bộ học sinh trong phòng.
            </p>

            <textarea
              rows={4}
              value={noiDungThongBao}
              onChange={(e) => setNoiDungThongBao(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={xuLyGuiThongBao}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#059669', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                <Send size={15} /> Gửi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: TẠM DỪNG / TIẾP TỤC BÀI THI */}
      {/* ============================================================ */}
      {modalType === 'TAM_DUNG' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '420px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
              {isTamDungAll ? 'Xác nhận Tiếp tục bài thi?' : 'Xác nhận Tạm dừng bài thi toàn phòng?'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              {isTamDungAll
                ? 'Hệ thống sẽ mở lại màn hình để tất cả học sinh tiếp tục làm bài.'
                : 'Hệ thống sẽ tạm khóa màn hình làm bài của tất cả học sinh. Thời gian đếm ngược sẽ ngừng lại.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy
              </button>
              <button
                type="button"
                onClick={xuLyToggleTamDung}
                style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: isTamDungAll ? '#059669' : '#d97706', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                {isTamDungAll ? 'Tiếp tục bài thi' : 'Tạm dừng ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CỘNG THÊM PHÚT */}
      {/* ============================================================ */}
      {modalType === 'CONG_PHUT' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '420px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="#2563eb" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Cộng thêm phút làm bài</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setModalType(null)} />
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
              {hocSinhDuocChonModal
                ? `Cộng thêm phút làm bài cho học sinh ${hocSinhDuocChonModal.hoTen} (${hocSinhDuocChonModal.msv})`
                : 'Cộng thêm phút làm bài cho TOÀN BỘ học sinh trong phòng.'}
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[3, 5, 10, 15].map((phut) => (
                <button
                  key={phut}
                  type="button"
                  onClick={() => setSoPhutCongModal(phut)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '10px',
                    border: soPhutCongModal === phut ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: soPhutCongModal === phut ? '#eff6ff' : '#ffffff',
                    color: soPhutCongModal === phut ? '#2563eb' : '#475569',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  +{phut} phút
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy
              </button>
              <button
                type="button"
                onClick={xuLyCongPhut}
                style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Xác nhận cộng +{soPhutCongModal}p
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: THU BÀI TOÀN BỘ KHẨN CẤP */}
      {/* ============================================================ */}
      {modalType === 'THU_BAI_ALL' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '420px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
              Xác nhận Thu bài toàn bộ phòng?
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Hệ thống sẽ ngay lập tức khóa bài và thu bài của toàn bộ học sinh. Thao tác này không thể hoàn tác!
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={xuLyThuBaiToanBo}
                style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#e11d48', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Thu bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: XÁC NHẬN KẾT THÚC PHÒNG THI */}
      {/* ============================================================ */}
      {modalType === 'KET_THUC_PHONG' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '420px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
              Kết thúc ca thi phòng {phongThi.maPhong}?
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              Tất cả bài thi sẽ được nộp tự động và đóng phiên giám sát trực tiếp.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  onKetThucPhong();
                }}
                style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Kết thúc ca thi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: XEM LỊCH SỬ VI PHẠM CỦA HỌC SINH */}
      {/* ============================================================ */}
      {modalType === 'XEM_VI_PHAM' && hocSinhDuocChonModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '560px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} color="#dc2626" />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Chi tiết vi phạm: {hocSinhDuocChonModal.hoTen}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>MSV: {hocSinhDuocChonModal.msv}</span>
                </div>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setModalType(null)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '50vh', overflowY: 'auto', marginBottom: '20px' }}>
              {danhSachViPham.filter((v) => v.msv === hocSinhDuocChonModal.msv).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  Không có nhật ký vi phạm chi tiết cho học sinh này.
                </div>
              ) : (
                danhSachViPham
                  .filter((v) => v.msv === hocSinhDuocChonModal.msv)
                  .map((log, idx) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: log.mucDo === 'NGHIEM_TRONG' ? '#fff1f2' : '#fefce8',
                        borderLeft: log.mucDo === 'NGHIEM_TRONG' ? '4px solid #ef4444' : '4px solid #f59e0b'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Lần {idx + 1} - Lúc {log.thoiGian}</span>
                        <span style={{ fontWeight: 700, color: log.mucDo === 'NGHIEM_TRONG' ? '#dc2626' : '#d97706' }}>
                          {log.mucDo === 'NGHIEM_TRONG' ? 'Nghiêm trọng' : 'Cảnh báo'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', margin: 0, color: '#334155', fontWeight: 500 }}>
                        {log.hanhVi}
                      </p>
                    </div>
                  ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setModalType('CONG_PHUT');
                }}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
              >
                + Cộng phút cho học sinh này
              </button>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 7: XEM TẤT CẢ LOGS HỆ THỐNG */}
      {/* ============================================================ */}
      {modalType === 'XEM_ALL_LOGS' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', width: '540px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Nhật ký thông báo hệ thống realtime</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setModalType(null)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '50vh', overflowY: 'auto', marginBottom: '20px' }}>
              {danhSachThongBao.map((tb) => (
                <div key={tb.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tb.loai === 'SUCCESS' ? '#10b981' : tb.loai === 'WARNING' ? '#f59e0b' : '#ef4444' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748b' }}>{tb.thoiGian}</span>
                  <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>{tb.noiDung}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HẸN GIỜ TỰ ĐỘNG BẮT ĐẦU THI */}
      {hienThiModalHenGio && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', width: '420px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Hẹn giờ tự động bắt đầu thi</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setHienThiModalHenGio(false)} />
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Cài đặt thời gian chờ. Khi đến thời điểm đã cài, ca thi phòng <b>{phongThi.maPhong}</b> sẽ <b>tự động bắt đầu</b> cho toàn bộ sinh viên đã được phê duyệt.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TÙY CHỌN BẮT ĐẦU SAU (PHÚT):</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[5, 10, 15, 30].map((phut) => (
                  <button
                    key={phut}
                    type="button"
                    onClick={() => xuLyHenGioSauPhut(phut)}
                    style={{
                      padding: '10px 0',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    +{phut} phút
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>HOẶC CHỌN THỜI GIAN CỤ THỂ (HH:mm):</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="time"
                  value={gioBatDauInput}
                  onChange={(e) => setGioBatDauInput(e.target.value)}
                  style={{
                    flex: 1,
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={xuLyHenGioTheoGio}
                  style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-on-primary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setHienThiModalHenGio(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default ManHinhGiamSat;
