import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  ShieldAlert,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import type { BaiNopSinhVien } from '../../types/BoThuVienTypes';
import { chuanHoaMaPhong } from '../../utils/MaPhongUtils';

interface ThongKeDiemGiangVienProps {
  danhSachBaiNop: BaiNopSinhVien[];
}

export const ThongKeDiemGiangVien: React.FC<ThongKeDiemGiangVienProps> = ({ danhSachBaiNop }) => {
  // Trạng thái Lọc
  const [maPhongChon, setMaPhongChon] = useState<string>('TAT_CA');
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [xepLoaiLoc, setXepLoaiLoc] = useState<string>('TAT_CA');

  // Xem chi tiết vi phạm của sinh viên
  const [sinhVienXemViPham, setSinhVienXemViPham] = useState<BaiNopSinhVien | null>(null);

  // Danh sách các phòng thi duy nhất
  const danhSachMaPhong = useMemo(() => {
    const setPhong = new Set<string>();
    danhSachBaiNop.forEach((bn) => {
      if (bn.maPhong) setPhong.add(bn.maPhong);
    });
    return Array.from(setPhong);
  }, [danhSachBaiNop]);

  // Phân loại xếp loại học lực dựa trên điểm số
  const layXepLoai = (diem?: number) => {
    if (diem === undefined || isNaN(diem)) return { ten: 'Chưa chấm', color: 'var(--text-tertiary)', bg: 'var(--bg-surface-subtle)', code: 'CHUA_CHAM' };
    if (diem >= 9.0) return { ten: 'Xuất sắc', color: '#10b981', bg: '#dcfce7', code: 'XUAT_SAC' };
    if (diem >= 8.0) return { ten: 'Giỏi', color: '#3b82f6', bg: '#dbeafe', code: 'GIOI' };
    if (diem >= 6.5) return { ten: 'Khá', color: '#0284c7', bg: '#e0f2fe', code: 'KHA' };
    if (diem >= 5.0) return { ten: 'Trung bình', color: '#d97706', bg: '#fef3c7', code: 'TRUNG_BINH' };
    return { ten: 'Yếu / Kém', color: '#dc2626', bg: '#fee2e2', code: 'YEU' };
  };

  // Danh sách bài nộp được lọc theo Phòng thi, Từ khóa và Phân loại điểm
  const danhSachLoc = useMemo(() => {
    return danhSachBaiNop.filter((bn) => {
      const matchPhong = maPhongChon === 'TAT_CA' || bn.maPhong === maPhongChon;
      const matchTuKhoa =
        !tuKhoaTimKiem ||
        bn.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
        bn.hoTenSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
        bn.lop.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());

      const xepLoai = layXepLoai(bn.diemSo);
      const matchXepLoai = xepLoaiLoc === 'TAT_CA' || xepLoai.code === xepLoaiLoc;

      return matchPhong && matchTuKhoa && matchXepLoai;
    });
  }, [danhSachBaiNop, maPhongChon, tuKhoaTimKiem, xepLoaiLoc]);

  // Thống kê số liệu chỉ số KPIS
  const thongKeKPI = useMemo(() => {
    const tongSo = danhSachLoc.length;
    const danhSachDaCham = danhSachLoc.filter((b) => b.diemSo !== undefined);
    const tongDiem = danhSachDaCham.reduce((acc, curr) => acc + (curr.diemSo || 0), 0);
    const diemTrungBinh = danhSachDaCham.length > 0 ? Math.round((tongDiem / danhSachDaCham.length) * 100) / 100 : 0;

    let maxDiem = 0;
    let minDiem = 10;
    let soLuotDat = 0;

    danhSachDaCham.forEach((b) => {
      const d = b.diemSo || 0;
      if (d > maxDiem) maxDiem = d;
      if (d < minDiem) minDiem = d;
      if (d >= 5.0) soLuotDat++;
    });

    if (danhSachDaCham.length === 0) minDiem = 0;

    const tyLeDat = tongSo > 0 ? Math.round((soLuotDat / tongSo) * 1000) / 10 : 0;
    const tongViPham = danhSachLoc.reduce((acc, curr) => acc + (curr.soLanViPham || 0), 0);
    const soSinhVienViPham = danhSachLoc.filter((b) => (b.soLanViPham || 0) > 0).length;

    return {
      tongSo,
      soDaCham: danhSachDaCham.length,
      diemTrungBinh,
      maxDiem,
      minDiem,
      tyLeDat,
      tongViPham,
      soSinhVienViPham
    };
  }, [danhSachLoc]);

  // Phổ điểm chi tiết từng mốc điểm từ 0 đến 10 (11 cột điểm số riêng biệt 0..10, màu sắc đồng nhất nhã nhặn)
  const phoDiemBarChart = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    danhSachLoc.forEach((b) => {
      const d = b.diemSo;
      if (d === undefined || isNaN(d)) return;
      const roundedMark = Math.min(10, Math.max(0, Math.round(d)));
      counts[roundedMark]++;
    });

    const maxCount = Math.max(...counts, 1);
    const tongDaCham = danhSachLoc.filter((b) => b.diemSo !== undefined).length || 1;

    return counts.map((count, mark) => ({
      mark: mark.toString(),
      label: `Điểm ${mark}`,
      count,
      percent: Math.round((count / tongDaCham) * 100),
      heightPercent: Math.round((count / maxCount) * 100),
      // Tông màu chủ đạo var(--primary) thanh lịch, không rực rỡ màu mè
      color: mark >= 5 ? 'var(--primary)' : '#94a3b8'
    }));
  }, [danhSachLoc]);

  // Xuất file Excel Thống kê định dạng Times New Roman, cỡ 14pt
  const xuLyXuatExcelThongKe = () => {
    const maP = maPhongChon === 'TAT_CA' ? 'TẤT CẢ PHÒNG THI' : `PHÒNG THI ${maPhongChon}`;
    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>ThongKeDiem</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 14pt; }
          table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', serif; font-size: 14pt; }
          th { border: 1px solid #000000; padding: 8px; background-color: #d9e1f2; text-align: center; font-weight: bold; font-size: 14pt; }
          td { border: 1px solid #000000; padding: 6px; font-size: 14pt; }
          .title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 12px; }
          .center { text-align: center; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="title">BÁO CÁO THỐNG KÊ ĐIỂM KỲ THI - ${maP}</div>
        <p><b>Điểm trung bình toàn phòng:</b> ${thongKeKPI.diemTrungBinh} | <b>Tỷ lệ Đạt:</b> ${thongKeKPI.tyLeDat}% | <b>Tổng vi phạm:</b> ${thongKeKPI.tongViPham} lượt</p>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã SV</th>
              <th>Họ và tên</th>
              <th>Lớp</th>
              <th>Mã phòng</th>
              <th>Điểm gốc</th>
              <th>Điểm mới</th>
              <th>Số lần vi phạm</th>
              <th>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
    `;

    danhSachLoc.forEach((bn, idx) => {
      const xl = layXepLoai(bn.diemSo);
      htmlContent += `
        <tr>
          <td class="center">${idx + 1}</td>
          <td class="center bold">${bn.maSinhVien}</td>
          <td>${bn.hoTenSinhVien}</td>
          <td class="center">${bn.lop}</td>
          <td class="center">${chuanHoaMaPhong(bn.maPhong || 'A102')}</td>
          <td class="center bold">${bn.diemSo !== undefined ? bn.diemSo : '--'}</td>
          <td class="center bold">${bn.diemSo !== undefined ? bn.diemSo : '--'}</td>
          <td class="center">${bn.soLanViPham || 0}</td>
          <td class="center">${xl.ten}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_ThongKeDiem_${maPhongChon}_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER BAR THỐNG KÊ KỲ THI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={26} style={{ color: 'var(--primary)' }} />
            Thống kê điểm & Giám sát kỳ thi
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Phân tích chi tiết phổ điểm, tỷ lệ vi phạm quy chế và báo cáo xếp loại kỳ thi.
          </p>
        </div>

        {/* NÚT XUẤT BÁO CÁO EXCEL */}
        <button
          type="button"
          onClick={xuLyXuatExcelThongKe}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-on-primary)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <FileSpreadsheet size={16} /> Xuất báo cáo Thống kê (.xlsx)
        </button>
      </div>

      {/* THANH BỘ LỌC THÔNG TIN (PHÒNG THI, PHÂN LOẠI, TÌM KIẾM) */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* LỌC THEO PHÒNG THI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Mã phòng:</span>
          <select
            value={maPhongChon}
            onChange={(e) => setMaPhongChon(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TAT_CA">Tất cả phòng thi ({danhSachMaPhong.length} phòng)</option>
            {danhSachMaPhong.map((p) => (
              <option key={p} value={p}>
                Phòng thi {chuanHoaMaPhong(p)}
              </option>
            ))}
          </select>
        </div>

        {/* LỌC THEO XẾP LOẠI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Xếp loại:</span>
          <select
            value={xepLoaiLoc}
            onChange={(e) => setXepLoaiLoc(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="TAT_CA">Tất cả xếp loại</option>
            <option value="XUAT_SAC">Xuất sắc (9.0 - 10.0)</option>
            <option value="GIOI">Giỏi (8.0 - 8.9)</option>
            <option value="KHA">Khá (6.5 - 7.9)</option>
            <option value="TRUNG_BINH">Trung bình (5.0 - 6.4)</option>
            <option value="YEU">Yếu / Kém (&lt; 5.0)</option>
          </select>
        </div>

        {/* TÌM KIẾM THEO MÃ SV / HỌ TÊN */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={tuKhoaTimKiem}
            onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            placeholder="Tìm kiếm Mã SV, Họ và tên, Lớp..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* TỔNG QUAN CÁC THẺ CHỈ SỐ METRIC CARDS (KPIS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* CARDS 1: ĐIỂM TRUNG BÌNH */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Điểm trung bình (GPA)</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {thongKeKPI.diemTrungBinh} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)' }}>/ 10</span>
            </div>
          </div>
        </div>

        {/* CARDS 2: TỶ LỆ ĐẠT */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tỷ lệ Đạt (&ge; 5.0)</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a', margin: '2px 0 0' }}>
              {thongKeKPI.tyLeDat}% <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>({thongKeKPI.soDaCham} bài)</span>
            </div>
          </div>
        </div>

        {/* CARDS 3: ĐIỂM CAO NHẤT / THẤP NHẤT */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cao nhất / Thấp nhất</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              <span style={{ color: '#10b981' }}>{thongKeKPI.maxDiem}</span> <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>/</span> <span style={{ color: '#ef4444' }}>{thongKeKPI.minDiem}</span>
            </div>
          </div>
        </div>

        {/* CARDS 4: TỔNG SỐ LƯỢT VI PHẠM */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: thongKeKPI.tongViPham > 0 ? '#fee2e2' : '#f3f4f6', color: thongKeKPI.tongViPham > 0 ? '#dc2626' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Lượt vi phạm ghi nhận</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: thongKeKPI.tongViPham > 0 ? '#dc2626' : 'var(--text-primary)', margin: '2px 0 0' }}>
              {thongKeKPI.tongViPham} <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>({thongKeKPI.soSinhVienViPham} SV)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC BIỂU ĐỒ CỘT PHỔ ĐIỂM VÀ BIỂU ĐỒ VI PHẠM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* BIỂU ĐỒ CỘT PHỔ ĐIỂM KỲ THI */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Biểu đồ cột Phổ điểm kỳ thi
              </h3>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {thongKeKPI.soDaCham} bài nộp
            </span>
          </div>

          {/* VẼ BIỂU ĐỒ CỘT 11 MỐC ĐIỂM SỐ TỪ 0 ĐẾN 10 (MÀU SẮC ĐỒNG NHẤT, THANH LỊCH) */}
          <div style={{ height: '210px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', padding: '16px 4px 0', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
            {phoDiemBarChart.map((bar) => (
              <div key={bar.mark} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                {/* SỐ LƯỢNG BÀI TRÊN ĐẦU CỘT */}
                <div style={{ fontSize: '11px', fontWeight: 800, color: bar.count > 0 ? 'var(--text-primary)' : 'transparent', marginBottom: '4px', textAlign: 'center' }}>
                  {bar.count > 0 ? bar.count : '0'}
                </div>

                {/* THÂN CỘT BIỂU ĐỒ VỚI TÔNG MÀU THANH LỊCH */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '24px',
                    height: `${Math.max(bar.heightPercent, 3)}%`,
                    backgroundColor: bar.color,
                    borderRadius: '5px 5px 2px 2px',
                    transition: 'all 0.25s ease',
                    opacity: bar.count > 0 ? 0.9 : 0.2
                  }}
                  title={`${bar.label}: ${bar.count} sinh viên (${bar.percent}%)`}
                />
              </div>
            ))}
          </div>

          {/* CHÚ THÍCH THANG ĐIỂM TỪ 0 ĐẾN 10 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textAlign: 'center', padding: '0 4px' }}>
            {phoDiemBarChart.map((bar) => (
              <div key={bar.mark} style={{ flex: 1, color: bar.count > 0 ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                {bar.mark}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-tertiary)', marginTop: '-8px' }}>
            Thang điểm thi (từ 0 đến 10)
          </div>
        </div>

        {/* PHÂN TÍCH THỐNG KÊ SỐ SINH VIÊN VI PHẠM QUY CHẾ */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} style={{ color: 'var(--warning, #f59e0b)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Thống kê Sinh viên Vi phạm quy chế
              </h3>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {danhSachLoc.length} sinh viên dự thi
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            {/* SINH VIÊN KHÔNG VI PHẠM */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Sinh viên Không vi phạm</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>
                  {danhSachLoc.length - thongKeKPI.soSinhVienViPham} SV
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                  ({danhSachLoc.length > 0 ? Math.round(((danhSachLoc.length - thongKeKPI.soSinhVienViPham) / danhSachLoc.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* SINH VIÊN CÓ VI PHẠM */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', backgroundColor: thongKeKPI.soSinhVienViPham > 0 ? '#fee2e2' : 'var(--bg-surface-subtle)', border: '1px solid ' + (thongKeKPI.soSinhVienViPham > 0 ? '#fca5a5' : 'var(--border-color)') }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Sinh viên Có vi phạm quy chế</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444' }}>
                  {thongKeKPI.soSinhVienViPham} SV
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                  ({danhSachLoc.length > 0 ? Math.round((thongKeKPI.soSinhVienViPham / danhSachLoc.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* THANH TỶ LỆ TRỰC QUAN */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Tỷ lệ phân bổ sinh viên:</span>
                <b>{thongKeKPI.tongViPham} tổng lượt vi phạm</b>
              </div>
              <div style={{ height: '12px', width: '100%', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', overflow: 'hidden', display: 'flex' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${danhSachLoc.length > 0 ? Math.round(((danhSachLoc.length - thongKeKPI.soSinhVienViPham) / danhSachLoc.length) * 100) : 100}%`,
                    backgroundColor: '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                  title={`Không vi phạm: ${danhSachLoc.length - thongKeKPI.soSinhVienViPham} SV`}
                />
                <div
                  style={{
                    height: '100%',
                    width: `${danhSachLoc.length > 0 ? Math.round((thongKeKPI.soSinhVienViPham / danhSachLoc.length) * 100) : 0}%`,
                    backgroundColor: '#ef4444',
                    transition: 'width 0.3s ease'
                  }}
                  title={`Có vi phạm: ${thongKeKPI.soSinhVienViPham} SV`}
                />
              </div>
            </div>
          </div>

          {/* CHÚ THÍCH TRẠNG THÁI GIÁM SÁT */}
          <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mức độ tuân thủ quy chế:</span>
            <span style={{ padding: '3px 10px', borderRadius: '6px', backgroundColor: thongKeKPI.soSinhVienViPham === 0 ? '#dcfce7' : '#fee2e2', color: thongKeKPI.soSinhVienViPham === 0 ? '#15803d' : '#dc2626', fontWeight: 700 }}>
              {thongKeKPI.soSinhVienViPham === 0 ? '✓ 100% Sinh viên tuân thủ tốt' : `Ghi nhận ${thongKeKPI.soSinhVienViPham} sinh viên vi phạm`}
            </span>
          </div>
        </div>
      </div>

      {/* BẢNG DANH SÁCH THỐNG KÊ CHI TIẾT THEO SINH VIÊN */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Danh sách chi tiết kết quả sinh viên ({danhSachLoc.length} sinh viên)
          </span>
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Hiển thị theo: <b>{maPhongChon === 'TAT_CA' ? 'Tất cả phòng thi' : `Phòng ${chuanHoaMaPhong(maPhongChon)}`}</b>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                <th style={{ padding: '0 16px', width: '110px' }}>MÃ SV</th>
                <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                <th style={{ padding: '0 16px', width: '100px' }}>LỚP</th>
                <th style={{ padding: '0 16px', width: '110px' }}>MÃ PHÒNG</th>
                <th style={{ padding: '0 16px', width: '110px', textAlign: 'center' }}>VI PHẠM</th>
                <th style={{ padding: '0 16px', width: '100px', textAlign: 'center' }}>ĐIỂM CHÍNH THỨC</th>
                <th style={{ padding: '0 16px', width: '130px', textAlign: 'center' }}>XẾP LOẠI</th>
              </tr>
            </thead>
            <tbody>
              {danhSachLoc.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                    Không có sinh viên nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                danhSachLoc.map((bn) => {
                  const xl = layXepLoai(bn.diemSo);
                  const soLanVP = bn.soLanViPham || 0;

                  return (
                    <tr key={bn.id} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{bn.maSinhVien}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{bn.hoTenSinhVien}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{bn.lop}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {chuanHoaMaPhong(bn.maPhong || 'A102')}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center' }}>
                        <span
                          onClick={() => setSinhVienXemViPham(bn)}
                          style={{
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '10px',
                            backgroundColor: soLanVP > 0 ? '#fee2e2' : 'var(--bg-surface-subtle)',
                            color: soLanVP > 0 ? '#dc2626' : 'var(--text-tertiary)',
                            border: '1px solid ' + (soLanVP > 0 ? '#fca5a5' : 'var(--border-subtle)')
                          }}
                          title="Click xem chi tiết nhật ký vi phạm"
                        >
                          {soLanVP} lần
                        </span>
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, fontSize: '15px', color: 'var(--primary)' }}>
                        {bn.diemSo !== undefined ? bn.diemSo : '--'}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: xl.bg,
                            color: xl.color,
                            fontWeight: 700,
                            fontSize: '12px'
                          }}
                        >
                          {xl.ten}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CỬA SỔ NỔI XEM CHI TIẾT NHẬT KÝ GIÁM SÁT / VI PHẠM */}
      {sinhVienXemViPham && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', width: '560px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Nhật ký vi phạm quy chế thi</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Sinh viên: <b>{sinhVienXemViPham.hoTenSinhVien}</b> ({sinhVienXemViPham.maSinhVien}) | Lớp: <b>{sinhVienXemViPham.lop}</b>
                  </p>
                </div>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setSinhVienXemViPham(null)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tổng số lần vi phạm ghi nhận:</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, padding: '3px 12px', borderRadius: '12px', backgroundColor: (sinhVienXemViPham.soLanViPham || 0) > 0 ? '#fee2e2' : '#dcfce7', color: (sinhVienXemViPham.soLanViPham || 0) > 0 ? '#dc2626' : '#16a34a' }}>
                  {sinhVienXemViPham.soLanViPham || 0} lần
                </span>
              </div>

              {sinhVienXemViPham.nhatKyViPhamChiTiet && sinhVienXemViPham.nhatKyViPhamChiTiet.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chi tiết mốc thời gian vi phạm:</span>
                  {sinhVienXemViPham.nhatKyViPhamChiTiet.map((item, idx) => (
                    <div key={item.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '11.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {item.thoiGian}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{item.noiDung}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (sinhVienXemViPham.soLanViPham || 0) > 0 ? (
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', color: '#b45309', fontSize: '13px', lineHeight: 1.5 }}>
                  <b>Chi tiết ghi nhận:</b> {sinhVienXemViPham.chiTietViPham || `${sinhVienXemViPham.soLanViPham} lần vi phạm trong thời gian làm bài.`}
                </div>
              ) : (
                <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: '#dcfce7', border: '1px solid #10b981', color: '#15803d', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
                  ✓ Sinh viên chấp hành tốt quy chế thi. Không ghi nhận bất kỳ sự kiện vi phạm nào.
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSinhVienXemViPham(null)}
                style={{ padding: '9px 22px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
