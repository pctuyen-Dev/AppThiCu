import React from 'react';
import type { BaiNopSinhVien } from '../../types/BoThuVienTypes';

interface KetQuaSinhVienProps {
  danhSachBaiNop: BaiNopSinhVien[];
}

export const KetQuaSinhVien: React.FC<KetQuaSinhVienProps> = ({ danhSachBaiNop }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Kết quả thi cử</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Bảng tổng hợp điểm số và lời nhận xét từ Giảng viên.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '44px', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>MÔN HỌC</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>BÀI KIỂM TRA</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NGÀY NỘP</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>ĐIỂM SỐ</th>
              <th style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>NHẬN XÉT GIẢNG VIÊN</th>
            </tr>
          </thead>
          <tbody>
            {danhSachBaiNop.map((bn) => (
              <tr key={bn.id} style={{ height: '60px', borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{bn.monHoc}</td>
                <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{bn.tenBaiKiemTra}</td>
                <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{bn.ngayNop}</td>
                <td style={{ padding: '0 16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                    {bn.diemSo !== undefined ? `${bn.diemSo} / 10` : 'Chờ chấm'}
                  </span>
                </td>
                <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {bn.nhanXetGiangVien || 'Chưa có nhận xét'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
