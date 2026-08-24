import React, { useState } from 'react';
import {
  Plus,
  FileText,
  X,
  Eye,
  CheckSquare,
  FileCode,
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';
import type { BaiKiemTra, PhongThi, LoaiBaiKiemTra, NguoiDung } from '../../types/BoThuVienTypes';
import {
  chuanHoaMaPhong,
  kiemTraMaPhongHopLe,
  taoMaPhongTuDong
} from '../../utils/MaPhongUtils';

interface QuanLyThiCuProps {
  danhSachBaiKiemTra: BaiKiemTra[];
  danhSachPhongThi: PhongThi[];
  danhSachSinhVien: NguoiDung[];
  onTaoBaiKiemTra: (baiKiemTra: BaiKiemTra) => void;
  onTaoPhongThi: (phongThi: PhongThi) => void;
  onMoPhongThi?: (phongThiId: string) => void;
  onXoaPhongThi?: (phongThiId: string) => void;
  onChuyenToiGiamSat: (phongThiId: string) => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
  modeMoModalBanDau?: 'TAO_BAI' | 'TAO_PHONG' | null;
  tabBanDau?: 'BAI_KIEM_TRA' | 'PHONG_THI';
}

export const QuanLyThiCu: React.FC<QuanLyThiCuProps> = ({
  danhSachBaiKiemTra,
  danhSachPhongThi,
  danhSachSinhVien,
  onTaoBaiKiemTra,
  onTaoPhongThi,
  onXoaPhongThi,
  onChuyenToiGiamSat,
  onHienThiToast,
  modeMoModalBanDau,
  tabBanDau = 'BAI_KIEM_TRA'
}) => {
  const [tabHienTai, setTabHienTai] = useState<'BAI_KIEM_TRA' | 'PHONG_THI' | 'LICH_SU'>(tabBanDau);
  const [locLoaiBai, setLocLoaiBai] = useState<'TAT_CA' | 'TRAC_NGHIEM' | 'TU_LUAN'>('TAT_CA');

  React.useEffect(() => {
    if (tabBanDau) {
      setTabHienTai(tabBanDau);
    }
  }, [tabBanDau]);

  React.useEffect(() => {
    if (modeMoModalBanDau === 'TAO_BAI') {
      setBuocTaoBai(1);
      setLoaiBaiChon('TRAC_NGHIEM');
      setHienThiModalTaoBai(true);
    } else if (modeMoModalBanDau === 'TAO_PHONG') {
      setMaPhongForm(taoMaPhongTuDong());
      setHienThiModalTaoPhong(true);
    }
  }, [modeMoModalBanDau]);

  // ------------------------------------------------------------
  // STEPPER STATE - TẠO BÀI KIỂM TRA (3 BƯỚC)
  // ------------------------------------------------------------
  const [hienThiModalTaoBai, setHienThiModalTaoBai] = useState<boolean>(false);
  const [buocTaoBai, setBuocTaoBai] = useState<1 | 2 | 3>(1);
  const [loaiBaiChon, setLoaiBaiChon] = useState<LoaiBaiKiemTra>('TRAC_NGHIEM');
  const [tenBaiForm, setTenBaiForm] = useState<string>('Kiểm tra Trắc nghiệm & Tự luận CSDL');
  const [maBaiForm, setMaBaiForm] = useState<string>('EXAM-CSDL-2026');
  const [monHocForm, setMonHocForm] = useState<string>('Cơ sở dữ liệu');
  const [thoiLuongForm, setThoiLuongForm] = useState<number>(45);
  const [tongDiemForm, setTongDiemForm] = useState<number>(10);
  
  // File Đề Thi Đính Kèm (.pdf / .docx)
  const [fileDeThiForm, setFileDeThiForm] = useState<{ tenFile: string; kichThuoc: string; duongDan: string } | null>({
    tenFile: 'DeThiChinhThuc_CoSoDuLieu_2026.pdf',
    kichThuoc: '2.4 MB',
    duongDan: '#'
  });

  // ------------------------------------------------------------
  // STEPPER STATE - TẠO PHÒNG THI (3 BƯỚC THUẬN TIỆN)
  // ------------------------------------------------------------
  const [hienThiModalTaoPhong, setHienThiModalTaoPhong] = useState<boolean>(false);
  const [buocTaoPhong, setBuocTaoPhong] = useState<1 | 2 | 3>(1);
  
  // Bước 1: Mã phòng thi, Tên phòng thi & Phạm vi thi (LAN/Internet)
  const [cheDoTaoMa, setCheDoTaoMa] = useState<'TU_DONG' | 'THU_CONG'>('TU_DONG');
  const [maPhongForm, setMaPhongForm] = useState<string>(taoMaPhongTuDong());
  const [tenPhongForm, setTenPhongForm] = useState<string>('Phòng Máy 105 - Tòa A (Hà Nội)');
  const [phamViThiForm, setPhamViThiForm] = useState<'LAN' | 'INTERNET'>('LAN');
  
  // Bước 2: Lựa chọn 1 đề hay 2 đề & Chọn đề trong kho
  const [soLuongDePhong, setSoLuongDePhong] = useState<1 | 2>(1);
  const [baiKiemTraChonId, setBaiKiemTraChonId] = useState<string>(danhSachBaiKiemTra[0]?.id || '');
  const [baiKiemTraPhuId, setBaiKiemTraPhuId] = useState<string>(danhSachBaiKiemTra[1]?.id || danhSachBaiKiemTra[0]?.id || '');

  // Thông tin bài kiểm tra tự động nạp (Cho phép giảng viên chỉnh sửa!)
  const [tenBaiKiemTraPhongForm, setTenBaiKiemTraPhongForm] = useState<string>(danhSachBaiKiemTra[0]?.tenBaiKiemTra || '');
  const [monHocPhongForm, setMonHocPhongForm] = useState<string>(danhSachBaiKiemTra[0]?.monHoc || '');
  const [thoiLuongPhongForm, setThoiLuongPhongForm] = useState<number>(danhSachBaiKiemTra[0]?.thoiLuongPhut || 45);

  // Cấu hình quy tắc thi ở Bước 2
  const [tronCauHoiPhong, setTronCauHoiPhong] = useState<boolean>(true);
  const [tronDapAnPhong, setTronDapAnPhong] = useState<boolean>(true);
  const [choXemDiemPhong, setChoXemDiemPhong] = useState<boolean>(true);

  const [danhSachSVDaChon] = useState<string[]>(danhSachSinhVien.map((s) => s.maDinhDanh));
  const kiemTraMaValid = kiemTraMaPhongHopLe(maPhongForm);

  // ------------------------------------------------------------
  // QUẢN LÝ PHÒNG THI LOCAL, CHỌN HÀNG LOẠT, ĐỔI TRẠNG THÁI, XÓA & SỬA
  // ------------------------------------------------------------
  const [danhSachPhongThiLocal, setDanhSachPhongThiLocal] = useState<PhongThi[]>(danhSachPhongThi);
  const [danhSachPhongDaChon, setDanhSachPhongDaChon] = useState<string[]>([]);

  React.useEffect(() => {
    setDanhSachPhongThiLocal(danhSachPhongThi);
  }, [danhSachPhongThi]);

  // Modal Sửa Phòng Thi State
  const [hienThiModalSuaPhong, setHienThiModalSuaPhong] = useState<boolean>(false);
  const [phongDangSua, setPhongDangSua] = useState<PhongThi | null>(null);

  // Đổi trạng thái phòng thi (Bắt đầu / Tạm dừng / Tiếp tục / Khóa / Mở / Kết thúc)
  const xuLyDoiTrangThaiPhong = (phongId: string, trangThaiMoi: 'CHO_BAT_DAU' | 'DANG_THI' | 'TAM_DUNG' | 'KHOA' | 'DA_KET_THUC') => {
    setDanhSachPhongThiLocal((prev) =>
      prev.map((p) => (p.id === phongId ? { ...p, trangThai: trangThaiMoi } : p))
    );
    const tenTrangThai =
      trangThaiMoi === 'DANG_THI'
        ? 'Đang thi'
        : trangThaiMoi === 'TAM_DUNG'
        ? 'Tạm dừng'
        : trangThaiMoi === 'KHOA'
        ? 'Đã khóa'
        : trangThaiMoi === 'DA_KET_THUC'
        ? 'Đã kết thúc'
        : 'Chờ bắt đầu';

    onHienThiToast('Cập nhật phòng thi', `Đã chuyển trạng thái phòng thành [${tenTrangThai}].`, 'info');
  };

  // Cập nhật trạng thái hàng loạt cho các phòng được tích chọn
  const xuLyCapNhatTrangThaiHangLoat = (trangThaiMoi: 'CHO_BAT_DAU' | 'DANG_THI' | 'TAM_DUNG' | 'KHOA' | 'DA_KET_THUC') => {
    if (danhSachPhongDaChon.length === 0) return;
    setDanhSachPhongThiLocal((prev) =>
      prev.map((p) => (danhSachPhongDaChon.includes(p.id) ? { ...p, trangThai: trangThaiMoi } : p))
    );
    onHienThiToast(
      'Cập nhật hàng loạt',
      `Đã áp dụng trạng thái mới cho ${danhSachPhongDaChon.length} phòng thi được chọn.`,
      'success'
    );
    setDanhSachPhongDaChon([]);
  };

  // Xóa đơn lẻ 1 phòng thi
  const xuLyXoaPhong = (phongId: string) => {
    setDanhSachPhongThiLocal((prev) => prev.filter((p) => p.id !== phongId));
    setDanhSachPhongDaChon((prev) => prev.filter((id) => id !== phongId));
    if (onXoaPhongThi) onXoaPhongThi(phongId);
    onHienThiToast('Đã xóa phòng thi', 'Đã xóa phòng thi khỏi danh sách.', 'warning');
  };

  // Xóa hàng loạt các phòng thi được chọn
  const xuLyXoaHangLoat = () => {
    if (danhSachPhongDaChon.length === 0) return;
    setDanhSachPhongThiLocal((prev) => prev.filter((p) => !danhSachPhongDaChon.includes(p.id)));
    onHienThiToast('Xóa hàng loạt', `Đã xóa ${danhSachPhongDaChon.length} phòng thi được chọn.`, 'warning');
    setDanhSachPhongDaChon([]);
  };

  // Mở modal sửa phòng
  const xuLyMoModalSuaPhong = (phong: PhongThi) => {
    setPhongDangSua({ ...phong });
    setHienThiModalSuaPhong(true);
  };

  // Lưu sửa thông tin phòng thi
  const xuLyLuuSuaPhong = () => {
    if (!phongDangSua) return;
    const checkMa = kiemTraMaPhongHopLe(phongDangSua.maPhong);
    if (!checkMa.hopLe) {
      onHienThiToast('Mã phòng chưa hợp lệ', checkMa.loi || 'Mã phòng phải >= 4 ký tự liền nhau, không dấu cách.', 'error');
      return;
    }
    setDanhSachPhongThiLocal((prev) =>
      prev.map((p) => (p.id === phongDangSua.id ? phongDangSua : p))
    );
    setHienThiModalSuaPhong(false);
    onHienThiToast('Thành công', `Đã cập nhật thông tin phòng thi [${phongDangSua.maPhong}].`, 'success');
  };

  // Khi thay đổi Đề thi chính được chọn -> Tự động điền dữ liệu tương ứng (và hỗ trợ sửa)
  const xuLyChonBaiKiemTraChinh = (id: string) => {
    setBaiKiemTraChonId(id);
    const selected = danhSachBaiKiemTra.find((b) => b.id === id);
    if (selected) {
      setTenBaiKiemTraPhongForm(selected.tenBaiKiemTra);
      setMonHocPhongForm(selected.monHoc);
      setThoiLuongPhongForm(selected.thoiLuongPhut);
    }
  };

  // Mở Modal Tạo Bài mới
  const xuLyMoModalTaoBai = () => {
    setBuocTaoBai(1);
    setLoaiBaiChon('TRAC_NGHIEM');
    setHienThiModalTaoBai(true);
  };

  // Mở Modal Tạo Phòng mới (Reset về Bước 1)
  const xuLyMoModalTaoPhong = () => {
    setBuocTaoPhong(1);
    setMaPhongForm(taoMaPhongTuDong());
    setCheDoTaoMa('TU_DONG');
    const firstExam = danhSachBaiKiemTra[0];
    if (firstExam) {
      setBaiKiemTraChonId(firstExam.id);
      setTenBaiKiemTraPhongForm(firstExam.tenBaiKiemTra);
      setMonHocPhongForm(firstExam.monHoc);
      setThoiLuongPhongForm(firstExam.thoiLuongPhut);
    }
    setHienThiModalTaoPhong(true);
  };

  // Lưu Bài Kiểm Tra ở Bước 3
  const xuLyLuuBaiKiemTra = () => {
    const baiMoi: BaiKiemTra = {
      id: `exam-new-${Date.now()}`,
      tenBaiKiemTra: tenBaiForm,
      monHoc: monHocForm,
      loai: loaiBaiChon,
      thoiLuongPhut: thoiLuongForm,
      tongSoCau: 40,
      tongDiem: tongDiemForm,
      tronCauHoi: false,
      tronDapAn: false,
      nganHangCauHoi: 'Ngân hàng đề CNTT UNETI 2026',
      danhSachCauHoi: [],
      fileDeTuLuan: fileDeThiForm ? {
        tenFile: fileDeThiForm.tenFile,
        kichThuoc: fileDeThiForm.kichThuoc,
        duongDan: fileDeThiForm.duongDan
      } : undefined,
      ngayTao: new Date().toISOString().split('T')[0],
      nguoiTao: 'TS. Trần Văn Nam',
      trangThai: 'DA_PHAT_HANH'
    };

    onTaoBaiKiemTra(baiMoi);
    setHienThiModalTaoBai(false);
    onHienThiToast('Thành công', `Đã khởi tạo đề thi "${baiMoi.tenBaiKiemTra}".`, 'success');
  };

  // Lưu Phòng Thi ở Bước 3
  const xuLyLuuPhongThi = () => {
    const checkMa = kiemTraMaPhongHopLe(maPhongForm);
    if (!checkMa.hopLe) {
      onHienThiToast('Mã phòng chưa hợp lệ', checkMa.loi || 'Mã phòng phải >= 4 ký tự liền nhau, không dấu cách.', 'error');
      return;
    }

    const baiKiemTraChon = danhSachBaiKiemTra.find((b) => b.id === baiKiemTraChonId) || danhSachBaiKiemTra[0];
    const phongMoi: PhongThi = {
      id: `room-new-${Date.now()}`,
      maPhong: chuanHoaMaPhong(maPhongForm),
      tenPhong: tenPhongForm,
      monHoc: monHocPhongForm || baiKiemTraChon.monHoc,
      baiKiemTraId: baiKiemTraChon.id,
      tenBaiKiemTra: tenBaiKiemTraPhongForm || baiKiemTraChon.tenBaiKiemTra,
      giangVienPhuTach: 'TS. Trần Văn Nam',
      ngayThi: new Date().toISOString().split('T')[0],
      gioBatDau: '08:00',
      gioKetThuc: '09:30',
      thoiLuongPhut: thoiLuongPhongForm || baiKiemTraChon.thoiLuongPhut,
      tongSinhVien: danhSachSVDaChon.length,
      daVao: 0,
      dangLam: 0,
      daNop: 0,
      matKetNoi: 0,
      trangThai: 'CHO_BAT_DAU',
      soLuongDe: soLuongDePhong,
      baiKiemTraPhuId: soLuongDePhong === 2 ? baiKiemTraPhuId : undefined,
      tronCauHoi: tronCauHoiPhong,
      tronDapAn: tronDapAnPhong,
      choXemDiem: choXemDiemPhong,
      phamViThi: phamViThiForm,
      danhSachSinhVien: danhSachSinhVien.map((sv) => ({
        maSinhVien: sv.maDinhDanh,
        hoTen: sv.hoTen,
        lop: sv.lopHoacChucVu || 'K15',
        khoa: sv.khoa,
        trangThaiKetNoi: 'OFFLINE',
        trangThaiLamBai: 'CHUA_VAO',
        soCauDaLam: 0,
        tongSoCau: 40,
        thoiGianConLaiSeconds: (thoiLuongPhongForm || baiKiemTraChon.thoiLuongPhut) * 60,
        lanMoiNhatPing: 'Chưa vào'
      }))
    };

    onTaoPhongThi(phongMoi);
    setHienThiModalTaoPhong(false);
    onHienThiToast('Thành công', `Đã khởi tạo phòng thi [${phongMoi.maPhong}] - ${phongMoi.tenPhong}.`, 'success');
  };

  // Filter Đề Thi theo loại Trắc Nghiệm / Tự Luận
  const danhSachBaiLoc = danhSachBaiKiemTra.filter((b) => {
    if (locLoaiBai === 'TRAC_NGHIEM') return b.loai === 'TRAC_NGHIEM';
    if (locLoaiBai === 'TU_LUAN') return b.loai === 'TU_LUAN';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ------------------------------------------------------------ */}
      {/* KHUNG HÀNH ĐỘNG TƯƠNG ỨNG VỚI TAB ĐANG CHỌN (1 NÚT MỞ MODAL NỔI GIỮA) */}
      {/* ------------------------------------------------------------ */}
      {tabHienTai === 'BAI_KIEM_TRA' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderLeft: '5px solid var(--primary)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileText size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Quản lý & Khởi tạo Bài kiểm tra / Đề thi
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                Tạo đề thi 3 bước chuẩn hóa (Trắc nghiệm/Tự luận), cài đặt thời gian & đăng tải file đề PDF/Word.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={xuLyMoModalTaoBai}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 114, 245, 0.3)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <FileText size={18} />
            + Tạo Bài Kiểm Tra Mới
          </button>
        </div>
      )}

      {tabHienTai === 'PHONG_THI' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderLeft: '5px solid var(--success)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Plus size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Quản lý & Khởi tạo Phòng thi LAN/Cloud
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                Tạo phòng thi với Mã phòng thi chuẩn (viết liền, không dấu cách), gán đề thi & mở phòng cho sinh viên.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={xuLyMoModalTaoPhong}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--success)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <Plus size={18} />
            + Tạo Phòng Thi Mới
          </button>
        </div>
      )}

      {/* TAB 1: DANH SÁCH BÀI KIỂM TRA */}
      {tabHienTai === 'BAI_KIEM_TRA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Thanh lọc loại đề thi */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              className={locLoaiBai === 'TAT_CA' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '13px' }}
              onClick={() => setLocLoaiBai('TAT_CA')}
            >
              Tất cả đề thi ({danhSachBaiKiemTra.length})
            </button>
            <button
              type="button"
              className={locLoaiBai === 'TRAC_NGHIEM' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '13px' }}
              onClick={() => setLocLoaiBai('TRAC_NGHIEM')}
            >
              📝 Bài thi Trắc nghiệm
            </button>
            <button
              type="button"
              className={locLoaiBai === 'TU_LUAN' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '13px' }}
              onClick={() => setLocLoaiBai('TU_LUAN')}
            >
              📄 Bài thi Tự luận
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {danhSachBaiLoc.map((bai) => (
              <div
                key={bai.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className={bai.loai === 'TRAC_NGHIEM' ? 'badge badge-primary' : 'badge badge-warning'}>
                      ● {bai.loai === 'TRAC_NGHIEM' ? 'Trắc nghiệm' : bai.loai === 'TU_LUAN' ? 'Tự luận' : 'Kết hợp'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bai.ngayTao}</span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    {bai.tenBaiKiemTra}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, margin: '0 0 12px' }}>
                    Môn: {bai.monHoc}
                  </p>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>⏱ Thời lượng: <b>{bai.thoiLuongPhut} phút</b></div>
                    <div>💯 Thang điểm: <b>{bai.tongDiem} điểm</b></div>
                    {bai.fileDeTuLuan && (
                      <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                        📄 Đề đính kèm: {bai.fileDeTuLuan.tenFile}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" style={{ fontSize: '13px', padding: '6px 14px' }}>
                    <Eye size={14} /> Xem đề thi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DANH SÁCH PHÒNG THI (TÍCH CHỌN HÀNG LOẠT & THAO TÁC LINH HOẠT) */}
      {tabHienTai === 'PHONG_THI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* BAR THAO TÁC HÀNG LOẠT KHI TÍCH CHỌN NHIỀU PHÒNG */}
          {danhSachPhongDaChon.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary)',
                borderRadius: '14px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                ☑ Đã chọn <b>{danhSachPhongDaChon.length}</b> phòng thi
              </span>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => xuLyCapNhatTrangThaiHangLoat('CHO_BAT_DAU')}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Unlock size={14} /> Mở phòng
                </button>
                <button
                  type="button"
                  onClick={() => xuLyCapNhatTrangThaiHangLoat('KHOA')}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Lock size={14} /> Khóa phòng
                </button>
                <button
                  type="button"
                  onClick={() => xuLyCapNhatTrangThaiHangLoat('DANG_THI')}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: 'var(--success)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Play size={14} /> Bắt đầu thi
                </button>
                <button
                  type="button"
                  onClick={() => xuLyCapNhatTrangThaiHangLoat('TAM_DUNG')}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: 'var(--warning)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pause size={14} /> Tạm dừng
                </button>
                <button
                  type="button"
                  onClick={() => xuLyCapNhatTrangThaiHangLoat('DA_KET_THUC')}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Square size={14} /> Kết thúc thi
                </button>
                <button
                  type="button"
                  onClick={xuLyXoaHangLoat}
                  style={{ padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Xóa các phòng chọn
                </button>
              </div>
            </div>
          )}

          {/* BẢNG PHÒNG THI VỚI CHECKBOX & CÁC NÚT ĐIỀU KHIỂN */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '46px', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0 16px', width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={danhSachPhongThiLocal.length > 0 && danhSachPhongDaChon.length === danhSachPhongThiLocal.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDanhSachPhongDaChon(danhSachPhongThiLocal.map((p) => p.id));
                      } else {
                        setDanhSachPhongDaChon([]);
                      }
                    }}
                  />
                </th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>MÃ PHÒNG</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>TÊN PHÒNG THI</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>ĐỀ THI</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>THỜI LƯỢNG</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>TRẠNG THÁI</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {danhSachPhongThiLocal.map((p) => (
                <tr key={p.id} style={{ height: '60px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: danhSachPhongDaChon.includes(p.id) ? 'var(--primary-subtle)' : 'transparent' }}>
                  <td style={{ padding: '0 16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={danhSachPhongDaChon.includes(p.id)}
                      onChange={() => {
                        if (danhSachPhongDaChon.includes(p.id)) {
                          setDanhSachPhongDaChon(danhSachPhongDaChon.filter((id) => id !== p.id));
                        } else {
                          setDanhSachPhongDaChon([...danhSachPhongDaChon, p.id]);
                        }
                      }}
                    />
                  </td>
                  <td style={{ padding: '0 16px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                    {chuanHoaMaPhong(p.maPhong)}
                  </td>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.tenPhong}</td>
                  <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{p.tenBaiKiemTra}</td>
                  <td style={{ padding: '0 16px', fontSize: '13px', textAlign: 'center' }}>{p.thoiLuongPhut} phút</td>
                  <td style={{ padding: '0 16px', textAlign: 'center' }}>
                    <span
                      className={
                        p.trangThai === 'DANG_THI'
                          ? 'badge badge-success'
                          : p.trangThai === 'TAM_DUNG'
                          ? 'badge badge-warning'
                          : p.trangThai === 'KHOA'
                          ? 'badge badge-danger'
                          : p.trangThai === 'DA_KET_THUC'
                          ? 'badge badge-neutral'
                          : 'badge badge-primary'
                      }
                    >
                      ● {p.trangThai === 'DANG_THI' ? 'Đang thi' : p.trangThai === 'TAM_DUNG' ? 'Tạm dừng' : p.trangThai === 'KHOA' ? 'Đã khóa' : p.trangThai === 'DA_KET_THUC' ? 'Đã kết thúc' : 'Chờ bắt đầu'}
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12.5px' }}
                        onClick={() => onChuyenToiGiamSat(p.id)}
                      >
                        Giám sát
                      </button>

                      {/* Các nút điều khiển trạng thái phòng */}
                      {p.trangThai === 'CHO_BAT_DAU' && (
                        <>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Bắt đầu thi"
                            style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--success)', borderColor: 'var(--success-light)' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'DANG_THI')}
                          >
                            <Play size={14} /> Bắt đầu
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Khóa phòng"
                            style={{ padding: '6px 8px', fontSize: '12px', color: 'var(--danger)' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'KHOA')}
                          >
                            <Lock size={14} />
                          </button>
                        </>
                      )}

                      {p.trangThai === 'DANG_THI' && (
                        <>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Tạm dừng"
                            style={{ padding: '6px 8px', fontSize: '12px', color: 'var(--warning)' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'TAM_DUNG')}
                          >
                            <Pause size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Kết thúc thi"
                            style={{ padding: '6px 8px', fontSize: '12px', color: 'var(--text-secondary)' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'DA_KET_THUC')}
                          >
                            <Square size={14} />
                          </button>
                        </>
                      )}

                      {p.trangThai === 'TAM_DUNG' && (
                        <>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Tiếp tục thi"
                            style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--success)' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'DANG_THI')}
                          >
                            <Play size={14} /> Tiếp tục
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            title="Kết thúc thi"
                            style={{ padding: '6px 8px', fontSize: '12px' }}
                            onClick={() => xuLyDoiTrangThaiPhong(p.id, 'DA_KET_THUC')}
                          >
                            <Square size={14} />
                          </button>
                        </>
                      )}

                      {p.trangThai === 'KHOA' && (
                        <button
                          type="button"
                          className="btn-secondary"
                          title="Mở phòng"
                          style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--primary)' }}
                          onClick={() => xuLyDoiTrangThaiPhong(p.id, 'CHO_BAT_DAU')}
                        >
                          <Unlock size={14} /> Mở phòng
                        </button>
                      )}

                      {p.trangThai === 'DA_KET_THUC' && (
                        <button
                          type="button"
                          className="btn-secondary"
                          title="Mở lại phòng"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          onClick={() => xuLyDoiTrangThaiPhong(p.id, 'CHO_BAT_DAU')}
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}

                      {/* Nút Sửa Phòng */}
                      <button
                        type="button"
                        className="btn-secondary"
                        title="Chỉnh sửa phòng thi"
                        style={{ padding: '6px 8px', fontSize: '12px' }}
                        onClick={() => xuLyMoModalSuaPhong(p)}
                      >
                        <Edit size={14} />
                      </button>

                      {/* Nút Xóa Phòng */}
                      <button
                        type="button"
                        className="btn-secondary"
                        title="Xóa phòng thi"
                        style={{ padding: '6px 8px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                        onClick={() => xuLyXoaPhong(p.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3 BƯỚC: TẠO BÀI KIỂM TRA (VÀO ĐỀ THI) */}
      {/* ============================================================ */}
      {hienThiModalTaoBai && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '24px', width: '780px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            
            {/* Header & Thanh Tiến Trình Stepper 3 Bước (Cố định ở đỉnh) */}
            <div style={{ padding: '24px 28px 16px 28px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '4px' }}>TẠO BÀI KIỂM TRA ĐỀ THI</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Bước {buocTaoBai} / 3: {buocTaoBai === 1 ? 'Chọn loại đề thi' : buocTaoBai === 2 ? 'Thiết lập thông tin & Đăng tải đề' : 'Kiểm tra lại & Xem trước'}
                  </h2>
                </div>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setHienThiModalTaoBai(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Thanh Tiến Trình 3 Bước Visual Stepper */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', position: 'relative' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoBai >= 1 ? 'var(--primary-light)' : 'var(--bg-surface-subtle)', color: buocTaoBai >= 1 ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoBai >= 1 ? 'var(--primary)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
                  1. Chọn loại đề
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoBai >= 2 ? 'var(--primary-light)' : 'var(--bg-surface-subtle)', color: buocTaoBai >= 2 ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoBai >= 2 ? 'var(--primary)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
                  2. Thiết lập & Đăng đề
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoBai === 3 ? 'var(--primary-light)' : 'var(--bg-surface-subtle)', color: buocTaoBai === 3 ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoBai === 3 ? 'var(--primary)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
                  3. Xem trước & Lưu đề
                </div>
              </div>
            </div>

            {/* NỘI DUNG CUỘN ĐỌC TỰ DO (SCROLLABLE BODY) */}
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              {/* BƯỚC 1: CHỌN LOẠI ĐỀ THI */}
              {buocTaoBai === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div
                    onClick={() => setLoaiBaiChon('TRAC_NGHIEM')}
                    style={{
                      border: loaiBaiChon === 'TRAC_NGHIEM' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: loaiBaiChon === 'TRAC_NGHIEM' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckSquare size={36} color="var(--primary)" style={{ marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Thi Trắc Nghiệm</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Ngân hàng câu hỏi trắc nghiệm A, B, C, D tự động chấm điểm.</p>
                  </div>

                  <div
                    onClick={() => setLoaiBaiChon('TU_LUAN')}
                    style={{
                      border: loaiBaiChon === 'TU_LUAN' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: loaiBaiChon === 'TU_LUAN' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <FileCode size={36} color="var(--warning)" style={{ marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Thi Tự Luận</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Đăng tải đề PDF/Word, sinh viên nộp bài file nén .zip/.rar.</p>
                  </div>

                  <div
                    onClick={() => setLoaiBaiChon('KET_HOP')}
                    style={{
                      border: loaiBaiChon === 'KET_HOP' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: loaiBaiChon === 'KET_HOP' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={36} color="var(--success)" style={{ marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>Kết Hợp Cả Hai</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Vừa thi phần Trắc nghiệm trực tuyến vừa thi phần Tự luận.</p>
                  </div>
                </div>
              )}

              {/* BƯỚC 2: THIẾT LẬP THÔNG TIN & ĐĂNG ĐỀ */}
              {buocTaoBai === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tên bài kiểm tra / Đề thi *</label>
                      <input type="text" className="input-custom" style={{ width: '100%' }} value={tenBaiForm} onChange={(e) => setTenBaiForm(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mã bài kiểm tra / Mã đề *</label>
                      <input type="text" className="input-custom" style={{ width: '100%', fontWeight: 700, textTransform: 'uppercase' }} value={maBaiForm} onChange={(e) => setMaBaiForm(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Môn học *</label>
                      <input type="text" className="input-custom" style={{ width: '100%' }} value={monHocForm} onChange={(e) => setMonHocForm(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Thời lượng (phút) *</label>
                      <input type="number" className="input-custom" style={{ width: '100%' }} value={thoiLuongForm} onChange={(e) => setThoiLuongForm(Number(e.target.value))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tổng thang điểm *</label>
                      <input type="number" className="input-custom" style={{ width: '100%' }} value={tongDiemForm} onChange={(e) => setTongDiemForm(Number(e.target.value))} />
                    </div>
                  </div>

                  {/* Khung Đăng Tải Đề Thi Word / PDF */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Đăng tải File Đề Thi (.PDF hoặc .DOCX Word)</label>
                    <div
                      style={{
                        border: '2px dashed var(--primary)',
                        borderRadius: '14px',
                        padding: '24px',
                        backgroundColor: 'var(--primary-subtle)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setFileDeThiForm({ tenFile: 'DeThiChinhThuc_CoSoDuLieu_2026.pdf', kichThuoc: '2.4 MB', duongDan: '#' })}
                    >
                      <Upload size={32} color="var(--primary)" style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {fileDeThiForm ? `● Đã chọn: ${fileDeThiForm.tenFile} (${fileDeThiForm.kichThuoc})` : 'Bấm vào đây để đăng tải file đề thi (.pdf / .docx)'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BƯỚC 3: KIỂM TRA LẠI & XEM TRƯỚC (PREVIEW & SAVE) */}
              {buocTaoBai === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Summary Info Card */}
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>Tên đề thi: <b>{tenBaiForm}</b></div>
                    <div>Mã đề: <b>{maBaiForm}</b></div>
                    <div>Môn học: <b>{monHocForm}</b></div>
                    <div>Thời lượng: <b>{thoiLuongForm} phút</b></div>
                    <div>Loại đề thi: <b style={{ color: 'var(--primary)' }}>{loaiBaiChon}</b></div>
                    <div>Thang điểm: <b>{tongDiemForm} điểm</b></div>
                  </div>

                  {/* Inline Previewer của Đề Thi Đã Đăng Tải */}
                  <div style={{ padding: '20px', backgroundColor: 'var(--bg-app)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="badge badge-neutral">Trình Xem Trước Đề Thi Gốc</span>
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700 }}>✓ File đã hợp lệ</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>{tenBaiForm}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      <b>Câu 1:</b> Phân tích các dạng chuẩn dữ liệu 1NF, 2NF, 3NF và cho ví dụ minh họa.
                      <br />
                      <b>Câu 2:</b> Viết câu lệnh SQL truy vấn và tối ưu hóa chỉ mục Index.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION BUTTONS FOOTER CỐ ĐỊNH Ở ĐÁY MODAL */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Bên Trái: Nút Hủy */}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setHienThiModalTaoBai(false)}
                style={{ padding: '10px 20px', color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
              >
                Hủy tạo đề
              </button>

              {/* Phía Phải: Nút Tiếp Theo (Bước 1->2, 2->3) hoặc Lưu Đề (Bước 3) */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {buocTaoBai > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBuocTaoBai((prev) => (prev - 1) as 1 | 2 | 3)}
                    style={{ padding: '10px 20px' }}
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                )}

                {buocTaoBai < 3 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setBuocTaoBai((prev) => (prev + 1) as 1 | 2 | 3)}
                    style={{ padding: '10px 24px', fontWeight: 700 }}
                  >
                    Tiếp theo <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={xuLyLuuBaiKiemTra}
                    style={{ padding: '10px 28px', fontWeight: 800, backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    <FileCheck size={18} /> LƯU ĐỀ THI
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3 BƯỚC: TẠO PHÒNG THI MỚI */}
      {/* ============================================================ */}
      {hienThiModalTaoPhong && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '24px', width: '760px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            
            {/* Header & Thanh Tiến Trình Stepper 3 Bước (Cố định ở đỉnh) */}
            <div style={{ padding: '24px 28px 16px 28px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-success" style={{ marginBottom: '4px' }}>TẠO PHÒNG THI MỚI</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Bước {buocTaoPhong} / 3: {buocTaoPhong === 1 ? 'Khởi tạo Mã & Tên phòng thi' : buocTaoPhong === 2 ? 'Chọn Đề thi & Cấu hình tổ chức' : 'Kiểm tra lại & Kích hoạt phòng'}
                  </h2>
                </div>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setHienThiModalTaoPhong(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Visual Stepper Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoPhong >= 1 ? 'var(--success-light)' : 'var(--bg-surface-subtle)', color: buocTaoPhong >= 1 ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoPhong >= 1 ? 'var(--success)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
                  1. Mã & Tên phòng
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoPhong >= 2 ? 'var(--success-light)' : 'var(--bg-surface-subtle)', color: buocTaoPhong >= 2 ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoPhong >= 2 ? 'var(--success)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
                  2. Chọn đề & Cấu hình
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: buocTaoPhong === 3 ? 'var(--success-light)' : 'var(--bg-surface-subtle)', color: buocTaoPhong === 3 ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: buocTaoPhong === 3 ? 'var(--success)' : 'var(--border-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
                  3. Xem lại & Kích hoạt
                </div>
              </div>
            </div>

            {/* NỘI DUNG FORM SCROLLABLE BODY */}
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              {/* BƯỚC 1: MÃ PHÒNG THI, TÊN PHÒNG THI & PHẠM VI THI */}
              {buocTaoPhong === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Tên Phòng Thi *</label>
                    <input
                      type="text"
                      className="input-custom"
                      style={{ width: '100%', fontSize: '15px', fontWeight: 600 }}
                      value={tenPhongForm}
                      onChange={(e) => setTenPhongForm(e.target.value)}
                      placeholder="Ví dụ: Phòng Máy 105 - Tòa A (Hà Nội)"
                    />
                  </div>

                  {/* Chọn Phạm Vi Tổ Chức Thi (LAN hoặc Internet) */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 800, display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Phạm Vi Tổ Chức Thi *
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div
                        onClick={() => setPhamViThiForm('LAN')}
                        style={{
                          padding: '16px',
                          borderRadius: '14px',
                          border: phamViThiForm === 'LAN' ? '2px solid var(--success)' : '1px solid var(--border-color)',
                          backgroundColor: phamViThiForm === 'LAN' ? 'var(--success-light)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--success)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                          }}
                        >
                          🖥️
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>Mạng LAN nội bộ</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Thi tại phòng máy UNETI, kết nối tại chỗ.</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPhamViThiForm('INTERNET')}
                        style={{
                          padding: '16px',
                          borderRadius: '14px',
                          border: phamViThiForm === 'INTERNET' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: phamViThiForm === 'INTERNET' ? 'var(--primary-light)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                          }}
                        >
                          🌐
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>Mạng Cloud / Internet</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Thi trực tuyến mọi lúc mọi nơi qua Cloud.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khung cấu hình Mã Phòng Thi */}
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <label style={{ fontSize: '14px', fontWeight: 800, display: 'block', marginBottom: '12px', color: 'var(--text-primary)' }}>
                      Cấu hình Mã Phòng Thi:
                    </label>
                    
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                        <input
                          type="radio"
                          name="cheDoTaoMa"
                          checked={cheDoTaoMa === 'TU_DONG'}
                          onChange={() => {
                            setCheDoTaoMa('TU_DONG');
                            setMaPhongForm(taoMaPhongTuDong());
                          }}
                        />
                        Tự động sinh mã chuẩn
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                        <input
                          type="radio"
                          name="cheDoTaoMa"
                          checked={cheDoTaoMa === 'THU_CONG'}
                          onChange={() => setCheDoTaoMa('THU_CONG')}
                        />
                        Tự nhập mã thủ công
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="text"
                        className="input-custom"
                        style={{
                          width: '100%',
                          fontWeight: 800,
                          fontSize: '18px',
                          color: 'var(--success)',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          textAlign: 'center'
                        }}
                        value={maPhongForm}
                        disabled={cheDoTaoMa === 'TU_DONG'}
                        onChange={(e) => setMaPhongForm(chuanHoaMaPhong(e.target.value))}
                      />
                      {cheDoTaoMa === 'TU_DONG' && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
                          onClick={() => setMaPhongForm(taoMaPhongTuDong())}
                        >
                          Sinh mã mới 🎲
                        </button>
                      )}
                    </div>

                    {!kiemTraMaValid.hopLe ? (
                      <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', margin: '8px 0 0', fontWeight: 600 }}>
                        ⚠️ {kiemTraMaValid.loi}
                      </p>
                    ) : (
                      <p style={{ fontSize: '12px', color: 'var(--success)', marginTop: '8px', margin: '8px 0 0', fontWeight: 600 }}>
                        ✓ Mã phòng hợp lệ (viết liền, không dấu cách, từ 4 ký tự trở lên).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* BƯỚC 2: CHỌN ĐỀ THI & CẤU HÌNH TỔ CHỨC THI */}
              {buocTaoPhong === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Lựa chọn 1 đề hay 2 đề */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Chế độ Đề thi trong phòng *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setSoLuongDePhong(1)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: soLuongDePhong === 1 ? '2px solid var(--success)' : '1px solid var(--border-color)',
                          backgroundColor: soLuongDePhong === 1 ? 'var(--success-light)' : 'var(--bg-surface)',
                          color: soLuongDePhong === 1 ? 'var(--success)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        📝 Sử dụng 1 Đề thi chung
                      </button>
                      <button
                        type="button"
                        onClick={() => setSoLuongDePhong(2)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: soLuongDePhong === 2 ? '2px solid var(--success)' : '1px solid var(--border-color)',
                          backgroundColor: soLuongDePhong === 2 ? 'var(--success-light)' : 'var(--bg-surface)',
                          color: soLuongDePhong === 2 ? 'var(--success)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        📄📄 Sử dụng 2 Đề thi (Đề Chẵn / Lẻ)
                      </button>
                    </div>
                  </div>

                  {/* Chọn Mã đề trong kho */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      {soLuongDePhong === 1 ? 'Chọn Mã đề / Bài kiểm tra trong kho *' : 'Chọn Mã đề 1 (Đề Chẵn) *'}
                    </label>
                    <select
                      className="input-custom"
                      style={{ width: '100%', fontWeight: 700, fontSize: '14px' }}
                      value={baiKiemTraChonId}
                      onChange={(e) => xuLyChonBaiKiemTraChinh(e.target.value)}
                    >
                      {danhSachBaiKiemTra.map((b) => (
                        <option key={b.id} value={b.id}>
                          [{b.id}] - {b.tenBaiKiemTra} ({b.monHoc} | {b.loai === 'TRAC_NGHIEM' ? 'Trắc nghiệm' : b.loai === 'TU_LUAN' ? 'Tự luận' : 'Kết hợp'} - {b.thoiLuongPhut} phút)
                        </option>
                      ))}
                    </select>
                  </div>

                  {soLuongDePhong === 2 && (
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Chọn Mã đề 2 (Đề Lẻ) *</label>
                      <select
                        className="input-custom"
                        style={{ width: '100%', fontWeight: 700, fontSize: '14px' }}
                        value={baiKiemTraPhuId}
                        onChange={(e) => setBaiKiemTraPhuId(e.target.value)}
                      >
                        {danhSachBaiKiemTra.map((b) => (
                          <option key={b.id} value={b.id}>
                            [{b.id}] - {b.tenBaiKiemTra} ({b.monHoc} | {b.loai === 'TRAC_NGHIEM' ? 'Trắc nghiệm' : 'Tự luận'} - {b.thoiLuongPhut} phút)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Các trường tự động hiển thị khi chọn Mã đề (Cho phép chỉnh sửa!) */}
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span className="badge badge-primary" style={{ width: 'fit-content' }}>Thông tin tự động nạp từ Đề thi (Có thể chỉnh sửa)</span>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tên bài kiểm tra</label>
                        <input
                          type="text"
                          className="input-custom"
                          style={{ width: '100%', fontSize: '13px' }}
                          value={tenBaiKiemTraPhongForm}
                          onChange={(e) => setTenBaiKiemTraPhongForm(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Môn học</label>
                        <input
                          type="text"
                          className="input-custom"
                          style={{ width: '100%', fontSize: '13px' }}
                          value={monHocPhongForm}
                          onChange={(e) => setMonHocPhongForm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Thời lượng thi áp dụng cho phòng (phút)</label>
                      <input
                        type="number"
                        className="input-custom"
                        style={{ width: '100%', fontSize: '13px', fontWeight: 700 }}
                        value={thoiLuongPhongForm}
                        onChange={(e) => setThoiLuongPhongForm(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Tùy chọn cấu hình thi bên dưới */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: 'var(--bg-app)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>Quy tắc & Tùy chọn bài làm sinh viên:</label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={tronCauHoiPhong}
                        onChange={(e) => setTronCauHoiPhong(e.target.checked)}
                      />
                      🔀 Đảo thứ tự câu hỏi ngẫu nhiên (Trộn đề thi)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={tronDapAnPhong}
                        onChange={(e) => setTronDapAnPhong(e.target.checked)}
                      />
                      🔤 Đảo vị trí các đáp án (A, B, C, D) ngẫu nhiên
                    </label>

                    {danhSachBaiKiemTra.find((b) => b.id === baiKiemTraChonId)?.loai !== 'TU_LUAN' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                        <input
                          type="checkbox"
                          checked={choXemDiemPhong}
                          onChange={(e) => setChoXemDiemPhong(e.target.checked)}
                        />
                        👁️ Cho phép sinh viên xem điểm thi ngay sau khi nộp bài (Trắc nghiệm)
                      </label>
                    ) : (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        ℹ️ Đề thi tự luận cần giảng viên chấm điểm thủ công, tùy chọn xem điểm tức thì không khả dụng.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BƯỚC 3: KIỂM TRA LẠI (PREVIEW & XÁC NHẬN - READ ONLY) */}
              {buocTaoPhong === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>Mã phòng thi: <b style={{ color: 'var(--success)', fontSize: '15px' }}>{maPhongForm}</b></div>
                    <div>Tên phòng thi: <b>{tenPhongForm}</b></div>
                    <div>Phạm vi tổ chức: <b style={{ color: phamViThiForm === 'LAN' ? 'var(--success)' : 'var(--primary)' }}>{phamViThiForm === 'LAN' ? '🖥️ Mạng LAN nội bộ' : '🌐 Mạng Internet / Cloud'}</b></div>
                    <div>Tên bài kiểm tra: <b>{tenBaiKiemTraPhongForm}</b></div>
                    <div>Môn học: <b>{monHocPhongForm}</b></div>
                    <div>Thời lượng làm bài: <b>{thoiLuongPhongForm} phút</b></div>
                    <div>Chế độ đề: <b>{soLuongDePhong === 1 ? '1 Đề thi chung' : '2 Đề thi (Chẵn/Lẻ)'}</b></div>
                    <div>Đảo thứ tự câu hỏi: <b style={{ color: tronCauHoiPhong ? 'var(--success)' : 'var(--text-secondary)' }}>{tronCauHoiPhong ? '✓ Đã bật' : '✗ Tắt'}</b></div>
                    <div>Đảo đáp án A,B,C,D: <b style={{ color: tronDapAnPhong ? 'var(--success)' : 'var(--text-secondary)' }}>{tronDapAnPhong ? '✓ Đã bật' : '✗ Tắt'}</b></div>
                    <div>Cho xem điểm sau nộp: <b style={{ color: choXemDiemPhong && danhSachBaiKiemTra.find((b) => b.id === baiKiemTraChonId)?.loai !== 'TU_LUAN' ? 'var(--primary)' : 'var(--text-secondary)' }}>{choXemDiemPhong && danhSachBaiKiemTra.find((b) => b.id === baiKiemTraChonId)?.loai !== 'TU_LUAN' ? '✓ Cho phép xem' : '✗ Không xem'}</b></div>
                  </div>

                  {/* Trình xem trước đề được gán vào phòng */}
                  <div style={{ padding: '18px', backgroundColor: 'var(--bg-app)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-neutral">Trình Xem Trước Đề Thi Đã Gán Vào Phòng</span>
                      <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700 }}>✓ Sẵn sàng phát hành</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                      {tenBaiKiemTraPhongForm} - ({monHocPhongForm})
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      <b>Nội dung trích yếu:</b> Đề thi trắc nghiệm & tự luận được kiểm tra cấu hình tự động. Tất cả sinh viên tham gia phòng [{maPhongForm}] sẽ được cấp đề thi theo các thiết lập trên.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION BUTTONS FOOTER CỐ ĐỊNH Ở ĐÁY MODAL */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setHienThiModalTaoPhong(false)}
                style={{ padding: '10px 20px', color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
              >
                Hủy tạo phòng
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {buocTaoPhong > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBuocTaoPhong((prev) => (prev - 1) as 1 | 2 | 3)}
                    style={{ padding: '10px 20px' }}
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                )}

                {buocTaoPhong < 3 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={buocTaoPhong === 1 && !kiemTraMaValid.hopLe}
                    onClick={() => setBuocTaoPhong((prev) => (prev + 1) as 1 | 2 | 3)}
                    style={{ padding: '10px 24px', fontWeight: 700, backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    Tiếp theo <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!kiemTraMaValid.hopLe}
                    onClick={xuLyLuuPhongThi}
                    style={{ padding: '10px 28px', fontWeight: 800, backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    🚀 KÍCH HOẠT PHÒNG THI
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL SỬA PHÒNG THI */}
      {/* ============================================================ */}
      {hienThiModalSuaPhong && phongDangSua && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '24px', width: '600px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            
            {/* Header cố định */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                ✏️ Chỉnh Sửa Phòng Thi [{phongDangSua.maPhong}]
              </h2>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setHienThiModalSuaPhong(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Mã phòng thi *</label>
                <input
                  type="text"
                  className="input-custom"
                  style={{ width: '100%', fontWeight: 800, textTransform: 'uppercase' }}
                  value={phongDangSua.maPhong}
                  onChange={(e) => setPhongDangSua({ ...phongDangSua, maPhong: chuanHoaMaPhong(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tên phòng thi *</label>
                <input
                  type="text"
                  className="input-custom"
                  style={{ width: '100%' }}
                  value={phongDangSua.tenPhong}
                  onChange={(e) => setPhongDangSua({ ...phongDangSua, tenPhong: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Phạm vi tổ chức thi *</label>
                <select
                  className="input-custom"
                  style={{ width: '100%', fontWeight: 700 }}
                  value={phongDangSua.phamViThi || 'LAN'}
                  onChange={(e) => setPhongDangSua({ ...phongDangSua, phamViThi: e.target.value as 'LAN' | 'INTERNET' })}
                >
                  <option value="LAN">🖥️ Mạng LAN nội bộ (Thi tại phòng máy UNETI)</option>
                  <option value="INTERNET">🌐 Mạng Cloud / Internet (Thi từ xa trực tuyến)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Đề thi gán *</label>
                  <select
                    className="input-custom"
                    style={{ width: '100%', fontWeight: 600 }}
                    value={phongDangSua.baiKiemTraId}
                    onChange={(e) => {
                      const found = danhSachBaiKiemTra.find((b) => b.id === e.target.value);
                      if (found) {
                        setPhongDangSua({
                          ...phongDangSua,
                          baiKiemTraId: found.id,
                          tenBaiKiemTra: found.tenBaiKiemTra,
                          monHoc: found.monHoc,
                          thoiLuongPhut: found.thoiLuongPhut
                        });
                      }
                    }}
                  >
                    {danhSachBaiKiemTra.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tenBaiKiemTra} ({b.monHoc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Thời lượng (phút)</label>
                  <input
                    type="number"
                    className="input-custom"
                    style={{ width: '100%' }}
                    value={phongDangSua.thoiLuongPhut}
                    onChange={(e) => setPhongDangSua({ ...phongDangSua, thoiLuongPhut: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'var(--bg-app)', borderRadius: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={phongDangSua.tronCauHoi ?? true}
                    onChange={(e) => setPhongDangSua({ ...phongDangSua, tronCauHoi: e.target.checked })}
                  />
                  🔀 Trộn thứ tự câu hỏi ngẫu nhiên
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={phongDangSua.tronDapAn ?? true}
                    onChange={(e) => setPhongDangSua({ ...phongDangSua, tronDapAn: e.target.checked })}
                  />
                  🔤 Đảo vị trí đáp án (A, B, C, D)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={phongDangSua.choXemDiem ?? true}
                    onChange={(e) => setPhongDangSua({ ...phongDangSua, choXemDiem: e.target.checked })}
                  />
                  👁️ Cho sinh viên xem điểm sau khi nộp bài
                </label>
              </div>
            </div>

            {/* Footer nút bấm cố định ở đáy */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn-secondary" onClick={() => setHienThiModalSuaPhong(false)}>
                Hủy
              </button>
              <button type="button" className="btn-primary" onClick={xuLyLuuSuaPhong} style={{ padding: '8px 24px', fontWeight: 800 }}>
                Lưu Thay Đổi
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyThiCu;
