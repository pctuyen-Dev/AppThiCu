import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  PlusCircle,
  Square
} from 'lucide-react';
import type { PhongThi, SinhVienPhongThi } from '../../types/BoThuVienTypes';

interface ManHinhGiamSatProps {
  phongThi: PhongThi;
  onQuayLai: () => void;
  onKetThucPhong: () => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const ManHinhGiamSat: React.FC<ManHinhGiamSatProps> = ({
  phongThi,
  onQuayLai,
  onKetThucPhong,
  onHienThiToast
}) => {
  const [danhSachSVState] = useState<SinhVienPhongThi[]>(phongThi.danhSachSinhVien);
  const [hienThiModalKetThuc, setHienThiModalKetThuc] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onHienThiToast('Thông báo nộp bài', 'Sinh viên Đỗ Thị Thu Thảo (21103100124) vừa nộp bài thành công.', 'info');
    }, 4000);
    return () => clearTimeout(timer);
  }, [onHienThiToast]);

  const xuLyThemThoiGian = (maSV: string) => {
    onHienThiToast('Cộng thời gian', `Đã cộng +5 phút cho sinh viên ${maSV}.`, 'success');
  };

  const xuLyCanhBao = (maSV: string) => {
    onHienThiToast('Cảnh báo thi cử', `Đã gửi cảnh báo tới sinh viên ${maSV}.`, 'warning');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100vh', padding: '20px', backgroundColor: 'var(--bg-app)' }}>
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
            onClick={onQuayLai}
            style={{ padding: '8px 14px' }}
          >
            <ArrowLeft size={18} /> Quay lại
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                PHÒNG {phongThi.maPhong}
              </h2>
              <span className="badge badge-success">● Đang diễn ra</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {phongThi.monHoc} - {phongThi.tenBaiKiemTra}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '18px'
            }}
          >
            <Clock size={20} />
            <span>32:15</span>
          </div>

          <button
            type="button"
            className="btn-danger"
            onClick={() => setHienThiModalKetThuc(true)}
            style={{ padding: '10px 18px' }}
          >
            <Square size={16} /> Kết thúc kỳ thi
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Tổng Sinh Viên</p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 0' }}>{phongThi.tongSinhVien}</h3>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Đã Vào Phòng</p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', margin: '4px 0 0' }}>{phongThi.daVao}</h3>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Đang Làm Bài</p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', margin: '4px 0 0' }}>{phongThi.dangLam}</h3>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Đã Nộp Bài</p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>{phongThi.daNop}</h3>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--danger)', margin: 0, fontWeight: 600 }}>Mất Kết Nối LAN</p>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)', margin: '4px 0 0' }}>{phongThi.matKetNoi}</h3>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '44px', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>MÃ SINH VIÊN</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>HỌ VÀ TÊN</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>KẾT NỐI LAN</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TRẠNG THÁI</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TIẾN ĐỘ</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>LAST PING</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {danhSachSVState.map((sv) => {
              const isOffline = sv.trangThaiKetNoi === 'OFFLINE';

              return (
                <tr
                  key={sv.maSinhVien}
                  style={{
                    height: '56px',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isOffline ? 'var(--danger-light)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0 16px', fontWeight: 700, color: 'var(--primary)' }}>{sv.maSinhVien}</td>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{sv.hoTen}</td>
                  <td style={{ padding: '0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isOffline ? 'var(--danger)' : 'var(--success)' }} />
                      <span style={{ color: isOffline ? 'var(--danger)' : 'var(--success)' }}>
                        {isOffline ? 'OFFLINE' : 'ONLINE'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0 16px' }}>
                    <span className={sv.trangThaiLamBai === 'DA_NOP' ? 'badge badge-success' : sv.trangThaiLamBai === 'MAT_KET_NOI' ? 'badge badge-danger' : 'badge badge-warning'}>
                      {sv.trangThaiLamBai === 'DA_NOP' ? '● Đã nộp bài' : sv.trangThaiLamBai === 'MAT_KET_NOI' ? '● Mất kết nối' : '● Đang làm'}
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', fontWeight: 600 }}>
                    {sv.soCauDaLam} / {sv.tongSoCau} câu
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {sv.lanMoiNhatPing}
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        title="Cộng +5 phút"
                        onClick={() => xuLyThemThoiGian(sv.maSinhVien)}
                      >
                        <PlusCircle size={14} /> +5 phút
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        title="Gửi cảnh báo"
                        onClick={() => xuLyCanhBao(sv.maSinhVien)}
                      >
                        <AlertTriangle size={14} color="var(--warning)" /> Cảnh báo
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hienThiModalKetThuc && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '420px', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Xác nhận kết thúc phòng thi?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Hệ thống sẽ tự động thu bài và khóa bài làm của tất cả 43 sinh viên trong phòng. Thao tác này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setHienThiModalKetThuc(false)}>Hủy bỏ</button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setHienThiModalKetThuc(false);
                  onKetThucPhong();
                }}
              >
                Khóa bài & Kết thúc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
