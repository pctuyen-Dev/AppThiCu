import React, { useState } from 'react';
import {
  Database,
  HardDrive,
  Cloud,
  Download,
  Trash2,
  Upload,
  RefreshCw,
  Search
} from 'lucide-react';
import type { DemTrangThaiHeThong, FileHệThong } from '../../types/BoThuVienTypes';

interface QuanLyDuLieuProps {
  trangThaiHeThong: DemTrangThaiHeThong;
  danhSachFile: FileHệThong[];
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const QuanLyDuLieu: React.FC<QuanLyDuLieuProps> = ({
  danhSachFile,
  onHienThiToast
}) => {
  const [tabHienTai, setTabHienTai] = useState<'TONG_QUAN' | 'KHO_FILE' | 'DONG_BO'>('TONG_QUAN');
  const [tuKhoaTimFile, setTuKhoaTimFile] = useState<string>('');
  const [dangDongBo, setDangDongBo] = useState<boolean>(false);
  const [phanTramDongBo, setPhanTramDongBo] = useState<number>(68);

  const xuLyDongBoNgay = () => {
    setDangDongBo(true);
    let p = 68;
    const timer = setInterval(() => {
      p += 8;
      if (p >= 100) {
        setPhanTramDongBo(100);
        setDangDongBo(false);
        clearInterval(timer);
        onHienThiToast('Thành công', 'Đã đồng bộ toàn bộ 12 bản ghi lên Supabase Cloud.', 'success');
      } else {
        setPhanTramDongBo(p);
      }
    }, 300);
  };

  const danhSachFileLoc = danhSachFile.filter((f) =>
    f.tenFile.toLowerCase().includes(tuKhoaTimFile.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Dữ liệu
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Quản lý dữ liệu Cloud và lưu trữ của hệ thống UNETI EXAM.
        </p>
      </div>

      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '24px' }}>
        {[
          { id: 'TONG_QUAN', ten: 'Tổng quan' },
          { id: 'KHO_FILE', ten: 'Kho file' },
          { id: 'DONG_BO', ten: 'Đồng bộ Cloud' }
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

      {tabHienTai === 'TONG_QUAN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={24} color="var(--success)" />
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Database Cơ Sở Dữ Liệu</p>
                <span className="badge badge-success" style={{ marginTop: '2px' }}>● Hoạt động</span>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HardDrive size={24} color="var(--success)" />
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Kho Lưu Trữ File</p>
                <span className="badge badge-success" style={{ marginTop: '2px' }}>● Hoạt động</span>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Cloud size={24} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Cloud Sync Engine</p>
                <span className="badge badge-success" style={{ marginTop: '2px' }}>● Đã kết nối</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Người dùng</p>
              <h3 style={{ fontSize: '26px', fontWeight: 700, margin: '6px 0 0' }}>12.000</h3>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Bài kiểm tra</p>
              <h3 style={{ fontSize: '26px', fontWeight: 700, margin: '6px 0 0' }}>560</h3>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Bài nộp</p>
              <h3 style={{ fontSize: '26px', fontWeight: 700, margin: '6px 0 0' }}>25.000</h3>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>File lưu trữ</p>
              <h3 style={{ fontSize: '26px', fontWeight: 700, margin: '6px 0 0' }}>18.500</h3>
            </div>
          </div>
        </div>
      )}

      {tabHienTai === 'KHO_FILE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                className="input-custom"
                style={{ width: '100%', paddingLeft: '38px' }}
                placeholder="Tìm tên file..."
                value={tuKhoaTimFile}
                onChange={(e) => setTuKhoaTimFile(e.target.value)}
              />
            </div>
            <button type="button" className="btn-primary">
              <Upload size={16} /> Tải file lên
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '44px', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>TÊN FILE</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>LOẠI</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>KÍCH THƯỚC</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NGƯỜI TẠO</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NGÀY TẠO</th>
                  <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachFileLoc.map((f) => (
                  <tr key={f.id} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.tenFile}</td>
                    <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{f.loaiFile}</td>
                    <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{f.kichThuoc}</td>
                    <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{f.nguoiTao}</td>
                    <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{f.ngayTao}</td>
                    <td style={{ padding: '0 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '6px' }}
                        title="Tải xuống"
                        onClick={() => onHienThiToast('Tải file', `Đang tải ${f.tenFile}`, 'info')}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '6px' }}
                        title="Xóa"
                        onClick={() => onHienThiToast('Xóa file', `Đã xóa ${f.tenFile}`, 'error')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tabHienTai === 'DONG_BO' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Trạng thái đồng bộ Supabase Cloud</h3>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <span className="badge badge-success">● LAN Server: Hoạt động</span>
            <span className="badge badge-success">● Cloud: Đã kết nối</span>
            <span className="badge badge-success">● Database: Hoạt động</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Queue tiến trình: 12 dữ liệu bài thi chờ đồng bộ</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{phanTramDongBo}%</span>
            </div>

            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${phanTramDongBo}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '99px',
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            disabled={dangDongBo}
            onClick={xuLyDongBoNgay}
            style={{ opacity: dangDongBo ? 0.7 : 1 }}
          >
            <RefreshCw size={18} className={dangDongBo ? 'animate-spin' : ''} />
            {dangDongBo ? 'Đang đồng bộ dữ liệu...' : 'Đồng bộ ngay'}
          </button>
        </div>
      )}
    </div>
  );
};
