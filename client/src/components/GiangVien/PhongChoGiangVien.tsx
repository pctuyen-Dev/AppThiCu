import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RotateCcw,
  X,
  Clock,
  FileSpreadsheet,
  Upload,
  FileText,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import type { PhongThi } from '../../types/BoThuVienTypes';

export interface HocSinhPhongCho {
  stt: number;
  msv: string;
  hoTen: string;
  lop: string;
  khoa: string;
  trangThaiDuyet: 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI';
  thoiGianVaoPhong: string;
  isNgoaiLe?: boolean;
}

interface PhongChoGiangVienProps {
  phongThi: PhongThi;
  danhSachPhongThi?: PhongThi[];
  onChonPhongThi?: (phongId: string) => void;
  onBatDauCaThi: (phongId: string) => void;
  onChuyenToiGiamSat?: (phongId: string) => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
  onQuayLai?: () => void;
}

const initialHocSinhWaiting: HocSinhPhongCho[] = [
  { stt: 1, msv: '20210001', hoTen: 'Nguyễn Thị A', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'DA_DUYET', thoiGianVaoPhong: '16:00:12' },
  { stt: 2, msv: '20210002', hoTen: 'Võ Thành B', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'CHO_DUYET', thoiGianVaoPhong: '16:01:45' },
  { stt: 3, msv: '20210003', hoTen: 'Lê Phương C', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'CHO_DUYET', thoiGianVaoPhong: '16:02:10' },
  { stt: 4, msv: '20210004', hoTen: 'Hoàng Tuấn D', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'DA_DUYET', thoiGianVaoPhong: '15:58:30' },
  { stt: 5, msv: '20210005', hoTen: 'Phạm Ngọc E', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'TU_CHOI', thoiGianVaoPhong: '16:03:00' },
  { stt: 6, msv: '20210006', hoTen: 'Đỗ Kim F', lop: 'DHTI15A1HN', khoa: 'CNTT', trangThaiDuyet: 'CHO_DUYET', thoiGianVaoPhong: '16:04:15' }
];

export const PhongChoGiangVien: React.FC<PhongChoGiangVienProps> = ({
  phongThi,
  danhSachPhongThi = [],
  onChonPhongThi,
  onBatDauCaThi,
  onHienThiToast
}) => {
  const [cheDoDuyet, setCheDoDuyet] = useState<'TU_DONG' | 'THU_CONG'>(phongThi.cheDoDuyet || 'THU_CONG');
  const [danhSachHocSinh, setDanhSachHocSinh] = useState<HocSinhPhongCho[]>(initialHocSinhWaiting);
  
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [locDuyet, setLocDuyet] = useState<'TAT_CA' | 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI' | 'BO_SUNG'>('TAT_CA');
  
  // MODAL THÊM SINH VIÊN (HỖ TRỢ THỦ CÔNG & EXCEL)
  const [hienThiModalThemSV, setHienThiModalThemSV] = useState<boolean>(false);
  const [tabThemSV, setTabThemSV] = useState<'EXCEL' | 'THU_CONG'>('EXCEL');
  const [msvThem, setMsvThem] = useState<string>('');
  
  // STATE ĐỌC FILE EXCEL
  const [tenFileExcel, setTenFileExcel] = useState<string>('');
  const [danhSachDocExcel, setDanhSachDocExcel] = useState<{ msv: string; hoTen: string; lop: string }[]>([]);
  const [dangDocFile, setDangDocFile] = useState<boolean>(false);

  // STATE & EFFECT: HẸN GIỜ TỰ ĐỘNG BẮT ĐẦU CA THI
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
        onBatDauCaThi(phongThi.id);
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
  }, [thoiGianAutoStart, phongThi.id, phongThi.maPhong, onBatDauCaThi, onHienThiToast]);

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

  useEffect(() => {
    if (phongThi && phongThi.danhSachSinhVien && phongThi.danhSachSinhVien.length > 0) {
      const converted: HocSinhPhongCho[] = phongThi.danhSachSinhVien.map((sv, idx) => ({
        stt: idx + 1,
        msv: sv.maSinhVien,
        hoTen: sv.hoTen,
        lop: sv.lop || 'DHTI15A1HN',
        khoa: sv.khoa || 'CNTT',
        trangThaiDuyet: (sv.trangThaiDuyet as any) || (idx % 2 === 0 ? 'DA_DUYET' : 'CHO_DUYET'),
        thoiGianVaoPhong: '16:00:00'
      }));
      setDanhSachHocSinh(converted);
    }
  }, [phongThi]);

  const tongSo = danhSachHocSinh.length;
  const soChoDuyet = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'CHO_DUYET').length;
  const soDaDuyet = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'DA_DUYET').length;
  const soTuChoi = danhSachHocSinh.filter((h) => h.trangThaiDuyet === 'TU_CHOI').length;
  const soBoSung = danhSachHocSinh.filter((h) => h.isNgoaiLe).length;

  const danhSachLoc = danhSachHocSinh.filter((h) => {
    if (locDuyet === 'BO_SUNG' && !h.isNgoaiLe) return false;
    if (locDuyet !== 'TAT_CA' && locDuyet !== 'BO_SUNG' && h.trangThaiDuyet !== locDuyet) return false;
    if (tuKhoaTimKiem.trim() !== '') {
      const tk = tuKhoaTimKiem.toLowerCase().trim();
      return h.hoTen.toLowerCase().includes(tk) || h.msv.toLowerCase().includes(tk);
    }
    return true;
  });

  const xuLyDuyet = (msv: string) => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => (h.msv === msv ? { ...h, trangThaiDuyet: 'DA_DUYET' } : h))
    );
    onHienThiToast('Đã duyệt sinh viên', `Sinh viên ${msv} đã được phê duyệt tham gia bài thi.`, 'success');
  };

  const xuLyTuChoi = (msv: string) => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => (h.msv === msv ? { ...h, trangThaiDuyet: 'TU_CHOI' } : h))
    );
    onHienThiToast('Đã từ chối', `Đã từ chối sinh viên ${msv} tham gia phòng thi.`, 'warning');
  };

  const xuLyDuyetTatCa = () => {
    setDanhSachHocSinh((prev) =>
      prev.map((h) => (h.trangThaiDuyet === 'CHO_DUYET' ? { ...h, trangThaiDuyet: 'DA_DUYET' } : h))
    );
    onHienThiToast('Phê duyệt đồng loạt', `Đã phê duyệt toàn bộ ${soChoDuyet} sinh viên trong danh sách chờ.`, 'success');
  };

  const xuLyDoiCheDoDuyet = (mode: 'TU_DONG' | 'THU_CONG') => {
    setCheDoDuyet(mode);
    if (mode === 'TU_DONG') {
      setDanhSachHocSinh((prev) =>
        prev.map((h) => (h.trangThaiDuyet === 'CHO_DUYET' ? { ...h, trangThaiDuyet: 'DA_DUYET' } : h))
      );
      onHienThiToast('Chế độ Tự động duyệt', 'Hệ thống đã tự động duyệt tất cả sinh viên đang chờ.', 'success');
    } else {
      onHienThiToast('Chế độ Duyệt thủ công', 'Chuyển sang chế độ duyệt thủ công từng sinh viên.', 'info');
    }
  };

  // ------------------------------------------------------------------
  // XỬ LÝ ĐỌC FILE EXCEL / CSV THÊM SINH VIÊN
  // ------------------------------------------------------------------
  const xuLyDocFileExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTenFileExcel(file.name);
    setDangDocFile(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Đọc dữ liệu thành mảng mảng
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        if (!data || data.length === 0) {
          onHienThiToast('Cảnh báo', 'File Excel rỗng!', 'error');
          setDangDocFile(false);
          return;
        }

        // Tìm hàng tiêu đề chứa cột MSV / Mã SV / Mã sinh viên
        let msvColIndex = -1;
        let hoTenColIndex = -1;
        let lopColIndex = -1;
        let startRowIndex = 0;

        for (let i = 0; i < Math.min(10, data.length); i++) {
          const row = data[i];
          if (!row) continue;
          for (let j = 0; j < row.length; j++) {
            const cellVal = String(row[j] || '').toLowerCase().trim();
            if (cellVal.includes('mã sv') || cellVal.includes('mã sinh viên') || cellVal.includes('msv') || cellVal.includes('mssv')) {
              msvColIndex = j;
              startRowIndex = i + 1;
            }
            if (cellVal.includes('họ tên') || cellVal.includes('họ và tên') || cellVal.includes('hoten')) {
              hoTenColIndex = j;
            }
            if (cellVal.includes('lớp') || cellVal.includes('lop')) {
              lopColIndex = j;
            }
          }
          if (msvColIndex !== -1) break;
        }

        // Nếu không thấy dòng tiêu đề, mặc định lấy cột A (0) làm MSV, cột B (1) làm Họ tên
        if (msvColIndex === -1) {
          msvColIndex = 0;
          hoTenColIndex = 1;
          lopColIndex = 2;
          startRowIndex = 0;
        }

        const parsedList: { msv: string; hoTen: string; lop: string }[] = [];
        const setMsvLog = new Set<string>();

        for (let i = startRowIndex; i < data.length; i++) {
          const row = data[i];
          if (!row) continue;

          const rawMsv = String(row[msvColIndex] || '').trim();
          if (!rawMsv || rawMsv.length < 3) continue; // Bỏ qua giá trị rỗng

          if (setMsvLog.has(rawMsv)) continue; // Bỏ trùng
          setMsvLog.add(rawMsv);

          const rawHoTen = hoTenColIndex !== -1 && row[hoTenColIndex] ? String(row[hoTenColIndex]).trim() : `Sinh viên ${rawMsv}`;
          const rawLop = lopColIndex !== -1 && row[lopColIndex] ? String(row[lopColIndex]).trim() : 'DHTI15A1HN';

          parsedList.push({
            msv: rawMsv,
            hoTen: rawHoTen,
            lop: rawLop
          });
        }

        if (parsedList.length === 0) {
          onHienThiToast('Cảnh báo', 'Không tìm thấy dữ liệu Mã sinh viên hợp lệ trong file!', 'warning');
        } else {
          onHienThiToast('Đọc file thành công', `Đã tìm thấy ${parsedList.length} sinh viên từ file Excel.`, 'success');
        }

        setDanhSachDocExcel(parsedList);
      } catch (err) {
        onHienThiToast('Lỗi đọc file', 'Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.', 'error');
      } finally {
        setDangDocFile(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const xuLyXacNhanThemExcel = () => {
    if (danhSachDocExcel.length === 0) {
      onHienThiToast('Cảnh báo', 'Chưa có sinh viên nào từ file Excel để thêm!', 'error');
      return;
    }

    const danhSachMoi: HocSinhPhongCho[] = danhSachDocExcel.map((item, idx) => ({
      stt: danhSachHocSinh.length + idx + 1,
      msv: item.msv,
      hoTen: item.hoTen,
      lop: item.lop,
      khoa: 'CNTT',
      trangThaiDuyet: 'DA_DUYET',
      isNgoaiLe: true,
      thoiGianVaoPhong: new Date().toLocaleTimeString('vi-VN')
    }));

    setDanhSachHocSinh((prev) => [...danhSachMoi, ...prev]);
    onHienThiToast('Thêm từ Excel thành công', `Đã thêm & duyệt toàn bộ ${danhSachMoi.length} sinh viên từ file Excel.`, 'success');
    
    // Reset modal state
    setDanhSachDocExcel([]);
    setTenFileExcel('');
    setHienThiModalThemSV(false);
  };

  const xuLyThemSVNgoaiLe = () => {
    if (!msvThem.trim()) {
      onHienThiToast('Cảnh báo', 'Vui lòng nhập Mã sinh viên (MSV)!', 'error');
      return;
    }

    const msvClean = msvThem.trim();
    const svMoi: HocSinhPhongCho = {
      stt: danhSachHocSinh.length + 1,
      msv: msvClean,
      hoTen: `Sinh viên ${msvClean}`,
      lop: 'DHTI15A1HN',
      khoa: 'CNTT',
      trangThaiDuyet: 'DA_DUYET',
      isNgoaiLe: true,
      thoiGianVaoPhong: new Date().toLocaleTimeString('vi-VN')
    };

    setDanhSachHocSinh((prev) => [svMoi, ...prev]);
    onHienThiToast('Cấp quyền thành công', `Đã thêm & duyệt cho sinh viên MSV ${svMoi.msv}.`, 'success');
    setMsvThem('');
    setHienThiModalThemSV(false);
  };

  const danhSachPhongCho = danhSachPhongThi.filter((p) => p.trangThai === 'CHO_BAT_DAU');

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
      {/* HEADER PHÒNG CHỜ THI */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Phòng chờ thi
              </h1>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                Chờ bắt đầu
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Phòng: <b>{phongThi.maPhong}</b> - {phongThi.tenPhong} ({phongThi.tenBaiKiemTra})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {danhSachPhongCho.length > 0 && (
              <select
                value={phongThi.id}
                onChange={(e) => onChonPhongThi && onChonPhongThi(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {danhSachPhongCho.map((p) => (
                  <option key={p.id} value={p.id}>
                    Phòng: {p.maPhong} - {p.tenPhong}
                  </option>
                ))}
              </select>
            )}

            {/* THANH HIỂN THỊ ĐẾM NGƯỢC HẸN GIỜ */}
            {demNguocGiay !== null ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}
              >
                <Clock size={16} />
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
                    cursor: 'pointer',
                    marginLeft: '4px'
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
            )}

            <button
              type="button"
              onClick={() => onBatDauCaThi(phongThi.id)}
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: 'var(--text-on-primary)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Bắt đầu ca thi ngay
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Chế độ duyệt:</span>
            <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-surface-subtle)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => xuLyDoiCheDoDuyet('TU_DONG')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: cheDoDuyet === 'TU_DONG' ? 'var(--primary)' : 'transparent',
                  color: cheDoDuyet === 'TU_DONG' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Tự động duyệt
              </button>
              <button
                type="button"
                onClick={() => xuLyDoiCheDoDuyet('THU_CONG')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: cheDoDuyet === 'THU_CONG' ? 'var(--primary)' : 'transparent',
                  color: cheDoDuyet === 'THU_CONG' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Duyệt thủ công
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={xuLyDuyetTatCa}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Duyệt tất cả ({soChoDuyet})
            </button>

            <button
              type="button"
              onClick={() => setHienThiModalThemSV(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <FileSpreadsheet size={16} />
              <span>+ Thêm sinh viên (Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 THẺ THỐNG KÊ DUYỆT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} />
            <span>Tổng đăng ký</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{tongSo}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đang chờ phê duyệt</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soChoDuyet}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đã phê duyệt</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soDaDuyet}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 18px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đã từ chối / Khóa</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{soTuChoi}</div>
        </div>
      </div>

      {/* BẢNG DANH SÁCH HỌC SINH */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '480px'
        }}
      >
        <div>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '300px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Tìm theo Mã SV hoặc Họ tên..."
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

              <div style={{ display: 'flex', gap: '6px' }}>
                {(['TAT_CA', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'BO_SUNG'] as const).map((mode) => {
                  const label =
                    mode === 'TAT_CA'
                      ? `Tất cả (${tongSo})`
                      : mode === 'CHO_DUYET'
                      ? `Chờ duyệt (${soChoDuyet})`
                      : mode === 'DA_DUYET'
                      ? `Đã duyệt (${soDaDuyet})`
                      : mode === 'TU_CHOI'
                      ? `Từ chối (${soTuChoi})`
                      : `Đã thêm (${soBoSung})`;

                  const isSel = locDuyet === mode;

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setLocDuyet(mode)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: isSel ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSel ? 'var(--primary-light)' : 'var(--bg-surface)',
                        color: isSel ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isSel ? 700 : 500,
                        fontSize: '12.5px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setTuKhoaTimKiem('');
                  setLocDuyet('TAT_CA');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <RotateCcw size={14} /> Xóa lọc
              </button>
            </div>

            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Hiển thị <b>{danhSachLoc.length}</b> sinh viên
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    height: '42px',
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <th style={{ padding: '0 16px', width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ padding: '0 16px', width: '130px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '120px' }}>LỚP</th>
                  <th style={{ padding: '0 16px', width: '140px' }}>TRẠNG THÁI DUYỆT</th>
                  <th style={{ padding: '0 16px', width: '140px', textAlign: 'center' }}>THỜI GIAN VÀO</th>
                  <th style={{ padding: '0 16px', width: '180px', textAlign: 'right' }}>THAO TÁC DUYỆT</th>
                </tr>
              </thead>
              <tbody>
                {danhSachLoc.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Không có sinh viên nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  danhSachLoc.map((h) => (
                    <tr
                      key={h.msv}
                      style={{
                        height: '52px',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)'
                      }}
                    >
                      <td style={{ padding: '0 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>{h.stt}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {h.msv}
                        {h.isNgoaiLe && (
                          <span style={{ marginLeft: '6px', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Đã thêm
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{h.hoTen}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h.lop}</td>
                      <td style={{ padding: '0 16px' }}>
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
                      <td style={{ padding: '0 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {h.thoiGianVaoPhong}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {h.trangThaiDuyet !== 'DA_DUYET' && (
                            <button
                              type="button"
                              onClick={() => xuLyDuyet(h.msv)}
                              style={{ padding: '5px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Duyệt
                            </button>
                          )}
                          {h.trangThaiDuyet !== 'TU_CHOI' && (
                            <button
                              type="button"
                              onClick={() => xuLyTuChoi(h.msv)}
                              style={{ padding: '5px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Từ chối
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Phòng thi đang mở. Bấm nút <b>Bắt đầu ca thi ngay</b> để cho sinh viên đã duyệt tiến hành làm bài.
          </span>

          <button
            type="button"
            onClick={() => onBatDauCaThi(phongThi.id)}
            style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Bắt đầu ca thi ngay
          </button>
        </div>
      </div>

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

      {/* MODAL THÊM SINH VIÊN (HỖ TRỢ THỦ CÔNG & EXCEL) */}
      {hienThiModalThemSV && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', width: '520px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Thêm sinh viên vào phòng thi</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setHienThiModalThemSV(false)} />
            </div>

            {/* TAB CHỌN PHƯƠNG THỨC THÊM */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-subtle)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setTabThemSV('EXCEL')}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: tabThemSV === 'EXCEL' ? 'var(--bg-surface)' : 'transparent',
                  color: tabThemSV === 'EXCEL' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tabThemSV === 'EXCEL' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: tabThemSV === 'EXCEL' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FileSpreadsheet size={15} />
                <span>Nhập từ File Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setTabThemSV('THU_CONG')}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: tabThemSV === 'THU_CONG' ? 'var(--bg-surface)' : 'transparent',
                  color: tabThemSV === 'THU_CONG' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tabThemSV === 'THU_CONG' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: tabThemSV === 'THU_CONG' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={15} />
                <span>Nhập 1 MSV thủ công</span>
              </button>
            </div>

            {/* TAB EXCEL */}
            {tabThemSV === 'EXCEL' ? (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Tải lên file Excel (<b>.xlsx</b>, <b>.xls</b>, <b>.csv</b>) chứa danh sách sinh viên. Hệ thống tự động đọc cột <b>Mã sinh viên</b> và phê duyệt tham gia.
                </p>

                {/* KHUNG TẢI FILE */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={xuLyDocFileExcel}
                    id="excel-file-input"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 }}
                  />
                  <div
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={28} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {tenFileExcel ? tenFileExcel : 'Kéo thả hoặc bấm để chọn file Excel'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {dangDocFile ? 'Đang đọc dữ liệu...' : 'Hỗ trợ định dạng .xlsx, .xls, .csv'}
                    </span>
                  </div>
                </div>

                {/* XEM TRƯỚC DANH SÁCH ĐỌC ĐƯỢC */}
                {danhSachDocExcel.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} />
                        Đã đọc được {danhSachDocExcel.length} sinh viên hợp lệ:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDanhSachDocExcel([]);
                          setTenFileExcel('');
                        }}
                        style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} /> Xóa danh sách
                      </button>
                    </div>

                    <div style={{ maxHeight: '160px', overflowY: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '6px 10px', width: '40px' }}>STT</th>
                            <th style={{ padding: '6px 10px' }}>MÃ SV</th>
                            <th style={{ padding: '6px 10px' }}>HỌ VÀ TÊN</th>
                            <th style={{ padding: '6px 10px' }}>LỚP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {danhSachDocExcel.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                              <td style={{ padding: '6px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.msv}</td>
                              <td style={{ padding: '6px 10px', color: 'var(--text-primary)' }}>{item.hoTen}</td>
                              <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{item.lop}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setHienThiModalThemSV(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={danhSachDocExcel.length === 0}
                    onClick={xuLyXacNhanThemExcel}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: danhSachDocExcel.length > 0 ? 'var(--primary)' : 'var(--border-color)',
                      color: 'var(--text-on-primary)',
                      fontWeight: 700,
                      cursor: danhSachDocExcel.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Thêm & Duyệt tất cả ({danhSachDocExcel.length})
                  </button>
                </div>
              </div>
            ) : (
              /* TAB NHẬP THỦ CÔNG 1 MSV */
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Chỉ cần nhập <b>Mã sinh viên (MSV)</b> để cấp quyền trực tiếp vào làm bài.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>MÃ SINH VIÊN (MSV) *</label>
                  <input
                    type="text"
                    placeholder="Nhập Mã SV (Ví dụ: 21103100123)..."
                    value={msvThem}
                    onChange={(e) => setMsvThem(e.target.value)}
                    autoFocus
                    style={{ width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontSize: '14px', outline: 'none', fontWeight: 600, color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setHienThiModalThemSV(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={xuLyThemSVNgoaiLe}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Thêm & Duyệt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhongChoGiangVien;
