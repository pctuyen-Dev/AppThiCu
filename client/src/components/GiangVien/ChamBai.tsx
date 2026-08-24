import React, { useState } from 'react';
import {
  FileText,
  Save,
  Send,
  Download,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  BookOpen
} from 'lucide-react';
import type { BaiNopSinhVien } from '../../types/BoThuVienTypes';
import { chuanHoaMaPhong } from '../../utils/MaPhongUtils';

interface ChamBaiProps {
  danhSachBaiNop: BaiNopSinhVien[];
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const ChamBai: React.FC<ChamBaiProps> = ({ danhSachBaiNop, onHienThiToast }) => {
  // Trạng thái Lọc theo Mã phòng thi & Tìm kiếm
  const [maPhongChon, setMaPhongChon] = useState<string>('TAT_CA');
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [trangThaiLoc, setTrangThaiLoc] = useState<string>('TAT_CA');

  // Sinh viên đang được xem/chấm bài (null = đang ở màn hình danh sách)
  const [baiNopDangChon, setBaiNopDangChon] = useState<BaiNopSinhVien | null>(null);

  // Tab bên trái trong màn hình chấm chi tiết: 'DE_THI' hoặc 'BAI_LAM'
  const [tabChiTietTrai, setTabChiTietTrai] = useState<'DE_THI' | 'BAI_LAM'>('BAI_LAM');

  // Input Chấm điểm & Nhận xét
  const [diemInput, setDiemInput] = useState<number>(8.5);
  const [nhanXetInput, setNhanXetInput] = useState<string>('');

  // Lấy danh sách các Mã Phòng Thi độc bản để render dropdown lọc
  const danhSachMaPhongDocBan = Array.from(
    new Set(danhSachBaiNop.map((b) => chuanHoaMaPhong(b.maPhong || 'A102')))
  );

  // Filter bài nộp theo Mã Phòng Thi, Từ khóa & Trạng thái chấm
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

  // Mở màn hình chấm bài chi tiết của sinh viên
  const xuLyMoChamChiTiet = (bn: BaiNopSinhVien) => {
    setBaiNopDangChon(bn);
    setDiemInput(bn.diemSo !== undefined ? bn.diemSo : 8.5);
    setNhanXetInput(bn.nhanXetGiangVien || 'Bài làm đạt yêu cầu. Cấu trúc rõ ràng.');
  };

  const xuLyLuuDiem = () => {
    if (!baiNopDangChon) return;
    onHienThiToast(
      'Đã lưu bài chấm',
      `Đã lưu điểm ${diemInput} cho sinh viên ${baiNopDangChon.hoTenSinhVien} (${baiNopDangChon.maSinhVien}).`,
      'success'
    );
  };

  const xuLyTraKetQua = () => {
    if (!baiNopDangChon) return;
    onHienThiToast(
      'Công bố điểm',
      `Đã gửi điểm ${diemInput} và nhận xét tới tài khoản sinh viên ${baiNopDangChon.hoTenSinhVien}.`,
      'info'
    );
    setBaiNopDangChon(null);
  };

  const xuLyTaiDeThiVe = () => {
    onHienThiToast('Tải đề thi', 'Đang tải file đề thi tự luận (.pdf) về máy...', 'info');
  };

  const xuLyTaiBaiLamVe = () => {
    if (!baiNopDangChon) return;
    const tenFile = baiNopDangChon.fileTuLuanNop?.tenFile || `BaiLam_${baiNopDangChon.maSinhVien}.pdf`;
    onHienThiToast('Tải bài làm', `Đang tải file [${tenFile}] về máy...`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ------------------------------------------------------------ */}
      {/* CẤP 1: DANH SÁCH BÀI NỘP THEO PHÒNG THI */}
      {/* ------------------------------------------------------------ */}
      {!baiNopDangChon ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Chấm bài & Đánh giá
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
              Chọn mã phòng thi và xem danh sách bài nộp của sinh viên để tiến hành chấm điểm.
            </p>
          </div>

          {/* Thanh Lọc Theo Mã Phòng Thi & Tìm Kiếm */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              {/* Lọc Mã Phòng Thi Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="var(--primary)" />
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  MÃ PHÒNG THI:
                </label>
                <select
                  className="input-custom"
                  style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}
                  value={maPhongChon}
                  onChange={(e) => setMaPhongChon(e.target.value)}
                >
                  <option value="TAT_CA">-- Tất cả mã phòng --</option>
                  {danhSachMaPhongDocBan.map((mp) => (
                    <option key={mp} value={mp}>
                      Phòng {mp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ô Tìm Kiếm Sinh Viên */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  className="input-custom"
                  style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
                  placeholder="Tìm mã sinh viên, họ tên hoặc bài kiểm tra..."
                  value={tuKhoaTimKiem}
                  onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                />
              </div>
            </div>

            {/* Bộ Lọc Trạng Thái Cham */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Trạng thái:</span>
              <select
                className="input-custom"
                style={{ fontSize: '13px' }}
                value={trangThaiLoc}
                onChange={(e) => setTrangThaiLoc(e.target.value)}
              >
                <option value="TAT_CA">Tất cả</option>
                <option value="CHUA_CHAM">● Chờ chấm</option>
                <option value="DA_CHAM">● Đã chấm</option>
              </select>
            </div>
          </div>

          {/* Bảng Danh Sách Bài Nộp Sinh Viên */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '46px', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>LỚP</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>MÃ PHÒNG</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>MÔN HỌC / BÀI THI</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NGÀY NỘP</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>ĐIỂM SỐ</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachBaiNopLoc.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Không có bài nộp nào phù hợp với bộ lọc Mã phòng "{maPhongChon}".
                    </td>
                  </tr>
                ) : (
                  danhSachBaiNopLoc.map((bn) => (
                    <tr
                      key={bn.id}
                      style={{ height: '60px', borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--primary)' }}>{bn.maSinhVien}</td>
                      <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{bn.hoTenSinhVien}</td>
                      <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{bn.lop}</td>
                      <td style={{ padding: '0 16px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '13px' }}>
                          {chuanHoaMaPhong(bn.maPhong || 'A102')}
                        </span>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{bn.monHoc}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bn.tenBaiKiemTra}</div>
                      </td>
                      <td style={{ padding: '0 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{bn.ngayNop}</td>
                      <td style={{ padding: '0 16px' }}>
                        <span className={bn.trangThaiCham === 'DA_CHAM' ? 'badge badge-success' : 'badge badge-warning'}>
                          ● {bn.trangThaiCham === 'DA_CHAM' ? 'Đã chấm' : 'Chờ chấm'}
                        </span>
                      </td>
                      <td style={{ padding: '0 16px', fontWeight: 800, fontSize: '16px', color: bn.diemSo !== undefined ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                        {bn.diemSo !== undefined ? `${bn.diemSo} / 10` : '—'}
                      </td>
                      <td style={{ padding: '0 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                          onClick={() => xuLyMoChamChiTiet(bn)}
                        >
                          <Eye size={14} /> Xem & Chấm bài
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------ */
        /* CẤP 2: MÀN HÌNH CHẤM BÀI CHI TIẾT CỦA 1 SINH VIÊN */
        /* ------------------------------------------------------------ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Bar Navigation */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setBaiNopDangChon(null)}
                style={{ padding: '8px 14px' }}
              >
                <ArrowLeft size={18} /> Quay lại danh sách
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                    MÃ PHÒNG: {chuanHoaMaPhong(baiNopDangChon.maPhong || 'A102')}
                  </span>
                  <span className={baiNopDangChon.trangThaiCham === 'DA_CHAM' ? 'badge badge-success' : 'badge badge-warning'}>
                    ● {baiNopDangChon.trangThaiCham === 'DA_CHAM' ? 'Đã chấm' : 'Chưa chấm'}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  Sinh viên: {baiNopDangChon.hoTenSinhVien} ({baiNopDangChon.maSinhVien}) - Lớp {baiNopDangChon.lop}
                </h2>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>
              Môn: <b>{baiNopDangChon.monHoc}</b>
              <br />
              {baiNopDangChon.tenBaiKiemTra}
            </div>
          </div>

          {/* Main 2-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* CỘT TRÁI: XEM ĐỀ THI & BÀI LÀM CỦA SINH VIÊN */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Segmented Control Chuyển Tab [Đề thi tự luận] / [Bài làm sinh viên] */}
              <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setTabChiTietTrai('BAI_LAM')}
                  style={{
                    padding: '10px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: tabChiTietTrai === 'BAI_LAM' ? '2px solid var(--primary)' : '2px solid transparent',
                    color: tabChiTietTrai === 'BAI_LAM' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: tabChiTietTrai === 'BAI_LAM' ? 700 : 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={16} /> 1. Bài làm của sinh viên
                </button>

                <button
                  type="button"
                  onClick={() => setTabChiTietTrai('DE_THI')}
                  style={{
                    padding: '10px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: tabChiTietTrai === 'DE_THI' ? '2px solid var(--primary)' : '2px solid transparent',
                    color: tabChiTietTrai === 'DE_THI' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: tabChiTietTrai === 'DE_THI' ? 700 : 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BookOpen size={16} /> 2. Xem đề thi tự luận gốc
                </button>
              </div>

              {/* TAB 1: BÀI LÀM CỦA SINH VIÊN */}
              {tabChiTietTrai === 'BAI_LAM' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {baiNopDangChon.fileTuLuanNop ? (
                      <div
                        style={{
                          padding: '32px',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          borderRadius: '16px',
                          border: '1px solid var(--border-subtle)',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <FileText size={56} color="var(--primary)" />
                        <h4 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          {baiNopDangChon.fileTuLuanNop.tenFile}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                          Dung lượng file: <b>{baiNopDangChon.fileTuLuanNop.kichThuoc}</b> • Nộp lúc: {baiNopDangChon.ngayNop}
                        </p>

                        <button
                          type="button"
                          className="btn-primary"
                          style={{ marginTop: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
                          onClick={xuLyTaiBaiLamVe}
                        >
                          <Download size={18} /> TẢI BÀI LÀM SINH VIÊN VỀ MÁY
                        </button>
                      </div>
                    ) : (
                      /* Trắc nghiệm Response Summary */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ padding: '16px', backgroundColor: 'var(--success-light)', borderRadius: '12px', color: 'var(--success)', fontWeight: 700 }}>
                          ✓ Bài thi trắc nghiệm trực tuyến (Tự động chấm: 9.25 / 10 điểm)
                        </div>

                        <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '10px' }}>
                          <b>Câu 1:</b> Trong SQL, lệnh lấy dữ liệu từ bảng SinhVien là gì?
                          <div style={{ marginTop: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                            ● SV chọn: A (SELECT * FROM SinhVien) - ĐÚNG (+0.25đ)
                          </div>
                        </div>

                        <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '10px' }}>
                          <b>Câu 2:</b> Câu lệnh cập nhật dữ liệu là gì?
                          <div style={{ marginTop: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                            ● SV chọn: B (UPDATE SinhVien SET...) - ĐÚNG (+0.25đ)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {baiNopDangChon.fileTuLuanNop && (
                    <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Trạng thái file bài làm: <b>Đã xác thực chữ ký số LAN</b>
                      </span>
                      <button type="button" className="btn-secondary" style={{ fontSize: '13px' }} onClick={xuLyTaiBaiLamVe}>
                        <Download size={14} /> Tải file đính kèm
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ĐỀ THI TỰ LUẬN GỐC (INLINE VIEWER & DOWNLOAD PROMPT) */}
              {tabChiTietTrai === 'DE_THI' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="badge badge-neutral">Đề thi tự luận chính thức</span>
                      <button type="button" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={xuLyTaiDeThiVe}>
                        <Download size={14} /> Tải đề thi về máy (.pdf)
                      </button>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary)' }}>
                      {baiNopDangChon.tenBaiKiemTra}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      <b>Câu 1 (4.0 điểm):</b> Hãy thiết kế cơ sở dữ liệu quan hệ cho Hệ thống Quản lý Thi cử trực tuyến UNETI bao gồm 4 bảng: SinhVien, PhongThi, BaiKiemTra, BaiNop.
                      <br /><br />
                      <b>Câu 2 (6.0 điểm):</b> Viết các câu lệnh SQL để truy vấn danh sách sinh viên có điểm trung bình từ 8.0 trở lên và tính tổng dung lượng lưu trữ bài làm.
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button type="button" className="btn-primary" onClick={xuLyTaiDeThiVe}>
                      <Download size={16} /> TẢI ĐỀ THI (.PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: BẢNG CHẤM ĐIỂM & NHẬN XÉT CỦA GIẢNG VIÊN */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Đánh giá & Nhập điểm
                </h3>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Điểm số bài thi (Thang điểm 10)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    max="10"
                    min="0"
                    className="input-custom"
                    style={{ width: '100%', fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}
                    value={diemInput}
                    onChange={(e) => setDiemInput(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Nhận xét & Ghi chú của Giảng viên
                  </label>
                  <textarea
                    className="input-custom"
                    style={{ width: '100%', height: '150px', resize: 'vertical', fontSize: '14px', lineHeight: 1.5 }}
                    value={nhanXetInput}
                    onChange={(e) => setNhanXetInput(e.target.value)}
                    placeholder="Nhập nhận xét chi tiết bài làm cho sinh viên..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  onClick={xuLyLuuDiem}
                >
                  <Save size={16} /> Lưu tạm bài chấm
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', fontWeight: 800 }}
                  onClick={xuLyTraKetQua}
                >
                  <Send size={16} /> TRẢ KẾT QUẢ CHO SV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
