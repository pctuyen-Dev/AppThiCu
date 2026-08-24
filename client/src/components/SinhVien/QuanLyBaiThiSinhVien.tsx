import React, { useState } from 'react';
import { Play, Search, X, ArrowRight, KeyRound } from 'lucide-react';
import type { PhongThi } from '../../types/BoThuVienTypes';
import { chuanHoaMaPhong } from '../../utils/MaPhongUtils';

interface QuanLyBaiThiSinhVienProps {
  danhSachPhongThi: PhongThi[];
  onVaoPhongCho: (phongThiId: string) => void;
  onVaoLamBai: (phongThiId: string) => void;
}

export const QuanLyBaiThiSinhVien: React.FC<QuanLyBaiThiSinhVienProps> = ({
  danhSachPhongThi,
  onVaoPhongCho,
  onVaoLamBai
}) => {
  const [, setTabHienTai] = useState<'DANG_DIEN_RA' | 'SAP_TOI' | 'DA_NOP'>('DANG_DIEN_RA');
  const [tuKhoaMaPhong, setTuKhoaMaPhong] = useState<string>('');
  const [maNhapTrucTiep, setMaNhapTrucTiep] = useState<string>('');

  const danhSachPhongLoc = danhSachPhongThi.filter((p) => {
    if (!tuKhoaMaPhong.trim()) return true;
    const key = chuanHoaMaPhong(tuKhoaMaPhong);
    return chuanHoaMaPhong(p.maPhong).includes(key) || p.monHoc.toLowerCase().includes(tuKhoaMaPhong.toLowerCase());
  });

  const xuLyTimPhongTrucTiep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maNhapTrucTiep.trim()) return;
    const maChuẩn = chuanHoaMaPhong(maNhapTrucTiep);
    const timPhong = danhSachPhongThi.find((p) => chuanHoaMaPhong(p.maPhong) === maChuẩn);

    if (timPhong) {
      if (timPhong.trangThai === 'DANG_THI') {
        onVaoLamBai(timPhong.id);
      } else {
        onVaoPhongCho(timPhong.id);
      }
    } else {
      alert(`Không tìm thấy phòng thi nào có mã phòng [${maChuẩn}]. Vui lòng kiểm tra lại.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Danh sách bài thi</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Theo dõi và tham gia các ca thi trực tuyến LAN/Cloud.
          </p>
        </div>

        {/* Khung Nhập Nhanh Mã Phòng Thi Trực Tiếp */}
        <form onSubmit={xuLyTimPhongTrucTiep} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <KeyRound size={16} color="var(--primary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              className="input-custom"
              style={{ width: '100%', paddingLeft: '34px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}
              placeholder="Nhập Mã phòng (VD: A102)"
              value={maNhapTrucTiep}
              onChange={(e) => setMaNhapTrucTiep(chuanHoaMaPhong(e.target.value))}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
            Vào phòng <ArrowRight size={14} />
          </button>
        </form>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { id: 'DANG_DIEN_RA', ten: 'Đang diễn ra' },
            { id: 'SAP_TOI', ten: 'Sắp tới' },
            { id: 'DA_NOP', ten: 'Đã nộp' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabHienTai(tab.id as any)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: '2px solid var(--primary)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              {tab.ten}
            </button>
          ))}
        </div>

        {/* Thanh tìm kiếm / Lọc theo mã phòng */}
        <div style={{ position: 'relative', width: '280px', marginBottom: '8px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            className="input-custom"
            style={{ width: '100%', paddingLeft: '34px', fontSize: '13px' }}
            placeholder="Lọc danh sách theo Mã phòng..."
            value={tuKhoaMaPhong}
            onChange={(e) => setTuKhoaMaPhong(e.target.value)}
          />
          {tuKhoaMaPhong && (
            <button
              type="button"
              onClick={() => setTuKhoaMaPhong('')}
              style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {danhSachPhongLoc.length === 0 ? (
          <div style={{ gridColumn: 'span 2', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            Không tìm thấy bài thi nào có Mã phòng "<b>{tuKhoaMaPhong}</b>".
          </div>
        ) : (
          danhSachPhongLoc.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: p.trangThai === 'DANG_THI' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className={p.trangThai === 'DANG_THI' ? 'badge badge-success' : 'badge badge-neutral'}>
                    ● {p.trangThai === 'DANG_THI' ? 'Đang thi' : 'Chờ bắt đầu'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                    MÃ PHÒNG: {p.maPhong}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{p.monHoc}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.tenBaiKiemTra}</p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Thời gian: {p.thoiLuongPhut} phút</span>
                {p.trangThai === 'DANG_THI' ? (
                  <button type="button" className="btn-primary" onClick={() => onVaoLamBai(p.id)}>
                    <Play size={16} /> Vào thi ngay
                  </button>
                ) : (
                  <button type="button" className="btn-secondary" onClick={() => onVaoPhongCho(p.id)}>
                    Vào phòng chờ
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
