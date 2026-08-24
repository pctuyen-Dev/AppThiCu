import React, { useState } from 'react';
import {
  Clock,
  Wifi,
  Save,
  Send,
  Upload,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flag
} from 'lucide-react';
import type { PhongThi, BaiKiemTra } from '../../types/BoThuVienTypes';

interface ManHinhLamBaiProps {
  phongThi: PhongThi;
  baiKiemTra: BaiKiemTra;
  onNopBaiThanhCong: () => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const ManHinhLamBai: React.FC<ManHinhLamBaiProps> = ({
  phongThi,
  baiKiemTra,
  onNopBaiThanhCong,
  onHienThiToast
}) => {
  const isTracNghiem = baiKiemTra.loai === 'TRAC_NGHIEM' || baiKiemTra.loai === 'KET_HOP';

  const [cauHienTaiIndex, setCauHienTaiIndex] = useState<number>(0);
  const [dapAnDaChon, setDapAnDaChon] = useState<Record<string, number>>({});
  const [danhSachCamCo, setDanhSachCamCo] = useState<Record<string, boolean>>({});

  const [fileTuLuan, setFileTuLuan] = useState<{ ten: string; kichThuoc: string } | null>(null);
  const [phanTramUpload, setPhanTramUpload] = useState<number>(0);
  const [dangUpload, setDangUpload] = useState<boolean>(false);

  const [hienThiModalXacNhanNop, setHienThiModalXacNhanNop] = useState<boolean>(false);
  const [trangThaiNop, setTrangThaiNop] = useState<'BAN_DAU' | 'DANG_GUI' | 'THANH_CONG'>('BAN_DAU');

  const danhSachCauHoi = baiKiemTra.danhSachCauHoi.length > 0 ? baiKiemTra.danhSachCauHoi : Array.from({ length: 40 }, (_, idx) => ({
    id: `q-${idx + 1}`,
    noiDungCauHoi: `Câu ${idx + 1}: Trong hệ quản trị CSDL quan hệ SQL, câu lệnh nào được dùng để lấy toàn bộ dữ liệu từ bảng SinhVien thỏa mãn điều kiện điểm trung bình >= 8.0?`,
    cacDapAn: [
      'SELECT * FROM SinhVien WHERE DiemTB >= 8.0',
      'UPDATE SinhVien SET DiemTB = 8.0',
      'DELETE FROM SinhVien WHERE DiemTB < 8.0',
      'INSERT INTO SinhVien VALUES (8.0)'
    ],
    dapAnDung: 0,
    diem: 0.25
  }));

  const cauHoiDangXem = danhSachCauHoi[cauHienTaiIndex];
  const soCauDaLam = Object.keys(dapAnDaChon).length;
  const soCauCamCo = Object.values(danhSachCamCo).filter(Boolean).length;
  const daCamCoCauHienTai = !!danhSachCamCo[cauHoiDangXem.id];

  const xuLyChonDapAn = (dapAnIndex: number) => {
    setDapAnDaChon((prev) => ({
      ...prev,
      [cauHoiDangXem.id]: dapAnIndex
    }));
  };

  // Bật/tắt cờ phân vân mà KHÔNG bắn toast gây gián đoạn
  const xuLyBatTatCamCo = () => {
    setDanhSachCamCo((prev) => ({
      ...prev,
      [cauHoiDangXem.id]: !daCamCoCauHienTai
    }));
  };

  const xuLyUploadFile = () => {
    setDangUpload(true);
    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      if (p >= 100) {
        setPhanTramUpload(100);
        setDangUpload(false);
        setFileTuLuan({ ten: 'BaiLam_21103100123_LapTrinhWeb.zip', kichThuoc: '14.2 MB' });
        clearInterval(timer);
        onHienThiToast('Tải lên thành công', 'File bài làm đã được lưu tạm trên máy chủ LAN.', 'success');
      } else {
        setPhanTramUpload(p);
      }
    }, 200);
  };

  const xuLyXacNhanNopBai = () => {
    setTrangThaiNop('DANG_GUI');
    setTimeout(() => {
      setTrangThaiNop('THANH_CONG');
      setTimeout(() => {
        setHienThiModalXacNhanNop(false);
        onNopBaiThanhCong();
      }, 1500);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-app)', userSelect: 'none' }}>
      {/* Header Bar */}
      <header
        style={{
          height: '64px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 30
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {baiKiemTra.monHoc} - {baiKiemTra.tenBaiKiemTra}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Phòng: <b style={{ color: 'var(--primary)' }}>{phongThi.maPhong}</b> • Sinh viên: <b>Nguyễn Văn Minh (21103100123)</b>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>
            <span className="animate-pulse-subtle" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <Wifi size={14} /> Kết nối LAN 12ms
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '18px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)'
            }}
          >
            <Clock size={20} />
            <span>44:32</span>
          </div>
        </div>
      </header>

      {/* Main Body - Centered Container with Padding */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            gap: '24px'
          }}
        >
          {isTracNghiem ? (
            <>
              {/* Left Question & Option Panel */}
              <div
                style={{
                  flex: 3,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Top Bar for Question Info & Flag Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-success" style={{ fontSize: '14px', padding: '6px 14px', fontWeight: 700 }}>
                        CÂU HỎI {cauHienTaiIndex + 1} / {danhSachCauHoi.length}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '13px' }}>
                        {cauHoiDangXem.diem} điểm
                      </span>
                    </div>

                    {/* Nút Cắm Cờ Phân Vân (Visual Toggle Only - No Toast Spams) */}
                    <button
                      type="button"
                      onClick={xuLyBatTatCamCo}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: daCamCoCauHienTai ? '2px solid var(--warning)' : '1px solid var(--border-color)',
                        backgroundColor: daCamCoCauHienTai ? 'var(--warning-light)' : 'var(--bg-surface-subtle)',
                        color: daCamCoCauHienTai ? 'var(--warning)' : 'var(--text-secondary)',
                        fontWeight: daCamCoCauHienTai ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <Flag size={16} fill={daCamCoCauHienTai ? 'var(--warning)' : 'none'} color={daCamCoCauHienTai ? 'var(--warning)' : 'currentColor'} />
                      {daCamCoCauHienTai ? '🚩 Đã cắm cờ phân vân' : '🚩 Cắm cờ phân vân'}
                    </button>
                  </div>

                  {/* Question Title Card - Bold & Clean */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px'
                    }}
                  >
                    <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                      {cauHoiDangXem.noiDungCauHoi}
                    </p>
                  </div>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {cauHoiDangXem.cacDapAn.map((dapAnText, idx) => {
                      const tenNhan = ['A', 'B', 'C', 'D'][idx];
                      const dangChon = dapAnDaChon[cauHoiDangXem.id] === idx;

                      return (
                        <div
                          key={idx}
                          onClick={() => xuLyChonDapAn(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '18px 22px',
                            borderRadius: '14px',
                            border: dangChon ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            backgroundColor: dangChon ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                            boxShadow: dangChon ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            if (!dangChon) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!dangChon) e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              backgroundColor: dangChon ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                              color: dangChon ? '#fff' : 'var(--text-primary)',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '15px'
                            }}
                          >
                            {tenNhan}
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: dangChon ? 700 : 400, color: 'var(--text-primary)' }}>
                            {dapAnText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={cauHienTaiIndex === 0}
                    onClick={() => setCauHienTaiIndex((prev) => Math.max(0, prev - 1))}
                    style={{ padding: '10px 20px' }}
                  >
                    <ChevronLeft size={18} /> Câu trước
                  </button>

                  <button
                    type="button"
                    className="btn-primary"
                    disabled={cauHienTaiIndex === danhSachCauHoi.length - 1}
                    onClick={() => setCauHienTaiIndex((prev) => Math.min(danhSachCauHoi.length - 1, prev + 1))}
                    style={{ padding: '10px 20px' }}
                  >
                    Câu tiếp theo <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Right Question Palette & Actions Panel */}
              <div
                style={{
                  width: '330px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 10px', color: 'var(--text-primary)' }}>
                    Ma trận câu hỏi
                  </h4>
                  
                  {/* Progress & Flag Counts */}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Đã hoàn thành:</span>
                      <b style={{ color: 'var(--primary)', fontWeight: 700 }}>{soCauDaLam} / {danhSachCauHoi.length} câu</b>
                    </div>
                    {soCauCamCo > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--warning)', fontWeight: 600 }}>🚩 Cắm cờ phân vân:</span>
                        <b style={{ color: 'var(--warning)', fontWeight: 700 }}>{soCauCamCo} câu</b>
                      </div>
                    )}
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '99px', overflow: 'hidden', marginBottom: '18px' }}>
                    <div style={{ width: `${(soCauDaLam / danhSachCauHoi.length) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease' }} />
                  </div>

                  {/* Question Grid Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                    {danhSachCauHoi.map((q, idx) => {
                      const daLam = dapAnDaChon[q.id] !== undefined;
                      const dangXem = idx === cauHienTaiIndex;
                      const isCamCo = !!danhSachCamCo[q.id];

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCauHienTaiIndex(idx)}
                          style={{
                            height: '40px',
                            borderRadius: '10px',
                            position: 'relative',
                            border: dangXem ? '2px solid var(--primary)' : isCamCo ? '2px solid var(--warning)' : '1px solid var(--border-color)',
                            backgroundColor: daLam ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                            color: daLam ? '#FFFFFF' : 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          {idx + 1}
                          {isCamCo && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--warning)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '9px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }}
                              title="Câu phân vân"
                            >
                              🚩
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submissions & Save Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                    onClick={() => onHienThiToast('Đã lưu tạm', 'Bài làm đã được lưu trên máy chủ LAN.', 'info')}
                  >
                    <Save size={16} /> LƯU TẠM BÀI LÀM
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', fontWeight: 800 }}
                    onClick={() => setHienThiModalXacNhanNop(true)}
                  >
                    <Send size={18} /> NỘP BÀI THI
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* BÀI THI TỰ LUẬN: ĐỀ THI TRỰC TIẾP (CÓ TẢI ĐỀ) & NỘP BÀI */
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* KHUNG XEM ĐỀ THI TỰ LUẬN & TẢI ĐỀ */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      Đề Thi Tự Luận
                    </span>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '13px' }}
                      onClick={() => onHienThiToast('Tải đề thi', 'Đang tải file đề thi (.pdf) về máy...', 'info')}
                    >
                      📥 Tải đề thi về máy (.pdf)
                    </button>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-primary)' }}>
                    {baiKiemTra.tenBaiKiemTra}
                  </h3>

                  <div
                    style={{
                      padding: '20px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: '14px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary)' }}>NỘI DUNG YÊU CẦU ĐỀ THI:</p>
                    <p style={{ marginTop: '8px', marginBottom: '12px' }}>
                      <b>Câu 1 (4.0 điểm):</b> Phân tích kiến trúc RESTful API và mô hình Client-Server. Nêu sự khác biệt giữa HTTP GET và POST.
                    </p>
                    <p style={{ margin: 0 }}>
                      <b>Câu 2 (6.0 điểm):</b> Xây dựng ứng dụng Web hoàn chỉnh sử dụng React và Node.js kết nối CSDL PostgreSQL/SQLite. Nén toàn bộ mã nguồn (.zip) hoặc xuất file báo cáo (.pdf) để nộp bài.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onHienThiToast('Tải đề thi', 'Đang tải file đề thi (.pdf) về máy...', 'info')}
                  >
                    📥 TẢI ĐỀ THI TỰ LUẬN (.PDF)
                  </button>
                </div>
              </div>

              {/* KHUNG TẢI LÊN BÀI LÀM NÉN SINH VIÊN (.ZIP, .RAR, .7Z) & NỘP BÀI */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center'
                }}
              >
                <div>
                  <FileText size={44} color="var(--primary)" style={{ marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Nộp Bài Thi Tự Luận (File Nén)
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
                    Định dạng file nén được chấp nhận: <b style={{ color: 'var(--primary)' }}>.ZIP, .RAR, .7Z</b> (Tối đa 50MB)
                  </p>

                  {/* Chú thích các file chứa bên trong file nén */}
                  <div
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: '12px',
                      marginBottom: '20px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textAlign: 'left',
                      lineHeight: 1.5,
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <b style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      📁 Bên trong file nén (.zip/.rar/.7z) có thể bao gồm:
                    </b>
                    • Mã nguồn Code: <code>.cpp</code>, <code>.java</code>, <code>.py</code>, <code>.cs</code>, <code>.js</code>, <code>.html</code>...
                    <br />
                    • Tài liệu báo cáo: <b>Word (.docx)</b>, <b>PDF (.pdf)</b>, <b>Excel (.xlsx)</b>, <b>PowerPoint (.pptx)</b>.
                  </div>

                  {!fileTuLuan ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        onClick={xuLyUploadFile}
                        style={{
                          border: '2px dashed var(--primary)',
                          borderRadius: '16px',
                          padding: '32px 20px',
                          backgroundColor: 'var(--primary-subtle)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <Upload size={36} color="var(--primary)" style={{ marginBottom: '10px' }} />
                        <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          Bấm vào đây hoặc kéo thả file nén bài làm (.zip, .rar, .7z)
                        </p>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                          Hệ thống tự động kiểm tra chữ ký file nén
                        </span>
                      </div>

                      {/* Thanh Tiến Trình Tải Lên (Upload Progress Bar) */}
                      {dangUpload && (
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                            <span style={{ color: 'var(--primary)' }}>Đang tải file nén lên LAN Server...</span>
                            <span style={{ color: 'var(--primary)' }}>{phanTramUpload}%</span>
                          </div>

                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${phanTramUpload}%`,
                                height: '100%',
                                backgroundColor: 'var(--primary)',
                                borderRadius: '99px',
                                transition: 'width 0.2s ease-in-out'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Card Đã Tải File Nén Thành Công */
                    <div style={{ padding: '20px', backgroundColor: 'var(--success-light)', borderRadius: '16px', border: '1px solid var(--success)', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle2 size={32} color="var(--success)" />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--success)', margin: 0 }}>
                            ● Đã đính kèm file nén bài làm
                          </p>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                            {fileTuLuan.ten}
                          </p>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Dung lượng: <b>{fileTuLuan.kichThuoc}</b> • Trạng thái: <b>Đã nén an toàn</b>
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                          onClick={xuLyUploadFile}
                        >
                          🔄 Thay đổi file nén khác
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '16px', fontWeight: 800 }}
                    onClick={() => setHienThiModalXacNhanNop(true)}
                  >
                    <Send size={18} /> NỘP BÀI THI TỰ LUẬN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {hienThiModalXacNhanNop && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '420px', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
            {trangThaiNop === 'BAN_DAU' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>Bạn có chắc muốn nộp bài?</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Bạn đã làm <b>{soCauDaLam} / {danhSachCauHoi.length} câu</b>.
                </p>
                {soCauCamCo > 0 && (
                  <div style={{ padding: '10px', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    ⚠️ Lưu ý: Bạn còn <b>{soCauCamCo} câu</b> đang cắm cờ phân vân chưa chắc chắn.
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setHienThiModalXacNhanNop(false)}>Làm tiếp</button>
                  <button type="button" className="btn-primary" onClick={xuLyXacNhanNopBai}>Xác nhận nộp</button>
                </div>
              </>
            )}

            {trangThaiNop === 'DANG_GUI' && (
              <div style={{ padding: '20px 0' }}>
                <div className="animate-spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
                <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Đang gửi bài lên máy chủ LAN...</p>
              </div>
            )}

            {trangThaiNop === 'THANH_CONG' && (
              <div style={{ padding: '20px 0', animation: 'modalPhongTo 0.2s ease-out forwards' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Đã nộp bài thành công!</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Dữ liệu đã được bảo mật & đồng bộ.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
