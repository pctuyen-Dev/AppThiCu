import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Send,
  Download,
  Search,
  ArrowLeft,
  BookOpen,
  Edit3,
  Scale,
  X,
  MoreVertical,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import type { BaiNopSinhVien } from '../../types/BoThuVienTypes';
import { chuanHoaMaPhong } from '../../utils/MaPhongUtils';

export interface DonPhucKhao {
  id: string;
  maSinhVien: string;
  hoTenSinhVien: string;
  lop: string;
  tenBaiKiemTra: string;
  maPhong: string;
  ngayNopDon: string;
  diemBanDau: number;
  diemSauPhucKhao?: number;
  lyDoPhucKhao: string;
  trangThai: 'CHO_XU_LY' | 'DA_CHAP_NHAN' | 'TU_CHOI';
  phanHoiGiangVien?: string;
}

interface ChamBaiProps {
  danhSachBaiNop: BaiNopSinhVien[];
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
  tabBanDau?: 'KHO_BAI_NOP' | 'CHAM_DIEM' | 'PHUC_KHAO';
}

const initialDonPhucKhao: DonPhucKhao[] = [
  {
    id: 'PK001',
    maSinhVien: '20210003',
    hoTenSinhVien: 'Lê Phương C',
    lop: 'DHTI15A1HN',
    tenBaiKiemTra: 'Kiểm tra Giữa kỳ - Lập trình Web',
    maPhong: 'A102',
    ngayNopDon: '25/08/2026 10:15',
    diemBanDau: 6.5,
    lyDoPhucKhao: 'Em xin phúc khảo câu 3 bài tập tự luận. Em đã viết đúng thuật toán đệ quy nhưng bị trừ 2 điểm.',
    trangThai: 'CHO_XU_LY'
  },
  {
    id: 'PK002',
    maSinhVien: '20210005',
    hoTenSinhVien: 'Phạm Ngọc E',
    lop: 'DHTI15A1HN',
    tenBaiKiemTra: 'Thi Kết thúc học phần - Cơ sở dữ liệu',
    maPhong: 'B201',
    ngayNopDon: '24/08/2026 14:30',
    diemBanDau: 7.0,
    diemSauPhucKhao: 8.5,
    lyDoPhucKhao: 'File SQL nộp của em có đủ 5 câu truy vấn chuẩn Chuẩn hóa 3NF.',
    trangThai: 'DA_CHAP_NHAN',
    phanHoiGiangVien: 'Đã duyệt lại câu 4 bổ sung +1.5 điểm.'
  },
  {
    id: 'PK003',
    maSinhVien: '20210008',
    hoTenSinhVien: 'Trần Văn K',
    lop: 'DHTI15A2HN',
    tenBaiKiemTra: 'Kiểm tra Giữa kỳ - Lập trình Web',
    maPhong: 'A102',
    ngayNopDon: '23/08/2026 16:45',
    diemBanDau: 5.0,
    lyDoPhucKhao: 'Em xin chấm lại câu 2 trắc nghiệm.',
    trangThai: 'TU_CHOI',
    phanHoiGiangVien: 'Câu 2 trắc nghiệm hệ thống chấm tự động chính xác, không thay đổi điểm.'
  }
];

export const ChamBai: React.FC<ChamBaiProps> = ({ danhSachBaiNop, onHienThiToast, tabBanDau = 'CHAM_DIEM' }) => {
  // ------------------------------------------------------------------
  // SUB-TAB CHÍNH: KHO BÀI NỘP - CHẤM ĐIỂM - PHÚC KHẢO
  // ------------------------------------------------------------------
  const [tabHienTai, setTabHienTai] = useState<'KHO_BAI_NOP' | 'CHAM_DIEM' | 'PHUC_KHAO'>(tabBanDau);

  useEffect(() => {
    if (tabBanDau) {
      setTabHienTai(tabBanDau);
      setBaiNopDangChon(null);
    }
  }, [tabBanDau]);

  // Trạng thái Lọc & Tìm kiếm
  const [maPhongChon, setMaPhongChon] = useState<string>('TAT_CA');
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [trangThaiLoc, setTrangThaiLoc] = useState<string>('TAT_CA');

  // Menu 3 chấm thao tác trên từng dòng
  const [menuThaoTacOpenId, setMenuThaoTacOpenId] = useState<string | null>(null);

  // Sinh viên đang được chấm chi tiết
  const [baiNopDangChon, setBaiNopDangChon] = useState<BaiNopSinhVien | null>(null);
  const [tabChiTietTrai, setTabChiTietTrai] = useState<'DE_THI' | 'BAI_LAM'>('BAI_LAM');
  const [diemInput, setDiemInput] = useState<number>(8.5);
  const [diemInputText, setDiemInputText] = useState<string>('8.5');
  const [nhanXetInput, setNhanXetInput] = useState<string>('');

  // Đơn phúc khảo
  const [danhSachPhucKhao, setDanhSachPhucKhao] = useState<DonPhucKhao[]>(initialDonPhucKhao);
  const [donPhucKhaoDangChon, setDonPhucKhaoDangChon] = useState<DonPhucKhao | null>(null);
  const [diemPhucKhaoMoi, setDiemPhucKhaoMoi] = useState<number>(8.0);
  const [diemPhucKhaoMoiText, setDiemPhucKhaoMoiText] = useState<string>('8.0');
  const [phanHoiPhucKhaoInput, setPhanHoiPhucKhaoInput] = useState<string>('');

  // Hàm làm tròn điểm 2 chữ số thập phân (vd: 10.23 -> 10.23, 10.245 -> 10.25)
  const lamTronDiem = (val: number): number => {
    if (isNaN(val)) return 0;
    return Math.round(val * 100) / 100;
  };

  // Render Badge Tình trạng nộp
  const renderBadgeTinhTrangNop = (bn: BaiNopSinhVien) => {
    const info = bn.tinhTrangNop || { loai: 'DUNG_GIO', moTa: 'Nộp đúng giờ' };
    if (info.loai === 'SOM') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--success-light, #dcfce7)', color: 'var(--success, #15803d)', fontWeight: 600, fontSize: '12px' }}>
          <CheckCircle2 size={13} /> {info.moTa}
        </span>
      );
    }
    if (info.loai === 'MUON') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--error-light, #fee2e2)', color: 'var(--error, #b91c1c)', fontWeight: 600, fontSize: '12px' }}>
          <AlertCircle size={13} /> {info.moTa}
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light, #e0f2fe)', color: 'var(--primary, #0284c7)', fontWeight: 600, fontSize: '12px' }}>
        <Clock size={13} /> {info.moTa}
      </span>
    );
  };

  // Render Badge Số lần vi phạm
  const renderBadgeViPham = (bn: BaiNopSinhVien) => {
    const count = bn.soLanViPham || 0;
    if (count === 0) {
      return (
        <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>
          0 lần (Hợp lệ)
        </span>
      );
    }
    return (
      <span title={bn.chiTietViPham} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--warning-light, #fef3c7)', border: '1px solid var(--border-color)', color: 'var(--warning, #b45309)', fontWeight: 700, fontSize: '12px' }}>
        <AlertTriangle size={13} /> {bn.chiTietViPham || `${count} lần`}
      </span>
    );
  };

  // Render Menu Ba chấm Thao tác
  const renderMenuThaoTac = (bn: BaiNopSinhVien) => {
    const isMenuOpen = menuThaoTacOpenId === bn.id;
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuThaoTacOpenId(isMenuOpen ? null : bn.id);
          }}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: isMenuOpen ? 'var(--primary-light)' : 'var(--bg-surface-subtle)',
            color: isMenuOpen ? 'var(--primary)' : 'var(--text-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
          title="Thao tác"
        >
          <MoreVertical size={16} />
        </button>

        {isMenuOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuThaoTacOpenId(null);
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 4px)',
                width: '160px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
                zIndex: 101,
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                textAlign: 'left'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  xuLyMoChamChiTiet(bn);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Eye size={14} style={{ color: 'var(--primary)' }} />
                Xem bài làm
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  onHienThiToast('Tải file', `Đang tải bài làm của sinh viên ${bn.hoTenSinhVien}...`, 'info');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} style={{ color: 'var(--success, #10b981)' }} />
                Tải file bài nộp
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  xuLyMoChamChiTiet(bn);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} style={{ color: 'var(--warning, #f59e0b)' }} />
                {bn.trangThaiCham === 'DA_CHAM' ? 'Sửa điểm' : 'Chấm điểm'}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Danh sách các Mã Phòng Thi độc bản
  const danhSachMaPhongDocBan = Array.from(
    new Set(danhSachBaiNop.map((b) => chuanHoaMaPhong(b.maPhong || 'A102')))
  );

  // Filter bài nộp
  const danhSachBaiNopLoc = danhSachBaiNop.filter((bn) => {
    const maP = chuanHoaMaPhong(bn.maPhong || 'A102');
    const phuHopMaPhong = maPhongChon === 'TAT_CA' || maP === maPhongChon;
    const phuHopTuKhoa =
      bn.hoTenSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      bn.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      bn.tenBaiKiemTra.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    const phuHopTrangThai =
      trangThaiLoc === 'TAT_CA' || bn.trangThaiCham === trangThaiLoc;

    return phuHopMaPhong && phuHopTuKhoa && phuHopTrangThai;
  });

  // Filter phúc khảo
  const danhSachPhucKhaoLoc = danhSachPhucKhao.filter((pk) => {
    const phuHopMaPhong = maPhongChon === 'TAT_CA' || pk.maPhong === maPhongChon;
    const phuHopTuKhoa =
      pk.hoTenSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      pk.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      pk.tenBaiKiemTra.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    return phuHopMaPhong && phuHopTuKhoa;
  });

  // Thống kê nhanh
  const soLuongBaiChoCham = danhSachBaiNop.filter((b) => b.trangThaiCham === 'CHUA_CHAM').length;
  const soLuongBaiDaCham = danhSachBaiNop.filter((b) => b.trangThaiCham === 'DA_CHAM').length;

  // Mở màn hình chấm chi tiết
  const xuLyMoChamChiTiet = (bn: BaiNopSinhVien) => {
    setBaiNopDangChon(bn);
    const initialScore = bn.diemSo !== undefined ? lamTronDiem(bn.diemSo) : 8.5;
    setDiemInput(initialScore);
    setDiemInputText(initialScore.toString());
    setNhanXetInput(bn.nhanXetGiangVien || 'Bài làm đạt yêu cầu. Cấu trúc rõ ràng.');
  };

  const xuLyLuuDiem = () => {
    if (!baiNopDangChon) return;
    const scoreVal = lamTronDiem(parseFloat(diemInputText) || diemInput);
    setDiemInput(scoreVal);
    setDiemInputText(scoreVal.toString());
    onHienThiToast(
      'Đã lưu bài chấm',
      `Đã lưu điểm ${scoreVal} cho sinh viên ${baiNopDangChon.hoTenSinhVien} (${baiNopDangChon.maSinhVien}).`,
      'success'
    );
  };

  const xuLyTraKetQua = () => {
    if (!baiNopDangChon) return;
    const scoreVal = lamTronDiem(parseFloat(diemInputText) || diemInput);
    onHienThiToast(
      'Công bố điểm',
      `Đã gửi điểm ${scoreVal} và nhận xét tới tài khoản sinh viên ${baiNopDangChon.hoTenSinhVien}.`,
      'info'
    );
    setBaiNopDangChon(null);
  };

  // Xử lý Duyệt / Từ chối Phúc khảo
  const xuLyChapNhanPhucKhao = () => {
    if (!donPhucKhaoDangChon) return;
    const scoreVal = lamTronDiem(parseFloat(diemPhucKhaoMoiText) || diemPhucKhaoMoi);
    setDanhSachPhucKhao((prev) =>
      prev.map((item) =>
        item.id === donPhucKhaoDangChon.id
          ? {
              ...item,
              trangThai: 'DA_CHAP_NHAN',
              diemSauPhucKhao: scoreVal,
              phanHoiGiangVien: phanHoiPhucKhaoInput || 'Đã cập nhật lại điểm sau khi xem xét bài làm.'
            }
          : item
      )
    );
    onHienThiToast(
      'Duyệt phúc khảo thành công',
      `Đã điều chỉnh điểm của sinh viên ${donPhucKhaoDangChon.hoTenSinhVien} từ ${donPhucKhaoDangChon.diemBanDau} lên ${scoreVal}.`,
      'success'
    );
    setDonPhucKhaoDangChon(null);
  };

  const xuLyTuChoiPhucKhao = () => {
    if (!donPhucKhaoDangChon) return;
    setDanhSachPhucKhao((prev) =>
      prev.map((item) =>
        item.id === donPhucKhaoDangChon.id
          ? {
              ...item,
              trangThai: 'TU_CHOI',
              phanHoiGiangVien: phanHoiPhucKhaoInput || 'Bài làm chấm đúng theo đáp án, giữ nguyên điểm.'
            }
          : item
      )
    );
    onHienThiToast(
      'Đã từ chối đơn phúc khảo',
      `Giữ nguyên điểm ${donPhucKhaoDangChon.diemBanDau} cho sinh viên ${donPhucKhaoDangChon.hoTenSinhVien}.`,
      'warning'
    );
    setDonPhucKhaoDangChon(null);
  };

  // Nếu đang ở màn hình chấm bài chi tiết của 1 sinh viên
  if (baiNopDangChon) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* THANH HEADER CHI TIẾT */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setBaiNopDangChon(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              Quay lại danh sách
            </button>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {baiNopDangChon.hoTenSinhVien} ({baiNopDangChon.maSinhVien})
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Lớp: <b>{baiNopDangChon.lop}</b> - Bài thi: <b>{baiNopDangChon.tenBaiKiemTra}</b> (Phòng {chuanHoaMaPhong(baiNopDangChon.maPhong || 'A102')})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={xuLyLuuDiem}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Save size={15} />
              Lưu tạm
            </button>
            <button
              type="button"
              onClick={xuLyTraKetQua}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: 'var(--text-on-primary)',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              <Send size={15} />
              Công bố điểm
            </button>
          </div>
        </div>

        {/* BẢNG CHẤM BÀI 2 CỘT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
          {/* CỘT TRÁI: XEM ĐỀ THI VÀ BÀI LÀM */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '600px'
            }}
          >
            {/* TAB ĐỀ THI / BÀI LÀM */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <button
                type="button"
                onClick={() => setTabChiTietTrai('BAI_LAM')}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: tabChiTietTrai === 'BAI_LAM' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: tabChiTietTrai === 'BAI_LAM' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tabChiTietTrai === 'BAI_LAM' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={16} />
                Bài làm của sinh viên
              </button>

              <button
                type="button"
                onClick={() => setTabChiTietTrai('DE_THI')}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: tabChiTietTrai === 'DE_THI' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: tabChiTietTrai === 'DE_THI' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tabChiTietTrai === 'DE_THI' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <BookOpen size={16} />
                Đề thi tham chiếu
              </button>
            </div>

            {/* NỘI DUNG CHẤM */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              {tabChiTietTrai === 'BAI_LAM' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      File bài làm: <b>{baiNopDangChon.fileTuLuanNop?.tenFile || 'BaiLam_TuLuan.pdf'}</b>
                    </span>
                    <button
                      type="button"
                      onClick={() => onHienThiToast('Tải file', 'Đang tải file bài làm...', 'info')}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={14} /> Tải file bài nộp
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--bg-surface-subtle)', minHeight: '450px', fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                    <p style={{ fontWeight: 700, margin: '0 0 12px' }}>CÂU 1: Xây dựng cấu trúc Cơ sở dữ liệu Quản lý Đào tạo (4 điểm)</p>
                    <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)' }}>
                      - Thiết kế 5 bảng chuẩn hóa 3NF: SinhVien, Lop, MonHoc, Diem, GiangVien.<br />
                      - Tạo các ràng buộc Khóa chính (Primary Key) và Khóa ngoại (Foreign Key) chính xác.<br />
                      - Đã hoàn thành các câu lệnh CREATE TABLE & ALTER TABLE.
                    </p>

                    <p style={{ fontWeight: 700, margin: '16px 0 12px' }}>CÂU 2: Viết câu lệnh SQL truy vấn và Store Procedure (6 điểm)</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      - SELECT sv.MaSV, sv.HoTen, AVG(d.Diem) FROM SinhVien sv JOIN Diem d ON sv.MaSV = d.MaSV GROUP BY sv.MaSV HAVING AVG(d.Diem) &gt;= 8.0;<br />
                      - Viết thành công SP_CapNhatDiemSinhVien với tham số đầu vào MaSV và DiemMoi.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--bg-surface-subtle)', minHeight: '450px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-primary)' }}>Đề thi: {baiNopDangChon.tenBaiKiemTra}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <b>Câu 1 (4 điểm):</b> Trình bày quy trình chuẩn hóa CSDL từ dạng 1NF sang 3NF. Cho ví dụ minh họa cụ thể.<br /><br />
                    <b>Câu 2 (6 điểm):</b> Viết các truy vấn SQL nâng cao sử dụng INNER JOIN, GROUP BY và xây dựng Trigger kiểm tra điểm hợp lệ trong khoảng [0, 10].
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG NHẬP ĐIỂM VÀ NHẬN XẾT */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Đánh giá & Chấm điểm
            </h3>

            {/* NHẬP ĐIỂM SỐ */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                ĐIỂM SỐ (THANG ĐIỂM 10) *
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step="any"
                value={diemInputText}
                onChange={(e) => {
                  const valStr = e.target.value;
                  setDiemInputText(valStr);
                  const num = parseFloat(valStr);
                  if (!isNaN(num)) {
                    setDiemInput(num);
                  }
                }}
                onBlur={() => {
                  const num = parseFloat(diemInputText);
                  if (isNaN(num)) {
                    setDiemInput(0);
                    setDiemInputText('0');
                  } else {
                    const rounded = lamTronDiem(num);
                    setDiemInput(rounded);
                    setDiemInputText(rounded.toString());
                  }
                }}
                placeholder="Nhập điểm số..."
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '20px',
                  fontWeight: 800,
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            {/* NHẬN XẾT CỦA GIẢNG VIÊN */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                NHẬN XẾT CỦA GIẢNG VIÊN
              </label>
              <textarea
                rows={6}
                value={nhanXetInput}
                onChange={(e) => setNhanXetInput(e.target.value)}
                placeholder="Nhập nhận xét bài làm cho sinh viên..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <button
                type="button"
                onClick={xuLyLuuDiem}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Lưu tạm điểm số
              </button>
              <button
                type="button"
                onClick={xuLyTraKetQua}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-on-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Công bố điểm ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // GIAO DIỆN CHÍNH (GỒM 3 SUB-TABS: KHO BÀI NỘP - CHẤM ĐIỂM - PHÚC KHẢO)
  // ------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------ */}
      {/* HEADER VÀ ĐIỀU HƯỚNG SUB-TAB CẤP TRÊN */}
      {/* ------------------------------------------------------------ */}
      {/* THANH LỌC VÀ TÌM KIẾM CHUNG */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          {/* Lọc theo Mã phòng thi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mã phòng:</span>
            <select
              value={maPhongChon}
              onChange={(e) => setMaPhongChon(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="TAT_CA">Tất cả phòng thi</option>
              {danhSachMaPhongDocBan.map((p) => (
                <option key={p} value={p}>
                  Phòng: {p}
                </option>
              ))}
            </select>
          </div>

          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Tìm theo Mã SV, Họ tên..."
              value={tuKhoaTimKiem}
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '34px',
                paddingRight: '12px',
                borderRadius: '8px',
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
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              />
            )}
          </div>
        </div>

        {tabHienTai === 'CHAM_DIEM' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Trạng thái chấm:</span>
            <select
              value={trangThaiLoc}
              onChange={(e) => setTrangThaiLoc(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="TAT_CA">Tất cả</option>
              <option value="CHUA_CHAM">Chờ chấm ({soLuongBaiChoCham})</option>
              <option value="DA_CHAM">Đã chấm ({soLuongBaiDaCham})</option>
            </select>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* NỘI DUNG TỪNG SUB-TAB */}
      {/* ------------------------------------------------------------ */}

      {/* SUB-TAB 1: KHO BÀI NỘP */}
      {tabHienTai === 'KHO_BAI_NOP' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Danh sách bài làm đã lưu trong kho ({danhSachBaiNopLoc.length} bài)
            </span>
            <button
              type="button"
              onClick={() => onHienThiToast('Xuất kho', 'Đang nén và xuất kho bài nộp dạng ZIP...', 'info')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              <Download size={14} /> Tải toàn bộ kho bài (.zip)
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px', width: '90px' }}>MÃ PHÒNG</th>
                  <th style={{ padding: '0 16px', width: '150px' }}>TÌNH TRẠNG NỘP</th>
                  <th style={{ padding: '0 16px', width: '150px' }}>SỐ LẦN VI PHẠM</th>
                  <th style={{ padding: '0 16px', width: '150px' }}>FILE NỘP</th>
                  <th style={{ padding: '0 16px', width: '80px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachBaiNopLoc.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Kho chưa có bài nộp nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  danhSachBaiNopLoc.map((bn) => (
                    <tr key={bn.id} style={{ height: '52px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{bn.maSinhVien}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{bn.hoTenSinhVien}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{bn.lop}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{chuanHoaMaPhong(bn.maPhong || 'A102')}</td>
                      <td style={{ padding: '0 16px' }}>{renderBadgeTinhTrangNop(bn)}</td>
                      <td style={{ padding: '0 16px' }}>{renderBadgeViPham(bn)}</td>
                      <td style={{ padding: '0 16px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: 600 }}>
                          {bn.fileTuLuanNop?.tenFile || 'BaiLam.pdf'}
                        </span>
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center' }}>
                        {renderMenuThaoTac(bn)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHẤM ĐIỂM */}
      {tabHienTai === 'CHAM_DIEM' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Danh sách bài làm chờ chấm ({danhSachBaiNopLoc.length} bài)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px', width: '90px' }}>MÃ PHÒNG</th>
                  <th style={{ padding: '0 16px', width: '150px' }}>TÌNH TRẠNG NỘP</th>
                  <th style={{ padding: '0 16px', width: '150px' }}>SỐ LẦN VI PHẠM</th>
                  <th style={{ padding: '0 16px', width: '120px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>ĐIỂM SỐ</th>
                  <th style={{ padding: '0 16px', width: '80px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachBaiNopLoc.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Không có bài nộp nào phù hợp với điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  danhSachBaiNopLoc.map((bn) => (
                    <tr key={bn.id} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{bn.maSinhVien}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{bn.hoTenSinhVien}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{bn.lop}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{chuanHoaMaPhong(bn.maPhong || 'A102')}</td>
                      <td style={{ padding: '0 16px' }}>{renderBadgeTinhTrangNop(bn)}</td>
                      <td style={{ padding: '0 16px' }}>{renderBadgeViPham(bn)}</td>
                      <td style={{ padding: '0 16px' }}>
                        {bn.trangThaiCham === 'DA_CHAM' ? (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '12px' }}>
                            Đã chấm
                          </span>
                        ) : (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>
                            Chờ chấm
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                        {bn.diemSo !== undefined ? bn.diemSo : '--'}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center' }}>
                        {renderMenuThaoTac(bn)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PHÚC KHẢO */}
      {tabHienTai === 'PHUC_KHAO' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Danh sách đơn xin phúc khảo bài thi ({danhSachPhucKhaoLoc.length} đơn)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px' }}>BÀI THI PHÚC KHẢO</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>ĐIỂM GỐC</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>ĐIỂM MỚI</th>
                  <th style={{ padding: '0 16px', width: '130px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0 16px', width: '150px', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachPhucKhaoLoc.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Không có đơn phúc khảo nào.
                    </td>
                  </tr>
                ) : (
                  danhSachPhucKhaoLoc.map((pk) => (
                    <tr key={pk.id} style={{ height: '56px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{pk.maSinhVien}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{pk.hoTenSinhVien}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{pk.lop}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{pk.tenBaiKiemTra}</td>
                      <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>{pk.diemBanDau}</td>
                      <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                        {pk.diemSauPhucKhao !== undefined ? pk.diemSauPhucKhao : '--'}
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        {pk.trangThai === 'CHO_XU_LY' ? (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>
                            Chờ xử lý
                          </span>
                        ) : pk.trangThai === 'DA_CHAP_NHAN' ? (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '12px' }}>
                            Đã đổi điểm
                          </span>
                        ) : (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '12px' }}>
                            Từ chối
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setDonPhucKhaoDangChon(pk);
                            setDiemPhucKhaoMoi(pk.diemSauPhucKhao || pk.diemBanDau + 1.0);
                            setPhanHoiPhucKhaoInput(pk.phanHoiGiangVien || '');
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Xử lý đơn
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL XỬ LÝ ĐƠN PHÚC KHẢO */}
      {donPhucKhaoDangChon && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', width: '500px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Xử lý Đơn xin phúc khảo</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setDonPhucKhaoDangChon(null)} />
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {donPhucKhaoDangChon.hoTenSinhVien} ({donPhucKhaoDangChon.maSinhVien})
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                Bài thi: <b>{donPhucKhaoDangChon.tenBaiKiemTra}</b> | Điểm ban đầu: <b>{donPhucKhaoDangChon.diemBanDau}</b>
              </p>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '10px' }}>
                "{donPhucKhaoDangChon.lyDoPhucKhao}"
              </div>
            </div>

            {/* NHẬP ĐIỂM SỐ MỚI */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>ĐIỂM SỐ MỚI SAU PHÚC KHẢO</label>
              <input
                type="number"
                min={0}
                max={10}
                step="any"
                value={diemPhucKhaoMoiText}
                onChange={(e) => {
                  const valStr = e.target.value;
                  setDiemPhucKhaoMoiText(valStr);
                  const num = parseFloat(valStr);
                  if (!isNaN(num)) {
                    setDiemPhucKhaoMoi(num);
                  }
                }}
                onBlur={() => {
                  const num = parseFloat(diemPhucKhaoMoiText);
                  if (isNaN(num)) {
                    setDiemPhucKhaoMoi(0);
                    setDiemPhucKhaoMoiText('0');
                  } else {
                    const rounded = lamTronDiem(num);
                    setDiemPhucKhaoMoi(rounded);
                    setDiemPhucKhaoMoiText(rounded.toString());
                  }
                }}
                style={{ width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontSize: '16px', outline: 'none', fontWeight: 700, color: 'var(--primary)' }}
              />
            </div>

            {/* PHẢN HỒI CỦA GIẢNG VIÊN */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>PHẢN HỒI CỦA GIẢNG VIÊN</label>
              <textarea
                rows={3}
                value={phanHoiPhucKhaoInput}
                onChange={(e) => setPhanHoiPhucKhaoInput(e.target.value)}
                placeholder="Nhập lý do duyệt hoặc từ chối phúc khảo..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontSize: '13px', outline: 'none', resize: 'none', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={xuLyTuChoiPhucKhao}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}
              >
                Từ chối đơn
              </button>
              <button
                type="button"
                onClick={xuLyChapNhanPhucKhao}
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Cập nhật điểm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamBai;
