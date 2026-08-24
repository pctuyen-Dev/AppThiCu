import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import type { DemTrangThaiHeThong, NhatKyHeThong } from '../../types/BoThuVienTypes';
import { useGiaoDien } from '../../theme/ContextGiaoDien';

interface QuanLyHeThongProps {
  trangThaiHeThong: DemTrangThaiHeThong;
  danhSachNhatKy: NhatKyHeThong[];
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const QuanLyHeThong: React.FC<QuanLyHeThongProps> = ({
  trangThaiHeThong,
  danhSachNhatKy,
  onHienThiToast
}) => {
  const { cheDoGiaoDien, chuyenDoiCheDoGiaoDien } = useGiaoDien();
  const [tabHienTai, setTabHienTai] = useState<'CAI_DAT' | 'TRANG_THAI' | 'HOAT_DONG'>('CAI_DAT');
  const [portServer, setPortServer] = useState<string>('8080');
  const [tanSuatDongBo, setTanSuatDongBo] = useState<string>('5Phut');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Hệ thống
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Cấu hình tham số, kiểm tra độ trễ dịch vụ và xem nhật ký hệ thống.
        </p>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '24px' }}>
        {[
          { id: 'CAI_DAT', ten: 'Cài đặt' },
          { id: 'TRANG_THAI', ten: 'Trạng thái dịch vụ' },
          { id: 'HOAT_DONG', ten: 'Nhật ký hoạt động' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabHienTai(tab.id as any)}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: tabHienTai === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: tabHienTai === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: tabHienTai === tab.id ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            {tab.ten}
          </button>
        ))}
      </div>

      {tabHienTai === 'CAI_DAT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px' }}>Giao diện phần mềm (Theme)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '12px' }}>
              <button
                type="button"
                onClick={() => chuyenDoiCheDoGiaoDien('sang')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: cheDoGiaoDien === 'sang' ? 'var(--bg-surface)' : 'transparent',
                  color: cheDoGiaoDien === 'sang' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: cheDoGiaoDien === 'sang' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: cheDoGiaoDien === 'sang' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Sun size={18} /> Light Mode
              </button>

              <button
                type="button"
                onClick={() => chuyenDoiCheDoGiaoDien('toi')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: cheDoGiaoDien === 'toi' ? 'var(--bg-surface)' : 'transparent',
                  color: cheDoGiaoDien === 'toi' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: cheDoGiaoDien === 'toi' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: cheDoGiaoDien === 'toi' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Moon size={18} /> Dark Mode
              </button>

              <button
                type="button"
                onClick={() => chuyenDoiCheDoGiaoDien('sang')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Monitor size={18} /> Theo Hệ Thống
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Cấu hình Mạng LAN & Cloud Sync</h3>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Cổng LAN Server (Port)</label>
              <input
                type="text"
                className="input-custom"
                style={{ width: '100%' }}
                value={portServer}
                onChange={(e) => setPortServer(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Tần suất tự động đồng bộ Cloud</label>
              <select
                className="input-custom"
                style={{ width: '100%' }}
                value={tanSuatDongBo}
                onChange={(e) => setTanSuatDongBo(e.target.value)}
              >
                <option value="1Phut">Mỗi 1 phút</option>
                <option value="5Phut">Mỗi 5 phút (Khuyên dùng)</option>
                <option value="15Phut">Mỗi 15 phút</option>
                <option value="ThongThuong">Chỉ đồng bộ khi kết thúc phòng thi</option>
              </select>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: 'fit-content', marginTop: '8px' }}
              onClick={() => onHienThiToast('Thành công', 'Đã lưu cấu hình hệ thống.', 'success')}
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      )}

      {tabHienTai === 'TRANG_THAI' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '44px', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TÊN DỊCH VỤ</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TRẠNG THÁI</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>ĐỘ TRỄ (LATENCY)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ten: 'LAN Server (Local Network)', status: 'Hoạt động', latency: `${trangThaiHeThong.latencyLanMs}ms` },
                { ten: 'Database CSDL SQLite/PostgreSQL', status: 'Hoạt động', latency: `${trangThaiHeThong.latencyDatabaseMs}ms` },
                { ten: 'Supabase Cloud API', status: 'Đã kết nối', latency: `${trangThaiHeThong.latencyCloudMs}ms` },
                { ten: 'Storage File Server', status: 'Hoạt động', latency: '18ms' },
                { ten: 'Realtime WebSocket Engine', status: 'Hoạt động', latency: '8ms' }
              ].map((row, idx) => (
                <tr key={idx} style={{ height: '56px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.ten}</td>
                  <td style={{ padding: '0 16px' }}>
                    <span className="badge badge-success">● {row.status}</span>
                  </td>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--primary)' }}>{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tabHienTai === 'HOAT_DONG' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '44px', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>THỜI GIAN</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NGƯỜI THỰC HIỆN</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>HÀNH ĐỘNG</th>
                <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {danhSachNhatKy.map((nk) => (
                <tr key={nk.id} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-tertiary)' }}>{nk.thoiGian}</td>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{nk.nguoiThucHien}</td>
                  <td style={{ padding: '0 16px', color: 'var(--primary)', fontWeight: 600 }}>{nk.hànhDong}</td>
                  <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{nk.chiTiet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
